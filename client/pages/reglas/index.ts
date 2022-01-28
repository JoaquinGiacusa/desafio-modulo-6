import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "reglas-game",
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
      this.opponentName = cs.opponentName;

      state.setOpponentName();

      state.getHistoryPlays(() => {
        console.log("history", cs.history);

        state.winsResults();
        this.render();

        const botonJugar = this.shadowRoot.querySelector(".start-game");
        botonJugar.addEventListener("click", () => {
          state.setReady();
          Router.go("/waiting-play");
        });
      });

      // const botonJugar = this.shadowRoot.querySelector(".start-game");
      // botonJugar.addEventListener("click", () => {
      //   state.setReady();
      //   Router.go("/waiting-play");
      // });

      // window.addEventListener("beforeunload", () => {
      //   state.setUnready();
      // });
    }
    render() {
      const cs = state.getState();
      const style = document.createElement("style");
      const imageURL = require("url:../../img/fondo-full.png");
      const div = document.createElement("div");

      div.innerHTML = `
      <div class="rules-page">
      <div class="header">
      <div class="scores">
        <h3>${this.name}: ${cs.results.me}</h3>
        <h3>${this.opponentName}: ${cs.results.opp}</h3>
      </div>
      <div class="header-roomId">Sala:${this.roomId}</div>
    </div>
        <div class="text-container">
          <custom-text>Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</custom-text>
          <boton-el class="start-game">¡Jugar!</boton-el>
        </div>
        <div class="jugada-container">
          <my-jugada class="jugada" jugada="piedra"></my-jugada>
          <my-jugada class="jugada" jugada="papel"></my-jugada>
          <my-jugada class="jugada" jugada="tijera"></my-jugada>
        </div>
    </div>
      `;

      style.innerHTML = `
      .rules-page {
        background-image: url(${imageURL});
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .header{
        max-width: 800px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-family: "Odibee Sans", cursive;
        font-size: 25px;
      }

      .header-roomId{
        display: flex;
        flex-direction: column;
        justify-content:center;
        font-size: 30px;
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
