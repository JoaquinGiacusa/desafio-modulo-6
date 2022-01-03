customElements.define(
  "estrella-el",
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
      const WinIMG = require("url:../../img/StarWin.png");
      const EmpateIMG = require("url:../../img/StarWin.png");
      const LoseIMG = require("url:../../img/StarLose.png");

      const result = this.getAttribute("result") || "";

      function chooseIMG(params) {
        var img = "";
        if (params == "Ganaste") {
          img = WinIMG;
        } else if (params == "Perdiste") {
          img = LoseIMG;
        } else if (params == "Empate") {
          img = EmpateIMG;
        }
        return img;
      }
      const imgResultado = document.createElement("div");
      imgResultado.innerHTML = `
      <div class="result-container">
        <img class="imagen" src="${chooseIMG(result)}">
        <custom-text class ="resultado">${result}</custom-text>
      </div>
      `;

      const style = document.createElement("style");
      style.innerText = `
      .result-container{
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .resultado{
          position:absolute;
          font-size:35px;
      }

      .imagen{
        position: relative; 
      }
      `;
      this.shadow.append(style);
      this.shadow.append(imgResultado);
    }
  }
);
