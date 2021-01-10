const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const axios = require("axios");
const app = express();

app.use(cors({origin: true}));
app.use(express.json());

app.get("/chatbot/:uid/:message", (req, res) => {
  const userId = req.params.uid;
  const message = req.params.message;

  axios.get(`${config.CHATBOT_BASE_URL}&uid=${userId}&msg=${message}`).then(
      (data) => {
        res.json({
          response: data.data.cnt,
        });
      },
  ).catch((err) => {
    console.log(err);
  });
});

const config = {
  CHATBOT_BASE_URL: "",
};

exports.api = functions.https.onRequest(app);
