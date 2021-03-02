const express = require("express");
const router = express.Router();
const Joi = require("joi");

// ############### GET ##############
router.get("/", (req, res) => {
  res.send(courses);
});
router.get("/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    return res.status(404).send("The given ID was not found");
  }
  res.send(course);
});
router.get("/api/post/:year/:month", (req, res) => {
  res.send(req.query);
});

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

// ############### POST ##############
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const course = getCourse(req.params.id);
  if (!course) {
    return res.status(404).send("The given ID was not found");
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(courses);
});

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

module.exports = router;
