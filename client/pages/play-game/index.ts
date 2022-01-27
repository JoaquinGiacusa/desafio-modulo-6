import { Router } from "@vaadin/router";
import { state } from "../../state";

customElements.define(
  "play-game",
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
      <div class="play-page">
      <div class="counter-container"></div>
        <div class="jugada-container">
          <my-jugada class="jugada" jugada="piedra"></my-jugada>
          <my-jugada class="jugada" jugada="papel"></my-jugada>
          <my-jugada class="jugada" jugada="tijera"></my-jugada>
        </div>
    </div>
      `;

      function createMoveSelector() {
        const jugadaContainer = div.querySelector(".jugada-container");
        const moves = jugadaContainer.querySelectorAll(".jugada");

        for (const m of moves) {
          m.addEventListener("click", (e) => {
            m.shadowRoot.querySelector("style").textContent = `.jugada{
                max-height: 200px;
                max-width: 100px;
                opacity: 1;
                border:solid 3px;
                margin-bottom: 40px;
              }`;

            m.setAttribute("selected", "true");

            state.setMyMove(m.getAttribute("jugada"));
          });
        }
      }

      function timeCounter() {
        const contador = div.querySelector(".counter-container");
        const jugadaContainer = div.querySelector(".jugada-container");

        const moves = jugadaContainer.querySelectorAll(".jugada");
        const buttom = document.createElement("boton-el");
        buttom.textContent = "Volver a jugar";

        let counter = 4;
        const intervalId = setInterval(() => {
          counter--;
          console.log(counter);
          contador.textContent = counter.toString();

          for (const m of moves) {
            if (m.hasAttribute("selected") && counter == 0) {
              clearInterval(intervalId);
              state.checkMoves(() => {
                if (state.getState().status == "ambos jugadores ya jugaron") {
                  state.getMoves(() => {
                    seeElection();
                    state.pushToHistory();
                    state.setUnready();
                  });
                } else if (
                  state.getState().status == "uno de los jugadores no eligio"
                ) {
                  state.setUnready();
                  contador.innerHTML = `
                  <div style="padding:30px; text-align:center; ">
                  <custom-text>
                  UNO DE LOS JUGADORES FALTO POR SELECCIONAR SU JUGADA
                  </custom-text>
                  </div>
                  `;
                  const buttom = document.createElement("boton-el");
                  buttom.textContent = "Volver a jugar";
                  contador.appendChild(buttom);
                  buttom.addEventListener("click", () => {
                    Router.go("/reglas-game");
                  });
                }
              });
            } else if (counter == -1) {
              clearInterval(intervalId);
              jugadaContainer.textContent = "";
              contador.innerHTML = `
              <div style="padding:30px; text-align:center;">
              <custom-text>
              ¡Ups! Olvidaste seleccionar una jugada...
              </custom-text>
              </div>
              `;
              state.setUnready();
              const buttom = document.createElement("boton-el");
              buttom.textContent = "Volver a jugar";
              contador.appendChild(buttom);
              buttom.addEventListener("click", () => {
                Router.go("/reglas-game");
              });
            }
          }
        }, 1000);
      }

      function seeElection() {
        const cs = state.getState();
        const election = div.querySelector(".play-page");

        const myPlay = cs.currentGame.myPlay;
        const opponentPlay = cs.currentGame.opponentPlay;

        election.innerHTML = `
        <my-jugada jugada="${opponentPlay}"></my-jugada>
        <my-jugada jugada="${myPlay}"></my-jugada>
        `;

        const moves = election.querySelectorAll("my-jugada");

        moves[0].shadowRoot.querySelector("style").textContent = `
        .jugada{
          height: 200px;
          width: 100px;
          opacity: 1;
          transform:rotate(180deg);
     
        }
       `;

        moves[1].shadowRoot.querySelector("style").textContent = `
       .jugada{
        height: 200px;
        width: 100px;
         opacity: 1;
       }
      `;
        setTimeout(() => {
          Router.go("/results-page");
        }, 5000);
      }

      createMoveSelector();
      timeCounter();

      style.innerHTML = `
      .play-page {
        background-image: url(${imageURL});
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .counter-container{
        margin-top:100px;
        font-size: 100px;
        font-family: "Odibee Sans", cursive;
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
