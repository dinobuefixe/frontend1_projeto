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
    const res = await fetch("https://api.jikan.moe/v4/top/anime?page=1");
    const json = await res.json();
    return json.data || [];
}


function prepararAnimes(lista) {
    return lista
        .map(a => ({ ...a, capaOriginal: a.images?.jpg?.large_image_url }))
        .sort(() => Math.random() - 0.5);
}

async function buscarAnimePorID(id) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const json = await res.json();
    return json.data || null;
}

async function buscarAnimePorNome(nome) {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(nome)}`);
    const json = await res.json();
    return json.data || null;
}
