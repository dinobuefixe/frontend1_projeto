document.addEventListener("DOMContentLoaded", carregarDados);

// ---------------------------------------------------------
// FUNÇÃO PARA ABRIR A PÁGINA DO ANIME
// ---------------------------------------------------------

function abrirAnime(id) {
    window.location.href = `anime.html?id=${id}`;
}

// ---------------------------------------------------------
// 1. LOADERS
// ---------------------------------------------------------

function criarLoaders() {
    const listaDestacados = document.querySelector("#listaDestacados");
    const listaCards = document.querySelector("#listaCards");
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    // Loader do destaque grande
    const grande = document.createElement("div");
    grande.classList.add("animeDestacado");
    grande.innerHTML = `
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-title"></div>
    `;
    listaDestacados.appendChild(grande);

    // Wrapper dos menores
    const wrapperMenores = document.createElement("div");
    wrapperMenores.classList.add("destacadosMenores");
    listaDestacados.appendChild(wrapperMenores);

    // 4 loaders dos menores
    for (let i = 0; i < 4; i++) {
        const div = document.createElement("div");
        div.classList.add("animeDestacadoMenor");
        div.innerHTML = `
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-title"></div>
        `;
        wrapperMenores.appendChild(div);
    }

    // 7 loaders dos cards
    for (let i = 0; i < 7; i++) {
        const div = document.createElement("div");
        div.classList.add("animeCard");
        div.innerHTML = `
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-title"></div>
        `;
        listaCards.appendChild(div);
    }

    // 10 loaders do swiper
    for (let i = 0; i < 10; i++) {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = `
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-title"></div>
        `;
        swiperWrapper.appendChild(slide);
    }
}


function substituirLoader(elemento, html) {
    if (!elemento) return;
    elemento.style.opacity = "0";

    setTimeout(() => {
        elemento.innerHTML = html;
        elemento.style.transition = "opacity .4s";
        elemento.style.opacity = "1";
    }, 50);
}

// ---------------------------------------------------------
// 5. CARREGAR DADOS
// ---------------------------------------------------------

async function carregarDados() {
    criarLoaders();

    const listaDestacados = document.querySelector("#listaDestacados");
    const wrapperMenores = document.querySelector(".destacadosMenores");
    const listaCards = document.querySelector("#listaCards");
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    const data = await buscarAnimes();
    const animes = prepararAnimes(data);
    const comTrailer = animes.filter(a => a.trailer?.embed_url);

    // TRAILER GRANDE
    const primeiro = comTrailer[0] || animes[0];

    const trailerURL = primeiro.trailer?.embed_url
        ? `${primeiro.trailer.embed_url}?autoplay=1&mute=1&controls=0`
        : null;

    substituirLoader(listaDestacados.children[0], `
        ${trailerURL
            ? `<iframe onclick="abrirAnime(${primeiro.mal_id})" src="${trailerURL}" allow="autoplay" allowfullscreen></iframe>`
            : `<div onclick="abrirAnime(${primeiro.mal_id})" class="wallpaper" style="background-image:url('${primeiro.capaOriginal}')"></div>`
        }
        <p onclick="abrirAnime(${primeiro.mal_id})">${primeiro.title_english || primeiro.title}</p>
    `);

    // 4 DESTAQUES MENORES
    for (let i = 0; i < 4; i++) {
        await new Promise(r => setTimeout(r, 150));

        const item = comTrailer[i + 1] || animes[i + 1];
        if (!item) continue;

        let youtubeId = item.trailer?.youtube_id;

        if (!youtubeId && item.trailer?.embed_url) {
            const match = item.trailer.embed_url.match(/embed\/([^?]+)/);
            if (match) youtubeId = match[1];
        }

        const thumb = youtubeId
            ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            : item.capaOriginal;

        substituirLoader(wrapperMenores.children[i], `
            <div onclick="abrirAnime(${item.mal_id})" class="wallpaper" style="background-image:url('${thumb}')"></div>
            <p onclick="abrirAnime(${item.mal_id})">${item.title_english || item.title}</p>
        `);
    }

    // CARDS
    for (let i = 0; i < 7; i++) {
        await new Promise(r => setTimeout(r, 120));

        const item = animes[10 + i];
        if (!item) continue;

        substituirLoader(listaCards.children[i], `
            <img onclick="abrirAnime(${item.mal_id})" class="capaAnime" src="${item.capaOriginal}" alt="${item.title}">
            <p onclick="abrirAnime(${item.mal_id})">${item.title_english || item.title}</p>
        `);
    }

    // SWIPER
    for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 100));

        const item = animes[18 + i] || animes[i];
        if (!item) continue;

        substituirLoader(swiperWrapper.children[i], `
            <div class="swiper-card">
                <img onclick="abrirAnime(${item.mal_id})" src="${item.capaOriginal}" alt="${item.title}">
            </div>
            <p onclick="abrirAnime(${item.mal_id})" class="swiper-title">${item.title_english || item.title}</p>
        `);
    }

    new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
    });
}
