const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const {
  connectOptions,
  mongoURL,
  mongoPORT,
  connectOptions: { replicaSet },
} = require("../server/config/mongo.js");

let mongod;

module.exports.connect = async () => {
  mongod = await MongoMemoryReplSet.create({
    instanceOpts: [
      {
        port: +mongoPORT,
      },
    ],
    replSet: { name: replicaSet },
  });

  let mongoConnect = `mongodb://${mongoURL}:${mongoPORT}`;

  mongoose.connect(mongoConnect, connectOptions).catch((err) => {
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
