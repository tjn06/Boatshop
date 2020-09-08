const { MongoClient, ObjectID } = require('mongodb')
const fs = require("fs");


const url = 'mongodb://localhost:27017';
const dbName = 'boatshop';
const collectionName = 'boats';


    MongoClient.connect(
      url,
      { useUnifiedTopology: true },
      async (error, client) => {
        if (error) {
          console.log("An error occured. Could not connect." + error);
          return;
        }
        const col = client.db(dbName).collection(collectionName);
        try {
          await col.deleteMany({});
        } catch (err) {
          console.log(err);
        } finally {
          client.close();
        }
      }
    );