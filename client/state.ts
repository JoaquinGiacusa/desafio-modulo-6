import { rtdb } from "./rtdb";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3005";

type Jugada = "piedra" | "papel" | "tijera";
type Game = {
  guestPlay: Jugada;
  myPlays: Jugada;
};

const state = {
  data: {
    fullName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    currentGame: { guestPlay: "", myPlay: "" },
    history: [],
    status: {},
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

  whoWins(myPlay: Jugada, guestPlay: Jugada) {
    const ganeConPiedra = myPlay == "piedra" && guestPlay == "tijera";
    const ganeConPapel = myPlay == "papel" && guestPlay == "piedra";
    const ganeConTijera = myPlay == "tijera" && guestPlay == "papel";

    const empateConPiedra = myPlay == "piedra" && guestPlay == "piedra";
    const empateConPapel = myPlay == "papel" && guestPlay == "papel";
    const empateConTijera = myPlay == "tijera" && guestPlay == "tijera";

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
      const resultado = this.whoWins(jugada.myPlay, jugada.guestPlay);

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
          console.log(data);
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
      console.log("rtdbRoomRef", rtdbRoomRef);

      /*   if (rtdbRoomRef.host == undefined || rtdbRoomRef.guest == undefined) {
        this.setHostAndGuest();
      } else  */
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
      }

      //this.setState(cs);
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
        console.log(data);
        callback();
      });
  },

  checkUsersOnline(callback?) {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (rtdbRoomRef.host != undefined && rtdbRoomRef.guest != undefined) {
        if (
          rtdbRoomRef.host.online == true &&
          rtdbRoomRef.guest.online == true
        ) {
          callback();
        }
      }
      // if (rtdbRoomRef.host.online && rtdbRoomRef.guest.online) {
      //   console.log("estan los 2 online");
      //   cs.status = "estan los 2 online";
      //   this.setState(cs);
      //   callback();
      // }
    });
  },

  setOnline(callback?) {
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
          console.log("DATA DEL SETONLINE XD", data);
          callback();
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

  listenReady(callback) {
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

    chatroomsRef.on("value", (snapshot) => {
      const rtdbRoomRef = snapshot.val();

      if (rtdbRoomRef.host.ready == true && rtdbRoomRef.guest.ready == true) {
        callback();
      }
    });
  },

  // listenRoom() {
  //   const cs = this.getState();

  //   const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);

  //   chatroomsRef.on("value", (snapshot) => {
  //     // const messagesFromServer = snapshot.val();
  //     // const messagesList = map(messagesFromServer.messages);
  //     // cs.messages = messagesList;
  //     this.setState(cs);
  //   });
  // },

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
