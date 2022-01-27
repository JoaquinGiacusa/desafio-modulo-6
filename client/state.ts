import { rtdb } from "./rtdb";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3005";

type Jugada = "piedra" | "papel" | "tijera";
type Game = {
  opponentPlay: Jugada;
  myPlays: Jugada;
};

const state = {
  data: {
    fullName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    online: false,
    ready: false,
    currentGame: { opponentPlay: "", myPlay: "" },
    history: [],
    status: "",
    opponentName: "",
    opponentOnline: false,
    opponentReady: false,
    results: {},
  },
  listeners: [],

  // init() {
  //   const localData = localStorage.getItem("saved-state");

  //   if (localData == null) {
  //     const currentState = this.getState();
  //     this.setState(currentState);
  //   } else this.setState(JSON.parse(localData));
  // },

  pushToHistory() {
    const cs = this.getState();

    fetch(API_BASE_URL + "/addplaytohistory", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: cs.userId,
        rtdbRoomId: cs.rtdbRoomId,
        currentGame: cs.currentGame,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  },

  getHistoryPlays(callback?) {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.get().then((snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (rtdbRoomRef.history != undefined) {
        cs.history = rtdbRoomRef.history;
        this.setState(cs);
        callback();
      } else if (rtdbRoomRef.history == undefined) {
        // cs.results = { fullName: 0, opponentName: 0 };
        // this.setState(cs);
        cs.history = [{ [cs.fullName]: "piedra", [cs.opponentName]: "piedra" }];
        this.setState(cs);
        callback();
      }
    });
  },

  setMyMove(move) {
    const cs = this.getState();
    //seteo mi movimiento en el state
    cs.currentGame.myPlay = move;

    if (cs.rtdbRoomId) {
      fetch(API_BASE_URL + "/setmove", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: cs.userId,
          rtdbRoomId: cs.rtdbRoomId,
          move: move,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          this.setState(cs);
          //callback();
        });
    } else {
      console.error("hubo un error en el setmove");
    }
  },

  checkMoves(callback) {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.get().then((snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (
        rtdbRoomRef.host.jugada == undefined ||
        rtdbRoomRef.guest.jugada == undefined
      ) {
        cs.status = "uno de los jugadores no eligio";

        this.setState(cs);
        callback();
      } else {
        cs.status = "ambos jugadores ya jugaron";
        this.setState(cs);
        callback();
      }
    });
  },

  getMoves(callback) {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.get().then((snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (rtdbRoomRef.owner == cs.userId) {
        cs.currentGame.myPlay = rtdbRoomRef.host.jugada;
        cs.currentGame.opponentPlay = rtdbRoomRef.guest.jugada;
        this.setState(cs);
        callback();
      } else if (rtdbRoomRef.owner !== cs.userId) {
        cs.currentGame.myPlay = rtdbRoomRef.guest.jugada;
        cs.currentGame.opponentPlay = rtdbRoomRef.host.jugada;
        this.setState(cs);
        callback();
      }
    });
  },

  whoWins(myPlay: Jugada, opponentPlay: Jugada) {
    const ganeConPiedra = myPlay == "piedra" && opponentPlay == "tijera";
    const ganeConPapel = myPlay == "papel" && opponentPlay == "piedra";
    const ganeConTijera = myPlay == "tijera" && opponentPlay == "papel";

    const empateConPiedra = myPlay == "piedra" && opponentPlay == "piedra";
    const empateConPapel = myPlay == "papel" && opponentPlay == "papel";
    const empateConTijera = myPlay == "tijera" && opponentPlay == "tijera";

    if (empateConPiedra || empateConPapel || empateConTijera) {
      return "Empate";
    } else if ([ganeConPiedra, ganeConPapel, ganeConTijera].includes(true)) {
      return "Ganaste";
    } else {
      return "Perdiste";
    }
  },

  winsResults() {
    const cs = this.getState();

    var me = 0;
    var opp = 0;

    for (const jugada of cs.history) {
      const resultado = this.whoWins(
        jugada[cs.fullName],
        jugada[cs.opponentName]
      );

      if (resultado == "Empate") {
      } else if (resultado == "Ganaste") {
        me++;
      } else if (resultado == "Perdiste") {
        opp++;
      }
    }

    cs.results = { me: me, opp: opp };
    this.setState(cs);
  },

  setFullName(name: string) {
    const currentState = this.getState();
    currentState.fullName = name;
    this.setState(currentState);
  },

  setOpponentName() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.get().then((snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (cs.userId == rtdbRoomRef.owner) {
        cs.opponentName = rtdbRoomRef.guest.fullname;
        this.setState(cs);
      } else if (cs.userId != rtdbRoomRef.owner) {
        cs.opponentName = rtdbRoomRef.host.fullname;
        this.setState(cs);
      }
    });
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
          if (data.message == "user not found") {
            console.error(data.message);
          } else {
            cs.userId = data.id;
            this.setState(cs);
            callback();
          }
        });
    } else {
      console.error("no hay un fullname en el state");
    }
  },

  askNewRoom(callback?) {
    const cs = this.getState();

    if (cs.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id.toString();
          this.setState(cs);
          callback();
        });
    } else {
      console.error("no hay userId");
    }
  },

  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        callback();
      });
  },

  //para ver si ya hay un host o un guest en la rtdb (no usa fb-admin)
  checkHostAndGuest(callback?) {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    chatroomsRef.get().then((snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (rtdbRoomRef.host !== undefined && rtdbRoomRef.guest !== undefined) {
        if (cs.fullName == rtdbRoomRef.host.fullname) {
          cs.status = { "1": "soy el host" };
        } else if (cs.fullName == rtdbRoomRef.guest.fullname) {
          cs.status = { "2": "soy el guest" };
        } else {
          cs.status = {
            "3": "ya hay dos usuarios en esta sala y no eres ninguno de ellos",
          };
        }
        this.setState(cs);

        callback();
      } else if (
        rtdbRoomRef.host == undefined ||
        rtdbRoomRef.guest == undefined
      ) {
        callback();
      }
    });
  },

  //para setear un host o gues en la rtdb
  setHostAndGuest(callback?) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/hostorguest", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: cs.fullName,
        userId: cs.userId,
        roomId: cs.roomId,
        rtdbRoomId: cs.rtdbRoomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.status = data;
        this.setState(cs);
        callback();
      });
  },

  checkOpponentOnline() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (rtdbRoomRef.guest == undefined) {
        cs.opponentOnline = false;
        this.setState(cs);
      } else if (cs.userId == rtdbRoomRef.owner) {
        if (rtdbRoomRef.guest.online == true) {
          cs.opponentOnline = true;
          this.setState(cs);
          //callback();
        }
      } else if (cs.userId != rtdbRoomRef.owner) {
        if (rtdbRoomRef.host.online == true) {
          cs.opponentOnline = true;
          this.setState(cs);
          //callback();
        }
      }
    });
  },

  // checkUsersOnline(callback?) {
  //   const cs = this.getState();
  //   const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

  //   chatroomsRef.on("value", (snapshot) => {
  //     const rtdbRoomRef = snapshot.val();

  //     if (rtdbRoomRef.host != undefined && rtdbRoomRef.guest != undefined) {
  //       if (
  //         rtdbRoomRef.host.online == true &&
  //         rtdbRoomRef.guest.online == true
  //       ) {
  //         callback();
  //       }
  //     }
  //   });
  // },

  setOnline() {
    const cs = this.getState();
    if (cs.rtdbRoomId) {
      fetch(API_BASE_URL + "/setonline", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: cs.userId,
          rtdbRoomId: cs.rtdbRoomId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.online == true) {
            cs.online = true;
          }
          this.setState(cs);
        });
    } else {
      console.error("hubo un error en el setonline");
    }
  },

  setOffline() {
    const cs = this.getState();

    fetch(API_BASE_URL + "/setoffline", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: cs.userId,
        rtdbRoomId: cs.rtdbRoomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  },

  // listenReady(callback) {
  //   const cs = this.getState();
  //   const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

  //   chatroomsRef.on("value", (snapshot) => {
  //     const rtdbRoomRef = snapshot.val();

  //     if (rtdbRoomRef.host.ready == true && rtdbRoomRef.guest.ready == true) {
  //       callback();
  //     }
  //   });
  // },
  checkOpponentReady() {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (cs.userId == rtdbRoomRef.owner) {
        if (rtdbRoomRef.guest.ready == true) {
          cs.opponentReady = true;
          this.setState(cs);
        } else if (rtdbRoomRef.guest.ready == false) {
          cs.opponentReady = false;
          this.setState(cs);
        }
      } else if (cs.userId != rtdbRoomRef.owner) {
        if (rtdbRoomRef.host.ready == true) {
          cs.opponentReady = true;
          this.setState(cs);
        } else if (rtdbRoomRef.host.ready == false) {
          cs.opponentReady = false;
          this.setState(cs);
        }
      }
    });
  },

  setReady() {
    const cs = this.getState();
    if (cs.rtdbRoomId) {
      fetch(API_BASE_URL + "/setready", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId: cs.userId,
          rtdbRoomId: cs.rtdbRoomId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.ready == true) {
            cs.ready = true;
          }
          this.setState(cs);
        });
    } else {
      console.error("hubo un error en el setReady");
    }
  },

  setUnready() {
    const cs = this.getState();

    fetch(API_BASE_URL + "/setunready", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        userId: cs.userId,
        rtdbRoomId: cs.rtdbRoomId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  },

  setExistentRoomId(roomId) {
    const cs = this.getState();
    cs.roomId = roomId;
    this.setState(cs);
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
