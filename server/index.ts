import * as express from "express";
import { firestore, rtdb } from "./db";
import { nanoid } from "nanoid";
//import { randomstring } from "randomstring";
import * as cors from "cors";
//process.env.PORT para declarar una variable de ambiente
const port = process.env.PORT || 3005;
//const dev = process.env.NODE_ENV == "development";
import * as path from "path";
//al final esta app.use(express.static("dist")); que sirve el frontend

const app = express();

app.use(express.json());
app.use(cors());

const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

app.get("/test", (req, res) => {
  res.json({
    message: "soy el test",
  });
});

app.post("/signup", (req, res) => {
  const name = req.body.nombre;

  userCollection
    .where("name", "==", name)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        userCollection.add({ name }).then((newUserRef) => {
          res.json({ id: newUserRef.id, new: true });
        });
      } else {
        res.status(400).json({
          message: "user already exists",
        });
      }
    });
});

// para logear o identificar
app.post("/auth", (req, res) => {
  const { name } = req.body;

  userCollection
    .where("name", "==", name)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(400).json({
          message: "user not found",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

//para crear una room
app.post("/rooms", (req, res) => {
  const { userId } = req.body;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + nanoid());

        roomRef
          .set({
            owner: userId,
            "current-game": [],
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 9999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({ id: roomId });
              });
          });
      } else {
        res.status(401).json({
          message: "el usuario ingresado no existe",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.query;

  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

//para identificar si el que entra es el mismo que creo la sala(host), o no y setear a cada uno de los dos playes en un lugar
app.post("/hostorguest", (req, res) => {
  const { fullName } = req.body;
  const { userId } = req.body;
  const { roomId } = req.body;
  const { rtdbRoomId } = req.body;

  const rtdbRoomRef = rtdb.ref("rooms/" + rtdbRoomId);
  rtdbRoomRef.on("value", (snapshot) => {
    const data = snapshot.val();

    if (userId == data.owner) {
      rtdbRoomRef.update({
        host: {
          fullname: fullName,
          userId: userId,
          jugada: "",
          online: true,
        },
      });
    } else if (userId != data.owner) {
      rtdbRoomRef.update({
        guest: {
          fullname: fullName,
          userId: userId,
          jugada: "",
          online: true,
        },
      });
      res.json({ message: "ok" });
    }
  });
});

app.post("/setoffline", (req, res) => {
  const { userId } = req.body;
  const { rtdbRoomId } = req.body;
});

//para recuperar todos los datos a partir del roomid cuando quiero reingresar a una sala
// app.get("/access-room/:roomId", (req, res) => {
//   const { roomId } = req.params;

//   const dataRecuperada = {
//     rtdbRoomId: "",
//     userId: "",
//     fullName: "",
//   };

//   roomsCollection
//     .doc(roomId)
//     .get()
//     .then((snap) => {
//       if (snap.exists) {
//         const data = snap.data();
//         dataRecuperada.rtdbRoomId = data.rtdbRoomId;
//         //res.json(dataRecuperada);

//         const rtdbRoomRef = rtdb.ref("rooms/" + data.rtdbRoomId);
//         rtdbRoomRef.on("value", (snapshot) => {
//           const data = snapshot.val();
//           dataRecuperada.userId = data.owner;
//           //res.json(dataRecuperada);

//           userCollection
//             .doc(dataRecuperada.userId)
//             .get()
//             .then((snap) => {
//               const data = snap.data();
//               dataRecuperada.fullName = data.name;
//               res.json(dataRecuperada);
//             });
//         });
//       } else {
//         res.status(401).json({
//           message: "codigo de room incorrecto",
//         });
//       }
//     });
// });

// //la primera linea es para servir el frontend, y la segunda es para setear un default en la url y no falle si no esta declarado en el BE
// app.use(express.static("dist"));

// const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

// app.get("*", (req, res) => {
//   //res.send("hola"); esto para que de una respuesta, a modo de ejemplo
//   res.sendFile(rutaRelativa);
//   // en esto de arriba se esa una variable especial __dirname que representa la carpeta en la que estoy en este momento
//   //es para que si no existe ninguna de las rutas en la url use el dist/index.html
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
