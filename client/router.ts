import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/new-game", component: "new-game" },
  { path: "/register", component: "register-room" },
  { path: "/signin", component: "sign-in" },
  { path: "/join-room", component: "join-room" },
  { path: "/share-key", component: "share-key" },
  { path: "/play-game", component: "play-game" },
  { path: "/complete-room", component: "complete-room" },
]);
