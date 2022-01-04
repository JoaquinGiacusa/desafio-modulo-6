const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

type Jugada = "piedra" | "papel" | "tijera";
type Game = {
  computerPlay: Jugada;
  myPlays: Jugada;
};

const state = {
  data: {
    fullName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    currentGame: { computerPlay: "", myPlay: "" },
    history: [],
  },
  listeners: [],

  // init() {
  //   const localData = localStorage.getItem("saved-state");

  //   if (localData == null) {
  //     const currentState = this.getState();
  //     this.setState(currentState);
  //   } else this.setState(JSON.parse(localData));
  // },

  pushToHistory(play: Game) {
    const currentState = this.getState();
    currentState.history.push(play);
  },

  setMove(move) {
    const lastState = this.getState();
    lastState.currentGame = move;
    this.pushToHistory(move);
  },

  whoWins(myPlay: Jugada, computerPlay: Jugada) {
    const ganeConPiedra = myPlay == "piedra" && computerPlay == "tijera";
    const ganeConPapel = myPlay == "papel" && computerPlay == "piedra";
    const ganeConTijera = myPlay == "tijera" && computerPlay == "papel";

    const empateConPiedra = myPlay == "piedra" && computerPlay == "piedra";
    const empateConPapel = myPlay == "papel" && computerPlay == "papel";
    const empateConTijera = myPlay == "tijera" && computerPlay == "tijera";

    if (empateConPiedra || empateConPapel || empateConTijera) {
      return "Empate";
    } else if ([ganeConPiedra, ganeConPapel, ganeConTijera].includes(true)) {
      return "Ganaste";
    } else {
      return "Perdiste";
    }
  },

  winsResults(history) {
    var ganadas = 0;
    var perdidas = 0;
    for (const jugada of history) {
      const resultado = this.whoWins(jugada.myPlay, jugada.computerPlay);

      if (resultado == "Empate") {
      } else if (resultado == "Ganaste") {
        ganadas++;
      } else {
        perdidas++;
      }
    }
    const currentState = this.getState();
    this.setState(currentState);

    return [ganadas, perdidas];
  },

  setFullName(name: string) {
    const currentState = this.getState();
    currentState.fullName = name;
    this.setState(currentState);
  },

  register(callback) {
    const cs = this.getState();
    if (cs.fullName) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nombre: cs.fullName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.message != undefined) {
            window.alert(data.message);
          }
          callback();
        });
    } else {
      console.error("No hay un FullName en el state");
    }
  },

  signIn(callback?) {
    const cs = this.getState();

    if (cs.fullName) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: cs.fullName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
        });
    } else {
    }
  },

  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }
    console.log("SOY EL STATE CAMBIADO", this.data);
    //localStorage.setItem("saved-state", JSON.stringify(newState));
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
