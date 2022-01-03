customElements.define(
  "boton-el",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const boton = document.createElement("button");
      const style = document.createElement("style");
      style.textContent = `
      .blue-button {
        color: white;
        font-size: 45px;
        background-color: #006cfc;
        border: 10px solid #001997;
        border-radius: 10px;
        font-family: "Odibee Sans", cursive;
        width: 100%;
        width: 280px;
      }
    `;
      boton.textContent = this.textContent;
      boton.classList.add("blue-button");
      this.shadow.appendChild(style);
      this.shadow.appendChild(boton);
    }
  }
);
