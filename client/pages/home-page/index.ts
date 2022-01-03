import { Router } from "@vaadin/router";

customElements.define(
  "home-page",
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
        <div class="title__container">
          <custom-text text="title"> Piedra Papel ó Tijera </custom-text>
        </div>
        <div class="boton-container">
          <boton-el class="new-game-btn">Nuevo Juego</boton-el>
          <boton-el class="return-to-game-btn">Inglesar a una sala</boton-el>
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
    
      .title__container{
        margin: 0 auto;
        text-align: center;
        width:250px;
        margin-top: 40px;
        margin-bottom: 40px;
      }
    
      @media (min-width: 900px) {
        .title__container {
          
        }
      }
    
      .boton-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
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
      goTo("/new-game", ".new-game-btn");
      goTo("/join-room", ".return-to-game-btn");

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);