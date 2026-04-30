document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    let animeNome = "";
    let reviewExistenteId = null; // ← se existir review, guardamos aqui

    async function carregarAnime() {
        if (!animeId) return;

        const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const json = await res.json();
        const anime = json.data;

        animeNome = anime.title;

        document.getElementById("animeCapa").src = anime.images.jpg.large_image_url;
        document.getElementById("animeTitulo").textContent = anime.title;
        document.getElementById("notaGlobal").textContent = anime.score || "N/A";
        document.getElementById("episodios").textContent = anime.episodes || "N/A";
        document.getElementById("temporadas").textContent = anime.season || "N/A";
        document.getElementById("lancamento").textContent = anime.year || "N/A";
        document.getElementById("ranking").textContent = anime.rank || "N/A";
        document.getElementById("popularidade").textContent = anime.popularity || "N/A";
    }

    carregarAnime();

    // Slider da nota
    const notaInput = document.getElementById("nota");
    const notaValor = document.getElementById("notaValor");

    notaInput.value = 5;
    notaValor.textContent = 5;

    notaInput.addEventListener("input", e => {
        notaValor.textContent = e.target.value;
    });

    const guardarBtn = document.getElementById("guardar");
    const reviewInput = document.getElementById("review");

    // 🔥 1. Verificar se já existe review deste anime
    async function carregarReviewExistente() {
        const res = await fetch(`https://69de96e1d6de26e119281675.mockapi.io/api/projects/project?animeId=${animeId}`);
        const reviews = await res.json();

        // Se NÃO existir review → deixa tudo vazio
        if (reviews.length === 0) {
            reviewInput.value = "";
            notaInput.value = 5;
            notaValor.textContent = 5;
            reviewExistenteId = null;
            return;
        }

        // Se existir review → preencher inputs
        const r = reviews[0];
        reviewExistenteId = r.id;

        reviewInput.value = r.review || "";
        notaInput.value = r.nota || 5;
        notaValor.textContent = r.nota || 5;
    }


    carregarReviewExistente();

    // 🔥 2. Guardar ou atualizar review
    guardarBtn.addEventListener("click", async () => {
        const dados = {
            animeId: animeId,
            animeNome: animeNome,
            review: reviewInput.value.trim(),
            nota: notaInput.value
        };

        let url = "https://69de96e1d6de26e119281675.mockapi.io/api/projects/project";
        let metodo = "POST";

        // Se já existe review → UPDATE
        if (reviewExistenteId) {
            url += `/${reviewExistenteId}`;
            metodo = "PUT";
        }

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (!res.ok) throw new Error("Erro ao enviar review");

            alert(reviewExistenteId ? "Review atualizada!" : "Review criada!");
        } catch (erro) {
            console.error(erro);
            alert("Erro ao guardar review");
        }
    });
});
