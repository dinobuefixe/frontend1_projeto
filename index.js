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



