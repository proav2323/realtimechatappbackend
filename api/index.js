const express = require("express");
const app = express();
const port = 3000;
const admin = require("firebase-admin");
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send", async (req, res) => {
  const { reciverId, senderId, message } = req.body();

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
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
