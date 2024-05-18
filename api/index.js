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
    console.log(reciverId);
    console.log(senderId);
    console.log(message);
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
      res.status(404).send("bad req not reciver");
    } else {
      admin
        .messaging()
        .sendEachForMulticast({
          tokens: reciver.get("token"),
          notification: {
            title: sender.get("name"),
            body: message,
          },
          android: {
            notification: {
              title: sender.get("name"),
              body: message,
            },
            priority: "high",
            data: {
              reciver: reciverId,
              senderId,
              message: message,
              type: "chat",
            },
          },
          data: {
            reciver: reciverId,
            senderId,
            message: message,
            type: "chat",
          },
        })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send(String(err));
        });
    }
  }
});

app.post("/sendGroup", async (req, res) => {
  const { groupId, senderId, message, memberTokens } = req.body;

  if (!groupId || !senderId || !message || !memberTokens) {
    res.status(404).send("bad req");
  } else {
    const group = await admin
      .firestore()
      .collection("groups")
      .doc(groupId)
      .get();
    const sender = await admin
      .firestore()
      .collection("users")
      .doc(senderId)
      .get();

    if (!sender || !group) {
      res.status(404).send("bad req");
    } else {
      admin.messaging().sendEachForMulticast({
        tokens: memberTokens,
                    notification: {
              title: group.get("name"),
              body: message,
            },
        android: {
                              notification: {
              title: group.get("name"),
              body: message,
            },
          priority: "high",
          data: {
            senderId,
            groupId: groupId,
            message: message,
            type: "group",
          },
        },
        data: {
          senderId,
          groupId: groupId,
          message: message,
          type: "group",
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
