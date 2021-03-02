const Joi = require("joi");
const helmet = require("helmet");
const config = require("config");

const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const morgan = require("morgan");
const express = require("express");
const log = require("./logger");
const authenticate = require("./authenticator");

const app = express();

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
  startupDebugger("Morgan enabled...");
}

// DB works
dbDebugger("Connected to the database");

//custom middleware
app.use(log);
app.use(authenticate);

const courses = [
  {
    id: "1",
    name: "a",
  },
  {
    id: "2",
    name: "b",
  },
  {
    id: "3",
    name: "c",
  },
];

const validateCourse = (course) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const result = schema.validate(course);
  return result;
};

const getCourse = (id) => {
  return courses.find((c) => c.id === id);
};

// ############### GET ##############
app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});
app.get("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    return res.status(404).send("The given ID was not found");
  }
  res.send(course);
});
app.get("/api/post/:year/:month", (req, res) => {
  res.send(req.query);
});

// ############### POST ##############
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

// ############### PUT ##############
app.put("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    return res.status(404).send("The given ID was not found");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  course.name = req.body.name;
  res.send(courses);
});

// ############### DELETE ##############
app.delete("/api/courses/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    return res.status(404).send("The given ID was not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
