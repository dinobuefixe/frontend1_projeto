window.getCurrentTheme = function () {
    return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
};

window.applyTheme = function (theme) {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

window.loadSavedTheme = function () {
    const saved = localStorage.getItem("theme");
    applyTheme(saved === "dark" ? "dark" : "light");
};

document.addEventListener("DOMContentLoaded", () => {
    loadSavedTheme();
});


async function buscarAnimes() {
    const limite = 500;
    const porPagina = 25; // Jikan devolve 25 por página
    const paginasNecessarias = Math.ceil(limite / porPagina);

    let lista = [];

    for (let p = 1; p <= paginasNecessarias; p++) {
        try {
            const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${p}`);
            const json = await res.json();

            if (json.data) {
                lista = lista.concat(json.data);

                // Se já atingiu 500, corta o excesso
                if (lista.length >= limite) {
                    lista = lista.slice(0, limite);
                    break;
                }
            }
        } catch (err) {
            console.warn("Falha ao buscar página", p);
        }
    }

    return lista;
}


async function filtrarAnimes(lista) {
    return lista.slice(0, 20).map(anime => ({
        ...anime,
        capaOriginal: anime.images?.jpg?.large_image_url
    }));
}

async function carregarDados() {
    const listaDestacados = document.querySelector("#listaDestacados");
    const listaCards = document.querySelector("#listaCards");
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    try {
        const loader = document.createElement("div");
        loader.id = "loader";
        loader.innerHTML = `<div class="spinner"></div>`;
        document.body.appendChild(loader);

        loader.style.display = "flex";

        let data = await buscarAnimes();

        loader.style.display = "none";

        data = data.sort(() => Math.random() - 0.5);

        const animes = await filtrarAnimes(data);

        const comTrailer = animes.filter(a => a.trailer?.embed_url);

        // DESTACADO GRANDE
        const primeiro = comTrailer[0] || animes[0];

        const divGrande = document.createElement("div");
        divGrande.classList.add("animeDestacado");

        const trailerURL = primeiro.trailer?.embed_url
            ? primeiro.trailer.embed_url + "?autoplay=1&mute=1&controls=0"
            : null;

        divGrande.innerHTML = `
            ${trailerURL
                ? `<iframe src="${trailerURL}" allow="autoplay" allowfullscreen></iframe>`
                : `<div class="wallpaper" style="background-image: url('${primeiro.capaOriginal}')"></div>`
            }
            <p>${primeiro.title_english || primeiro.title}</p>
        `;

        listaDestacados.appendChild(divGrande);

        // DESTACADOS MENORES
        comTrailer.slice(1, 3).forEach(item => {
            const div = document.createElement("div");
            div.classList.add("animeDestacadoMenor");

            let youtubeId = item.trailer?.youtube_id;

            if (!youtubeId && item.trailer?.embed_url) {
                const match = item.trailer.embed_url.match(/embed\/([^?]+)/);
                if (match) youtubeId = match[1];
            }

            const thumb = youtubeId
                ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                : item.capaOriginal;

            div.innerHTML = `
                <div class="wallpaper" style="background-image: url('${thumb}')"></div>
                <p>${item.title_english || item.title}</p>
            `;

            listaDestacados.appendChild(div);
        });

        // CARDS (LISTA NORMAL)
        animes.slice(10, 17).forEach(item => {
            const div = document.createElement("div");
            div.classList.add("animeCard");

            div.innerHTML = `
                <img class="capaAnime" src="${item.capaOriginal}" alt="${item.title}" data-id="${item.mal_id}">
                <p>${item.title_english || item.title}</p>
            `;

            listaCards.appendChild(div);
        });

        // SWIPER (MESMO LAYOUT DOS CARDS)
        async function carregarDados() {
            const swiperWrapper = document.querySelector(".swiper-wrapper");

            animes.slice(18, 28).forEach(item => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");

                slide.innerHTML = `
                <img src="${item.capaOriginal}" alt="${item.title}">
                <p>${item.title_english || item.title}</p>
            `;

                swiperWrapper.appendChild(slide);
            });

            // AGORA SIM inicializa o Swiper
            new Swiper(".mySwiper", {
                effect: "cards",
                grabCursor: true,
            });


            document.querySelectorAll(".capaAnime").forEach(capa => {
                capa.addEventListener("click", () => {
                    const id = capa.dataset.id;
                    window.location.href = `anime.html?id=${id}`;
                });
            });


        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

document.querySelectorAll(".capaAnime").forEach(capa => {
    capa.addEventListener("click", () => {
        console.log("sigma!");
        const id = capa.dataset.id;
        window.location.href = `anime.html?id=${id}`;
    });
});

document.addEventListener("DOMContentLoaded", carregarDados);
