import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "waiting-play",
  class extends HTMLElement {
    shadow: ShadowRoot;
    roomId: string;
    name: string;
    opponentName: string;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const cs = state.getState();
      this.roomId = cs.roomId;
      this.name = cs.fullName;

      this.render();

      state.checkOpponentReady();

      state.suscribe(() => {
        if (
          cs.ready == true &&
          cs.opponentReady == true &&
          window.location.pathname == "/waiting-play"
        ) {
          Router.go("/play-game");
        }
      });
    }
    render() {
      const cs = state.getState();
      const style = document.createElement("style");
      const imageURL = require("url:../../img/fondo-full.png");
      const div = document.createElement("div");

      div.innerHTML = `
      <div class="waiting-page">
        <div class="text-container">
          <custom-text>Esperando a que ${cs.opponentName} presione ¡Jugar!...</custom-text>
          
        </div>
        <div class="jugada-container">
          <my-jugada class="jugada" jugada="piedra"></my-jugada>
          <my-jugada class="jugada" jugada="papel"></my-jugada>
          <my-jugada class="jugada" jugada="tijera"></my-jugada>
        </div>
    </div>
      `;

      style.innerHTML = `
      .waiting-page {
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
