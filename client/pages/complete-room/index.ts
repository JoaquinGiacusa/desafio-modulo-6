import { Router } from "@vaadin/router";

customElements.define(
  "complete-room",
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
      const style = document.createElement("style");
      const imageURL = require("url:../../img/fondo-full.png");
      const div = document.createElement("div");

      div.innerHTML = `
      <div class="home-page">
        <div class="text-container">
          <custom-text>Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.</custom-text>
          <boton-el class="return-to-game-btn">Regresar al inicio</boton-el>
        </div>
        <div class="jugada-container">
          <my-jugada class="jugada" jugada="piedra"></my-jugada>
          <my-jugada class="jugada" jugada="papel"></my-jugada>
          <my-jugada class="jugada" jugada="tijera"></my-jugada>
        </div>
    </div>
      `;

      function goTo(ruta, clase) {
        div.querySelector(clase).addEventListener("click", () => {
          Router.go(ruta);
        });
      }

      style.innerHTML = `
      .home-page {
        background-image: url(${imageURL});
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .text-container{
        width: 100%;
        width: 300px;
        height: 90vh;
        display: flex;
        flex-direction: column;
        text-align:center;
        justify-content: center;
      }

      .new-game-btn{
        margin-bottom: 20px;
      }

      .jugada-container{
        width:280px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        position: fixed;
        bottom: -30px;
      }
      @media (min-width: 769px) {
        .jugada-container{
          width:450px;
          bottom: -70px;
        }
      }

      .jugada{
      }

      @media (min-width: 769px) {
        .jugada {
        height:180px;
       width: 80px;
        }
      }
      `;

      goTo("/", ".return-to-game-btn");

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
