'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const Todo = require('../model/todos');
const cors = require('cors');

module.exports = function(app) {

  let router = express.Router();

  app.use(cors())

  // set up other middleware
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  router.get('/todos', (req, res) => {
    Todo.find(function(err, todos) {
      if (err) {
        res.status(503).send(err);
      }
      res.json(todos);
    });
  });

  router.post('/todos', (req, res) => {
    const author = req.body.author;
    const task = req.body.task;
		console.log(`Creating Todo for ${req.body.author} ${task}`);
    if (!task || !author) {
      res.status(422).send("Unprocessable Entity");
      return;
    }
    const todo = new Todo({
      author: author,
      task: task
    });

    todo.save((err) => {
      console.log(err);
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          message: 'Todo successfully added!'
        });
      }
    });
  });

  router.put('/todos/:todo_id', function(req, res) {
    const todoID = req.params.todo_id
    console.log(`Attempting to update a todo by ID (${todoID})`)
    const task = req.body.task;

    Todo.findByIdAndUpdate(
      req.params.todo_id,
      req.body, {
        safe: true,
        upsert: true,
        new: true
      },
      function(err, raw) {
        if (err) {
          res.status(503).send(err)
        } else {
          res.json({
            message: `Updated todo ${todoID}`
          })
        }
      })
  });

  router.delete('/todos/:todo_id', (req, res) => {
    Todo.deleteOne({
      _id: req.params.todo_id
    }, function(err, todo) {
      if (err) {
        res.status(503).send(err);
      }
      else{
        res.json({
          message: 'Todo has been deleted'
        })
      }
    });
  });

  router.delete('/todos', (req, res) => {
    console.log("Attempting to delete all todos")
    Todo.deleteMany({}, function(err, todo) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Deleted todos data")
      }
    })
  });

  app.use('/api', router);
};
