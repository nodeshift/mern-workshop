const express = require("express");
const app = express();
const expect = require("chai").expect;
const chai = require("chai");
let chaiHttp = require("chai-http");

const Todo = require("../server/model/todos");

chai.use(chaiHttp);
let should = chai.should();

const dbHandler = require("../test/db-handler");

describe("Mongo CRUD", function () {
  /**
   * Connect to a new in-memory database before running any tests.
   */
  before(async () => {
    await dbHandler.connect();
    require("../server/routers/public")(app);
    require("../server/routers/health")(app);
    require("../server/routers/routes")(app);
  });

  /**
   * Clear all test data after every test.
   */
  afterEach(async () => await dbHandler.clearDatabase());

  /**
   * Remove and close the db and server.
   */
  after(async () => await dbHandler.closeDatabase());

  describe("GET /health", async function () {
    it("responds with json", async function () {
      const res = await chai
        .request(app)
        .get("/health")
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body.should.be.an("object"));
      expect(res.body.should.have.property("status").eql("UP"));
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
      const res = await chai
        .request(app)
        .get("/api/todos")
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body.should.be.an("array"));
      expect(JSON.stringify(todos)).deep.to.equal(JSON.stringify(res.body));
    });
  });

  describe("POST /todos", function () {
    it("responds with success message", async function () {
      chai
        .request(app)
        .post("/api/todos")
        .set("Content-Type", "application/json")
        .send({
          task: "description",
          author: "NodeConfEU",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have
            .property("message")
            .eql("Todo successfully added!");
        });
    });

    it("responds with an error message", async function () {
      chai
        .request(app)
        .post("/api/todos")
        .set("Content-Type", "application/json")
        .send({
          task: "description",
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an("object");
          res.header["content-type"].match(/text\/html/);
          res.text.should.be.a("string").eql("Unprocessable Entity");
        });
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
      const res = await chai
        .request(app)
        .put(`/api/todos/${updateTodo._id}`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body.should.be.an("object"));
      expect(
        res.body.should.have
          .property("message")
          .eql(`Updated todo ${updateTodo._id}`)
      );
    });

    it("success responds with an error messsage", async function () {
      const res = await chai
        .request(app)
        .put(`/api/todos/this_is_a_wrong_id`)
        .set("Accept", "application/json")
        .send();

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
      const res = await chai
        .request(app)
        .delete(`/api/todos`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/text\/html/);
      expect(res.text.should.be.a("string").eql("Deleted todos data"));
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
      const res = await chai
        .request(app)
        .delete(`/api/todos/${deleteTodo._id}`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(200);
      expect(res.header["content-type"]).to.match(/json/);
      expect(res.body.should.be.an("object"));
      expect(
        res.body.should.have.property("message").eql("Todo has been deleted")
      );
    });

    it("responds with error message", async function () {
      const res = await chai
        .request(app)
        .delete(`/api/todos/this_is_wrong_id`)
        .set("Accept", "application/json")
        .send();

      expect(res.statusCode).to.equal(503);
      expect(res.header["content-type"]).to.match(/json/);
    });
  });
});
