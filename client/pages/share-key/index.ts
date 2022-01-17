import { state } from "../../state";
import { Router } from "@vaadin/router";

customElements.define(
  "share-key",
  class extends HTMLElement {
    roomId: string;
    name: string;
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();
      this.roomId = cs.roomId;
      this.name = cs.fullName;

      window.addEventListener("beforeunload", () => {
        state.setOffline();
      });

      this.render();

      state.setOnline(() => {
        state.checkUsersOnline(() => {
          Router.go("/reglas-game");
        });
      });
    }
    render() {
      const style = document.createElement("style");
      const imageURL = require("url:../../img/fondo-full.png");

      this.innerHTML = `
      <div class="main-container">
        <div class="header">
          <div class="scores">
            <h3>${this.name}:10</h3>
            <h3>Joaquin:10</h3>
          </div>
          <div class="header-roomId">Sala:${this.roomId}</div>
        </div>
        <div class="text-container">
          <custom-text>Compartí el código:</custom-text>
          <p class="codigo-roomId">${this.roomId}</p>
          <custom-text>Con tu contrincante</custom-text>
        </div>
        <div class="jugada-container">
          <my-jugada class="jugada" jugada="piedra"></my-jugada>
          <my-jugada class="jugada" jugada="papel"></my-jugada>
          <my-jugada class="jugada" jugada="tijera"></my-jugada>
        </div>
    </div>
      `;

      style.innerHTML = `
      .main-container {
        background-image: url(${imageURL});
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      } 

      .text-container{
        height:320px;
        width:280px;
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }
      
      .header{
        max-width: 800px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
      }

      .codigo-roomId{
        margin:0px;
        font-size: 60px;
        font-family: 'Odibee Sans', cursive;
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

      this.appendChild(style);
    }
  }
);
