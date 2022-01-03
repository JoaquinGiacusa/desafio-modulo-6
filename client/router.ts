import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/new-game", component: "new-game" },
  { path: "/join-room", component: "join-room" },
]);
