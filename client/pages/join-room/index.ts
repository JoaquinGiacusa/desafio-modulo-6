import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "join-room",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const cs = state.getState();

      this.render();

      const boton = this.shadow.querySelector(".join-room-btn");

      const inputCodigo = this.shadow.querySelector(".input-text-codigo");
      const inputElCod = inputCodigo.querySelector(".input") as any;

      boton.addEventListener("click", () => {
        if (inputElCod.value != "") {
          state.setExistentRoomId(inputElCod.value);
          state.signIn(() => {
            state.accessToRoom(() => {
              state.checkHostAndGuest(() => {
                state.setHostAndGuest(() => {
                  if (cs.status.hasOwnProperty("3")) {
                    Router.go("/complete-room");
                  } else if (
                    cs.status.hasOwnProperty("1") ||
                    cs.status.hasOwnProperty("2")
                  ) {
                    Router.go("/share-key");
                  }
                });
              });
            });
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
       
      <div class="main-container">
        <custom-text class="title">Ingresa el codigo de sala</custom-text>
        <input-el class="input-text-codigo" placeholder="código"></input-el>
        <boton-el class="join-room-btn">Ingresar a la sala</boton-el>
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
    
        .main-container{
          display:grid;
          gap: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title{
          margin-top:100px;
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
