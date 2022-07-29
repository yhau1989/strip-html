/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const config = require("./conecction.json");
const { MongoClient } = require("mongodb");



async function AddArticlesMigration(docs) {
  const client = new MongoClient(config.ccMongo);
  try {
    const database = client.db("laprensa");
    const articlesMigrations = database.collection("migrations");
    const result = await articlesMigrations.insertMany(docs);
  }
  catch(error )
  {
    console.error('AddArticlesMigration error: ', error);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = {
    AddArticlesMigration,
};
