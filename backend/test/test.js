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

    it("success messsage", async function () {
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
  });
});
