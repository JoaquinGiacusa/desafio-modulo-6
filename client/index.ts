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
import "./pages/play-game";
import "./pages/complete-room";

(function () {
  const root = document.querySelector(".root");
})();

// state.setState({
//   fullName: "Joaq",
//   userId: "NvuB4EzbiWDanSpzVxGh",
//   roomId: "9525",
// });
// console.log(state.getState());

// state.setHostAndGuest();
