module.exports = {
  "mongoURL" : process.env.MONGO_URL || 'localhost',
  "mongoUser" : process.env.MONGO_USER || '',
  "mongoPass" : process.env.MONGO_PASS || '',
  "mongoDBName" : process.env.MONGO_DB_NAME || 'todos',
  "replicaSet" : process.env.MONGO_REPLICA_SET_NAME || 'rs0'
};
