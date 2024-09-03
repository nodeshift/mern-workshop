"use strict";

const mongoose = require("mongoose");
const {
  connectOptions: { ssl, socketTimeoutMS, replicaSet },
  disableReplicaSet,
  mongoUser,
  mongoPass,
  mongoURL,
  mongoPORT,
} = require("../config/mongo.js");

module.exports = async function () {
  let mongoConnect = `mongodb://`;

  let mongoConnectOptions = {
    ssl,
    socketTimeoutMS,
  };

  if (mongoUser || mongoPass) {
    mongoConnect += `${mongoUser}:${mongoPass}@`;
  }

  if (disableReplicaSet !== 'true') {
    mongoConnect += `${mongoURL}:${mongoPORT}/?replicaSet=${replicaSet}`;
    mongoConnectOptions.replicaSet = replicaSet;
  } else {
    mongoConnect += `${mongoURL}:${mongoPORT}/`;
  }

  console.info(`Attempting to connect to mongodb, details: ${mongoConnect}`);
  try {
    await mongoose.connect(mongoConnect, mongoConnectOptions);
    console.info(
      `Connection is established with mongodb, details: ${mongoConnect}`
    );
  } catch (err) {
    console.error(err);
  }

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
    mongoose.connect(mongoConnect, connectOptions).catch((err) => {
      if (err) console.error(err);
    });
  });
};
