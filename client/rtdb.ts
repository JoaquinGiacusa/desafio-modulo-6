import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "NtCZiDSXtCAaB7naMNHxmdP60OM2L354HlcTT77v",
  databaseURL: "https://modulo6-apx-default-rtdb.firebaseio.com",
  authDomain: "modulo6-apx.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
