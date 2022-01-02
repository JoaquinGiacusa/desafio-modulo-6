customElements.define(
  "rules-page",
  class extends HTMLElement {
    //shadow: ShadowRoot;
    constructor() {
      super();
      //this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
    }
    render() {
      this.innerHTML = `
    <div>
    <h1>HOLA SOY EL LA PAGINA DE REGLAS</h1>
    </div>
      `;
    }
  }
);
