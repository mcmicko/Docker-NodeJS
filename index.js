const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const {
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  REDIS_URL,
  MONGO_PASSWORD,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  post: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

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

//MIDDLEWARE
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      gttpOnly: true,
      maxAge: 3000000,
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server radi na portu ${port}`));
