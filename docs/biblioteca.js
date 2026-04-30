const API = "https://69de96e1d6de26e119281675.mockapi.io/api/projects/project";
const lista = document.getElementById("listaReviews");

// ---------------------------------------------------------
// 1. Carregar todas as reviews
// ---------------------------------------------------------
async function carregarReviews() {
    lista.innerHTML = "<p>A carregar...</p>";

    const res = await fetch(API);
    const reviews = await res.json();

    if (reviews.length === 0) {
        lista.innerHTML = "<p>Nenhuma review encontrada.</p>";
        return;
    }

    lista.innerHTML = "";

    for (const r of reviews) {
        const div = document.createElement("div");
        div.classList.add("reviewCard");

        const animeJikan = await buscarAnimePorID(r.animeId);
        const animesPreparados = prepararAnimes([animeJikan]);

        // --- TRUNCAR TEXTO AQUI ---
        let reviewTexto = r.review || "Sem texto";
        const maxChars = 180;
        if (reviewTexto.length > maxChars) {
            reviewTexto = reviewTexto.slice(0, maxChars) + "...";
        }

        div.innerHTML = `
            <div class="reviewLeft">
                <h2>${r.animeNome}</h2>
                <p class="nota"><strong>Nota:</strong> ${r.nota}</p>

                <p><strong>Review:</strong></p>
                <p class="reviewTexto">${reviewTexto}</p>

                <div class="botoes">
                    <button class="abrir" onclick="abrirAnime(${r.animeId})">Abrir Anime</button>
                    <button class="editar" onclick="editarReview('${r.id}')">Editar</button>
                    <button class="apagar" onclick="apagarReview('${r.id}')">Apagar</button>
                </div>
            </div>

            <div class="reviewRight">
                <img src="${animesPreparados[0].capaOriginal}" class="reviewCapa">
            </div>
        `;


        lista.appendChild(div);
    }
}

// ---------------------------------------------------------
// 2. Abrir página do anime
// ---------------------------------------------------------
function abrirAnime(id) {
    window.location.href = `anime.html?id=${id}`;
}

// ---------------------------------------------------------
// 3. Editar review
// ---------------------------------------------------------
async function editarReview(id) {
    const res = await fetch(`${API}/${id}`);
    const r = await res.json();

    const card = [...document.querySelectorAll(".reviewCard")]
        .find(c => c.innerHTML.includes(`editarReview('${id}')`));

    if (!card) return;

    card.classList.add("editMode");

    card.innerHTML = `
        <h2>${r.animeNome}</h2>

        <label><strong>Nota:</strong></label>
        <input id="editNota${id}" type="number" min="1" max="10" value="${r.nota}" style="width:60px">

        <br><br>

        <label><strong>Review:</strong></label>
        <textarea id="editTexto${id}" rows="6" style="width:100%">${r.review || ""}</textarea>

        <div class="botoes" style="margin-top:10px;">
            <button class="abrir" onclick="abrirAnime(${r.animeId})">Abrir Anime</button>
            <button class="editar" onclick="guardarEdicao('${id}')">Guardar</button>
            <button class="apagar" onclick="carregarReviews()">Cancelar</button>
        </div>
    `;
}

async function guardarEdicao(id) {
    const nota = document.getElementById(`editNota${id}`).value;
    const review = document.getElementById(`editTexto${id}`).value.trim();

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota, review })
    });

    carregarReviews();
}

// ---------------------------------------------------------
// 4. Apagar review
// ---------------------------------------------------------
async function apagarReview(id) {
    if (!confirm("Tens a certeza que queres apagar esta review?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });

    carregarReviews();
}

carregarReviews();
