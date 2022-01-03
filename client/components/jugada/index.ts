customElements.define(
  "my-jugada",
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
      const jugada = this.getAttribute("jugada") || "";
      const tijeraIMG = require("url:../../img/tijera.png");
      const piedraIMG = require("url:../../img/piedra.png");
      const papelIMG = require("url:../../img/papel.png");

      function chooseIMG(params) {
        var img = "";
        if (params == "tijera") {
          img = tijeraIMG;
        } else if (params == "piedra") {
          img = piedraIMG;
        } else if (params == "papel") {
          img = papelIMG;
        }
        return img;
      }

      const imgJugada = document.createElement("img");
      imgJugada.setAttribute("src", chooseIMG(jugada));

      const style = document.createElement("style");
      style.innerText = `
      .jugada{
        max-height: 200px;
        max-width: 100px;
        opacity: 0.6;
      }
      `;

      imgJugada.classList.add("jugada");
      this.shadow.append(style);
      this.shadow.append(imgJugada);

      /* const div = document.createElement("div");
      div.innerHTML = `
      <img src=${chooseIMG(jugada)}>
      `;
      console.log(jugada);
      this.shadow.append(div); */
    }
  }
);
