import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "results-page",
  class extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const cs = state.getState();

      state.getHistoryPlays(() => {
        state.winsResults();
        this.render();
      });

      // state.pushToHistory(
      //   state.suscribe(() => {
      //     if (
      //       cs.status == "history setted" &&
      //       window.location.pathname == "/results-page"
      //     ) {
      //       state.getHistoryPlays(() => {
      //         state.winsResults();
      //         this.render();
      //       });
      //     }
      //   })
      // );

      // state.pushToHistory(() => {
      //   if (cs.status == "history setted") {
      //     state.getHistoryPlays(() => {
      //       state.winsResults();
      //       this.render();
      //     });
      //   }
      // });
    }
    render() {
      const style = document.createElement("style");
      const imageURL = require("url:../../img/fondo-full.png");
      const div = document.createElement("div");

      div.innerHTML = `
      <div class="resutls">
        <div class="container"></div>
      </div>
      `;

      function showWhoWin() {
        const container = div.querySelector(".container");
        const cs = state.getState();

        const resultado = state.whoWins(
          cs.currentGame.myPlay,
          cs.currentGame.opponentPlay
        );

        container.innerHTML = `
        <div class="img-container">
        <estrella-el result=${resultado}></estrella-el>
        </div>
        <div class="score">
        <custom-text text="body">Score</custom-text>
        <custom-text text="body">${cs.fullName}:${cs.results.me}</custom-text>
        <custom-text text="body">${cs.opponentName}:${cs.results.opp}</custom-text>
        </div>
        <boton-el class="boton">Volver a jugar</boton-el>
        `;
        container.querySelector(".boton").addEventListener("click", () => {
          Router.go("/reglas-game");
        });
      }

      showWhoWin();

      style.innerHTML = `
      .resutls{
        background-image: url(${imageURL});
        height: 100vh;
        width: 100%;
      }

      .score{
        background: #ffffff;
        border: 10px solid #000000;
        box-sizing: border-box;
        border-radius: 10px;
        padding: 20px;
        max-width:350px;
      }

      .container{
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;
      }`;

      this.shadow.appendChild(div);
      this.shadow.appendChild(style);
    }
  }
);
