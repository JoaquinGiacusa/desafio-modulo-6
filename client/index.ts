import { state } from "./state";
import "./router";

//components
import "./components/boton";
import "./components/input";
import "./components/jugada";
import "./components/estrella-results";
import "./components/text";

//pages
import "./pages/home-page";
import "./pages/new-game";
import "./pages/register";
import "./pages/signIn";
import "./pages/join-room";
import "./pages/share-key";
import "./pages/reglas";
import "./pages/play-game";
import "./pages/waiting-play";
import "./pages/complete-room";
import "./pages/results-page";

(function () {
  const root = document.querySelector(".root");
})();

state.setState({
  fullName: "test",
  userId: "SHkVM7SEaugyLxUhbKF0",
  roomId: "",
  rtdbRoomId: "Z7wdBdeNyCqISmNjh-NnC",
  currentGame: { opponentPlay: "tijera", myPlay: "piedra" },
  history: [],
  status: "",
  opponentName: "",
  results: {},
});

// state.pushToHistory();
// state.getMoves();
// state.setReady();

// state.setOnline();
// console.log(state.getState());

// // state.setHostAndGuest();
// state.setOffline();
