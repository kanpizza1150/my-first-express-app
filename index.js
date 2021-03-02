const helmet = require("helmet");
const config = require("config");

const debug = require("debug")("app:startup");

const morgan = require("morgan");
const express = require("express");
const log = require("./logger");
const authenticate = require("./authenticator");

const app = express();

const courses = require("./routes/courses");
const main = require("./routes/main");

app.set("view engine", "pug");
app.set("views", "./views");

// Configuration
console.log("Application name:", config.get("name"));
console.log("Mail Server:", config.get("mail.host"));
console.log("Mail Password:", config.get("mail.password"));

//express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//3rd party middleware
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny")); //to log request
  debug("Morgan enabled...");
}

//custom middleware
app.use(log);
app.use(authenticate);

//api routes
app.use("/", main);
app.use("/api/courses", courses);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
