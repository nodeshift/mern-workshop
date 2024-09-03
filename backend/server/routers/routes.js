"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const Todo = require("../model/todos");
const cors = require("cors");

module.exports = function (app) {
  let router = express.Router();

  app.use(cors());

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());

  router.get("/todos", async (_, res) => {
    try {
      console.log("Attempting to fetch all todos");
      const todos = await Todo.find();
      res.json(todos);
      return;
    } catch (err) {
      console.log(err);
      res.status(503).send;
      return;
    }
  });

  router.post("/todos", async (req, res) => {
    const author = req.body.author;
    const task = req.body.task;

    console.log(`Creating Todo for ${req.body.author} ${task}`);

    if (!task || !author) {
      res.status(422).send("Unprocessable Entity");
      return;
    }
    const todo = new Todo({
      author: author,
      task: task,
    });

    try {
      await todo.save();
      res.json({
        message: "Todo successfully added!",
      });
      return;
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });

  router.put("/todos/:todo_id", async function (req, res) {
    const todoID = req.params.todo_id;
    console.log(`Updating Todo by ID (${todoID})`);

    try {
      await Todo.findByIdAndUpdate(req.params.todo_id, req.body, {
        safe: true,
        upsert: true,
        new: true,
      });
      res.json({
        message: `Updated todo ${todoID}`,
      });
      return;
    } catch (err) {
      res.status(503).send(err);
      return;
    }
  });

  router.delete("/todos/:todo_id", async (req, res) => {
    try {
      await Todo.deleteOne({
        _id: req.params.todo_id,
      });
      res.json({
        message: "Todo has been deleted",
      });
      return;
    } catch (err) {
      res.status(503).send(err);
      return;
    }
  });

  router.delete("/todos", async (req, res) => {
    console.log("Attempting to delete all todos");

    try {
      await Todo.deleteMany({});
      res.send("Deleted todos data");
      return;
    } catch (err) {
      res.status(500).send(err);
      return;
    }
  });

  app.use("/api", router);
};
