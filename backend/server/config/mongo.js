module.exports = {
  mongoURL: process.env.MONGO_URL || "127.0.0.1",
  mongoPORT: process.env.MONOGO_PORT || "27017",
  mongoUser: process.env.MONGO_USER || "",
  mongoPass: process.env.MONGO_PASS || "",
  mongoDBName: process.env.MONGO_DB_NAME || "todos",
  connectOptions: {
    useNewUrlParser: true,
    ssl: false,
    sslValidate: false,
    socketTimeoutMS: 5000,
    replicaSet: process.env.MONGO_REPLICA_SET_NAME || "rs0",
    useUnifiedTopology: true,
  },
};
