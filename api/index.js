const express = require("express");
const app = express();
const port = 3000;
const admin = require("firebase-admin");
const cors = require("cors");

app.use(express.json());
app.use(cors());

var serviceAccount = require("../auth.json");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send", async (req, res) => {
  const { reciverId, senderId, message } = req.body;

  if (!reciverId || !senderId || !message) {
    res.status(404).send("bad req");
  } else {
    const reciver = await admin
      .firestore()
      .collection("users")
      .doc(reciverId)
      .get();
    const sender = await admin
      .firestore()
      .collection("users")
      .doc(senderId)
      .get();

    if (!sender || !reciver) {
      res.status(404).send("bad req");
    } else {
      admin.messaging().send({
        token: reciver.data["token"],
        topic: "chat",
        android: {
          priority: "high",
          data: {
            reciver: reciverId,
            senderId,
            senderId,
            message: message,
            type: "chat",
          },
        },
        data: {
          reciver: reciverId,
          senderId,
          senderId,
          message: message,
          type: "chat",
        },
      });

      res.status(200).send("notifcations send");
    }
  }
});

app.listen(port, () => {
  admin.initializeApp({
    apiKey: "AIzaSyAHtwLOet0wscGXSMFu87m7PTBexyKxxjA",
    authDomain: "realtimechatapp-57160.firebaseapp.com",
    projectId: "realtimechatapp-57160",
    storageBucket: "realtimechatapp-57160.appspot.com",
    messagingSenderId: "915369937393",
    appId: "1:915369937393:web:025888165193142a14dc50",
    measurementId: "G-MMCL00LR9L",
    databaseURL: "",
    credential: admin.credential.cert(serviceAccount),
  });
  console.log(`Example app listening on port ${port}`);
});
