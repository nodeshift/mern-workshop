const express = require("express");
const app = express();
const expect = require("chai").expect;
const chai = require("chai");
let chaiHttp = require("chai-http");

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

  describe("GET /todos", function () {
    it("responds with json", async function () {
      chai
        .request(app)
        .get("/api/todos")
        .set("Accept", "application/json")
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.headers["content-type"]).to.match(/json/);
          expect(res.body).deep.to.equal([]);
        });

    });
  });

});
