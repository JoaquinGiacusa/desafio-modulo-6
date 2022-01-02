import * as express from "express";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
//import * as cors from "cors";
//process.env.PORT para declarar una variable de ambiente
const port = process.env.PORT || 3000;
//const dev = process.env.NODE_ENV == "development";
import * as path from "path";
//al final esta app.use(express.static("dist")); que sirve el frontend

const app = express();

app.use(express.json());
//app.use(cors());

// const userCollection = firestore.collection("users");
// const roomsCollection = firestore.collection("rooms");

app.get("/test", (req, res) => {
  res.json({
    message: "soy el test",
  });
});

// app.post("/signup", (req, res) => {
//   const email = req.body.email;
//   const nombre = req.body.nombre;

//   userCollection
//     .where("email", "==", email)
//     .get()
//     .then((searchResponse) => {
//       if (searchResponse.empty) {
//         userCollection.add({ email, nombre }).then((newUserRef) => {
//           res.json({ id: newUserRef.id, new: true });
//         });
//       } else {
//         res.status(400).json({
//           message: "user already exists",
//         });
//       }
//     });
// });

// //la primera linea es para servir el frontend, y la segunda es para setear un default en la url y no falle si no esta declarado en el BE
app.use(express.static("dist"));

const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

app.get("*", (req, res) => {
  //res.send("hola"); esto para que de una respuesta, a modo de ejemplo
  res.sendFile(rutaRelativa);
  // en esto de arriba se esa una variable especial __dirname que representa la carpeta en la que estoy en este momento
  //es para que si no existe ninguna de las rutas en la url use el dist/index.html
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
