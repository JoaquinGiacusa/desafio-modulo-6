import { Router } from "@vaadin/router";

customElements.define(
  "home-page",
  class extends HTMLElement {
    //shadow: ShadowRoot;
    constructor() {
      super();
      //this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();

      const botton = document.querySelector(".boton-start");
      botton.addEventListener("click", () => {
        Router.go("/rules");
      });
    }
    render() {
      this.innerHTML = `
      <div>
      <h1>HOLA SOY EL LA PAGINA DE Inicio v2</h1>
      <button class="boton-start">COMENZAR</button>
      </div>
      `;
    }
  }
);
