const animeInfo = document.getElementById("animeInfo");

if (animeInfo) {
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get("id");

    animeInfo.innerHTML = `
        <h1>Anime ID: ${animeId}</h1>
        <p>Aqui vais carregar os dados do anime com este ID.</p>
    `;
}

const params = new URLSearchParams(window.location.search);
const animeId = params.get("id");

async function carregarAnime() {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const json = await res.json();
    const anime = json.data;

    document.getElementById("animeCapa").src = anime.images.jpg.large_image_url;
    document.getElementById("animeTitulo").textContent = anime.title;
    document.getElementById("notaGlobal").textContent = anime.score || "N/A";
    document.getElementById("episodios").textContent = anime.episodes || "N/A";
    document.getElementById("temporadas").textContent = anime.season || "N/A";
    document.getElementById("lancamento").textContent = anime.year || "N/A";
    document.getElementById("ranking").textContent = anime.rank || "N/A";
    document.getElementById("popularidade").textContent = anime.popularity || "N/A";

    // sliders pessoais
    document.getElementById("episodiosVistos").max = anime.episodes || 100;
}

carregarAnime();

// Atualizar valores dos sliders
document.getElementById("nota").addEventListener("input", e => {
    document.getElementById("notaValor").textContent = e.target.value;
});

document.getElementById("episodiosVistos").addEventListener("input", e => {
    document.getElementById("episodiosVistosValor").textContent = e.target.value;
});

document.getElementById("temporadasVistas").addEventListener("input", e => {
    document.getElementById("temporadasVistasValor").textContent = e.target.value;
});

// Guardar dados pessoais
document.getElementById("guardar").addEventListener("click", () => {
    const dados = {
        review: document.getElementById("review").value,
        nota: document.getElementById("nota").value,
        episodiosVistos: document.getElementById("episodiosVistos").value,
        temporadasVistas: document.getElementById("temporadasVistas").value
    };

    localStorage.setItem(`anime_${animeId}`, JSON.stringify(dados));
    alert("Guardado!");
});
