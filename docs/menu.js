document.addEventListener("DOMContentLoaded", () => {
    const comp = document.createElement("user-menu-theme");
    document.body.appendChild(comp);
});


class UserMenuTheme extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/menu.css">

            <a href="index.html" class="logo-container">
                <img src="logo.png" alt="Logo" class="logo">
            </a>

            <header>
                <nav class="navbar">
                    <div class="user-menu">
                        <img src="user.png" alt="User" class="user-btn" id="userBtn">
                        
                        <div class="menu" id="menu">
                            <ul>
                                <li><a href="biblioteca.html">Biblioteca</a></li>
                            </ul>

                            <label class="switch">
                                <input type="checkbox" id="themeToggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </nav>
            </header>
        `;

    }

    connectedCallback() {
        const userBtn = this.shadowRoot.getElementById("userBtn");
        const menu = this.shadowRoot.getElementById("menu");
        const themeToggle = this.shadowRoot.getElementById("themeToggle");

        userBtn.addEventListener("click", () => {
            menu.classList.toggle("active");
        });

        // Atualizar o toggle com base no tema atual
        themeToggle.checked = getCurrentTheme() === "dark";

        themeToggle.addEventListener("change", () => {
            if (themeToggle.checked) {
                applyTheme("dark");
                localStorage.setItem("theme", "dark");
            } else {
                applyTheme("light");
                localStorage.setItem("theme", "light");
            }
        });
    }




}


customElements.define("user-menu-theme", UserMenuTheme);
