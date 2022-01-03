customElements.define(
  "custom-text",
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
      const variant = this.getAttribute("text") || "body";
      const div = document.createElement("div");
      const style = document.createElement("style");

      style.textContent = `
      .title {
        font-size: 80px;
        font-family: 'Odibee Sans', cursive;
        font-weight: 700;
        color: #009048
      }

      .body{
        font-size: 45px;
        font-family: 'Odibee Sans', cursive;
      }
      `;
      div.textContent = this.textContent;

      div.classList.add(variant);
      this.shadow.append(style);
      this.shadow.append(div);
    }
  }
);
