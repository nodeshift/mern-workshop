const request = require("supertest");
// const assert = require("chai").assert;
const expect = require("chai").expect;

// const assert = require("assert");
const express = require("express");
const app = express();

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
      let response = await request(app)
        .get("/api/todos")
        .set("Accept", "application/json");

      expect(response.statusCode).to.equal(200);
      expect(response.headers["content-type"]).to.match(/json/);
      expect(response.body).deep.to.equal([]);
    });
  });
});
