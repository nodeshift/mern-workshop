"use strict";

const mongoose = require("mongoose");
const {
  connectOptions,
  mongoURL,
  mongoPORT,
  connectOptions: { replicaSet },
} = require("../config/mongo.js");

module.exports = function () {
  let mongoConnect = `mongodb://${mongoURL}:${mongoPORT}/?replicaSet=${replicaSet}`;

  mongoose.connect(mongoConnect, connectOptions).catch((err) => {
    if (err) console.error(err);
  });

  let db = mongoose.connection;

  // db events
  db.on("error", (error) => {
    console.error(error);
  });

  db.on("close", () => {
    console.info("Lost connection");
  });
  db.on("reconnect", () => {
    console.info("Reconnected");
  });
  db.on("connected", () => {
    console.info(
      `Connection is established with mongodb, details: ${mongoConnect}`
    );
  });

  db.on("disconnected", function () {
    console.info("Attempting to reconnect to MongoDB!");
    // Some duplication here, would be better to have in its own method
    mongoose.connect(mongoConnect, connectOptions).catch((err) => {
      if (err) console.error(err);
    });
  });
};
