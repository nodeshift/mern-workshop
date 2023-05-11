const express = require("express");
const app = express();
const expect = require("chai").expect;
const request = require("supertest");

const Todo = require("../server/model/todos");

const dbHandler = require("../test/db-handler");

describe("Mongo CRUD", function () {
  /**
   * Connect to a new in-memory mongo database, before running any tests.
   */
  before(async () => {
    await dbHandler.connect();
    require("../server/routers/public")(app);
    require("../server/routers/health")(app);
    require("../server/routers/routes")(app);
  });

  /**
   * Clear DB data after each test.
   */
  afterEach(async () => await dbHandler.clearDatabase());

  /**
   * Remove and close db after all tests have run.
   */
  after(async () => {
    await dbHandler.closeDatabase();
  });

  describe("GET /health", async function () {
    it("responds with json", async function () {
      const res = await request(app)
        .get("/health")
        .set("Accept", "application/json");

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body).to.be.an("Object");
      expect(res.body.status).to.equal("UP");
    });
  });

  describe("GET /todos", async function () {
    let todos;
    beforeEach(async () => {
      todos = await Todo.insertMany([
        {
          author: "Bob",
          task: "Clean bicycle",
        },
        {
          author: "Bob",
          task: "Pay phone bill",
        },
      ]);
    });

    it("responds with json", async function () {
      const res = await request(app)
        .get("/api/todos")
        .set("Accept", "application/json");

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body).to.be.an("Array");
      expect(res.body.length).to.equal(2);
    });
  });

  describe("POST /todos", function () {
    it("responds with success message", async function () {
      const res = await request(app)
        .post("/api/todos")
        .set("Content-Type", "application/json")
        .send({
          task: "description",
          author: "NodeConfEU",
        });

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an("Object");
      expect(res.body.message).to.equal("Todo successfully added!");
    });

    it("responds with an error message", async function () {
      const res = await request(app)
        .post("/api/todos")
        .set("Content-Type", "application/json")
        .send({
          task: "description",
        });

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.be.an("Object");
      expect(res.header["content-type"]).to.match(/text\/html/);
      expect(res.text).to.equal("Unprocessable Entity");
    });
  });

  describe("PUT /todo", function () {
    let todos;
    let updateTodo;
    beforeEach(async () => {
      todos = await Todo.insertMany([
        {
          author: "Bob",
          task: "Clean bicycle",
        },
        {
          author: "Bob",
          task: "Pay phone bill",
        },
      ]);
      updateTodo = todos[0];
    });

    it("success responds with success messsage", async function () {
      const res = await request(app)
        .put(`/api/todos/${updateTodo._id}`)
        .set("Accept", "application/json")
        .send({
          author: "Ann",
        });

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body).to.be.an("Object");
      expect(res.body.message).to.equal(`Updated todo ${updateTodo._id}`);
    });

    it("success responds with an error messsage", async function () {
      const res = await request(app)
        .put(`/api/todos/this_is_a_wrong_id`)
        .set("Accept", "application/json")
        .send({
          author: "Ann",
        });

      expect(res.statusCode).to.equal(503);
      expect(res.header["content-type"]).to.match(/json/);
    });
  });

  describe("DELETE all /todos", function () {
    let todos;
    beforeEach(async () => {
      todos = await Todo.insertMany([
        {
          author: "Bob",
          task: "Clean bicycle",
        },
        {
          author: "Bob",
          task: "Pay phone bill",
        },
      ]);
    });

    it("responds with success message", async function () {
      const res = await request(app)
        .delete(`/api/todos`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/text\/html/);
      expect(res.text).to.equal("Deleted todos data");
    });

    afterEach(async () => {
      const allTodos = await Todo.find();
      expect(allTodos).to.deep.equal([]);
    });
  });

  describe("DELETE /todo", function () {
    let todos;
    let deleteTodo;
    beforeEach(async () => {
      todos = await Todo.insertMany([
        {
          author: "Bob",
          task: "Clean bicycle",
        },
        {
          author: "Bob",
          task: "Pay phone bill",
        },
      ]);
      deleteTodo = todos.pop();
    });

    it("responds with success message", async function () {
      const res = await request(app)
        .delete(`/api/todos/${deleteTodo._id}`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body).to.be.an("object");
      expect(res.body.message).equal("Todo has been deleted");
    });

    it("responds with error message", async function () {
      const res = await request(app)
        .delete(`/api/todos/this_is_wrong_id`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(503);
      expect(res.header["content-type"]).to.match(/json/);
    });
  });
});
