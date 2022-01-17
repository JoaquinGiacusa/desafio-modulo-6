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

(function () {
  const root = document.querySelector(".root");
})();

// state.setState({
//   //  fullName: "Joa",
//   userId: "1uZNuVSwBqhKks2FYhJP",
//   rtdbRoomId: "yOjVQVp4LBPu6flvEQb5K",
// });

// state.setOnline();
// console.log(state.getState());

// // state.setHostAndGuest();
// state.setOffline();
