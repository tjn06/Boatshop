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
            col.countDocuments(function (countError, count) {
            if (!countError && count === 0) {
              // Om collection är tom, och vi inte får error, lägg till alla båtar på nytt.
                addAllBoats();
            } else {
                deleteAllBoats();
            }
            client.close();
            });
        } catch (err) {
            console.log(err);
            client.close();
        }
    }
);


async function deleteAllBoats () {
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
                await addAllBoats ()
            } catch (err) {
                console.log(err)
                client.close();
            } finally {
              client.close();
            }
        }
        );
    }


async function addAllBoats () {
    MongoClient.connect(
        url,
        { useUnifiedTopology: true },
        async (error, client) => {
            if (error) {
            console.log("An error occured. Could not connect." + error);
            return;
            }
            const col = client.db(dbName).collection(collectionName);
            await col.deleteMany({});
            let boats;
            let data = "";
            const fsReader = fs.createReadStream("restoreboats.json");
            fsReader.on("data", (chunk) => {
            data += chunk;
            });
            fsReader.on("end", () => {
            boats = JSON.parse(data);
            try {
                boats.forEach((boat, i) => {
                    col.insertOne(boat, (res) => {
                        if (i === boats.length - 1) {
                            client.close();
                        }
                    });
                });
            } catch (err) {
                console.log(err);
                client.close();
                }
            });
        }
    );
}
