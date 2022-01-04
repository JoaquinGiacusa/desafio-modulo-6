import { state } from "../../state";
import { Router } from "@vaadin/router";

customElements.define(
  "new-game",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();

      const boton = this.shadow.querySelector(".return-to-game-btn");
      const inputComp = this.shadow.querySelector(".input-text");
      const inputEl = inputComp.querySelector(".input") as any;

      boton.addEventListener("click", () => {
        if (inputEl.value != "") {
          state.setFullName(inputEl.value);
          state.register(() => {
            state.signIn();
          });
        }
      });
    }
    render() {
      const style = document.createElement("style");
      const imageURL = require("url:../../img/fondo-full.png");
      const div = document.createElement("div");

      div.innerHTML = `
      <div class="new-game-page">
        <div class="title__container">
          <custom-text text="title"> Piedra Papel ó Tijera </custom-text>
        </div>
        <div class="input-container">
          <input-el class="input-text" text="Nombre">Tu Nombre</input-el>
        </div>
        <div class="boton-container">
          <boton-el class="return-to-game-btn">Empezar</boton-el>
        </div>
        <div class="jugada-container">
          <my-jugada class="jugada" jugada="piedra"></my-jugada>
          <my-jugada class="jugada" jugada="papel"></my-jugada>
          <my-jugada class="jugada" jugada="tijera"></my-jugada>
        </div>
    </div>
      `;

      style.innerHTML = `
      .new-game-page {
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
        margin-bottom: 10px;
      }
    
      @media (min-width: 769px) {
        .title__container {
          margin-bottom: 50px;
        }
      }

      .input-container{
        margin-bottom: 20px;
      }
    
      .boton-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
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

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
