const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
} = require("./config/config");

const postRouter = require("./routes/postRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    })
    .then(() => console.log("succesfully connected to db"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.use("/posts", postRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server radi na portu ${port}`));
