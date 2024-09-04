const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mongoPORT } = require("../server/config/mongo.js");

let mongod;

module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create({
    instanceOpts: [
      {
        port: +mongoPORT,
      },
    ],
  });

  try {
    await mongoose.connect(mongod.getUri());
    console.info(`Connection is established with mongodb.`);
  } catch (err) {
    console.error(err);
  }
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
