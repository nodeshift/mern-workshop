'use strict';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const Todo = require('../model/todos');
const MONGO_CONFIG = require('../config/mongo.js');
const cors = require('cors');


module.exports = function(app) {

  let router = express.Router();


  app.use(cors())

  // set up other middleware
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  const options = {
    ssl: false,
    sslValidate: false,
    poolSize: 1,
    socketTimeoutMS: 5000,
    connectionTimeoutMS: 0,
    replicaSet: MONGO_CONFIG.MONGO_REPLICA_SET_NAME
  };

  let mongoConnect = `mongodb://${MONGO_CONFIG.mongoURL}:27017`;

  mongoose.Promise = global.Promise;
  mongoose.connect(mongoConnect, options)
    .catch((err) => {
      if (err) console.error(err);
    });

  let db = mongoose.connection;

  // db events
  db.on('error', (error) => {
    console.error(error);
  });

  db.on('close', () => {
    console.info('Lost connection');
  });
  db.on('reconnect', () => {
    console.info('Reconnected');
  });
  db.on('connected', () => {
    console.info(`Connection is established with mongodb, details: ${mongoConnect}`);
  });

  db.on('disconnected', function() {
    console.info('Attempting to reconnect to MongoDB!');
    // Some duplication here, would be better to have in its own method
    mongoose.connect(mongoConnect, options)
      .catch((err) => {
        if (err) console.error(err);
      });
  });

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
          console.err(err)
          res.status(503).send(err)
        } else {
          res.json({
            message: `Updated todo ${todoID}`
          })
        }
      })
  });

  router.delete('/todos/:todo_id', (req, res) => {
    Todo.remove({
      _id: req.params.todo_id
    }, function(err, todo) {
      if (err) {
        res.status(503).send(err);
      }
      res.json({
        message: 'Todo has been deleted'
      })
    });
  });

  router.delete('/todos', (req, res) => {
    console.log("Attempting to delete all todos")
    Todo.remove({}, function(err, todo) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Deleted todos data")
      }
    })
  });

  app.use('/api', router);
};
