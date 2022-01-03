customElements.define(
  "input-el",
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const style = document.createElement("style");
      const placeholder = this.getAttribute("placeholder") || "";

      this.innerHTML = `
      <div>
        <label class="label"> ${this.textContent}
        <input type="text" class="input" placeholder="${placeholder}">
        </label>
      </div>
      `;

      style.textContent = `
      .label{
        font-size: 45px;
        font-family: "Odibee Sans", cursive;
        display: block;
        text-align: center;
      }

      .input {
        font-size: 45px;
        font-family: "Odibee Sans", cursive;
        border: 10px solid #002a61;
        border-radius: 10px;
        width: 256px;
        display: block;
        text-align: center;

      }
    `;

      this.appendChild(style);
    }
  }
);
