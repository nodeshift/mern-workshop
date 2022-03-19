const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
  connectOptions: { replicaSet, ...testingConnectOptions },
  mongoURL,
  mongoPORT,
} = require("../server/config/mongo.js");

let mongod;

module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      port: +mongoPORT,
    },
  });

  let mongoConnect = `mongodb://${mongoURL}:${mongoPORT}`;

  mongoose.connect(mongoConnect, testingConnectOptions).catch((err) => {
    if (err) console.error(err);
  });
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
