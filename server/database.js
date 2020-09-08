const { MongoClient, ObjectID } = require('mongodb')
const fs = require("fs");


const url = 'mongodb://localhost:27017';
const dbName = 'boatshop';
const collectionName = 'boats';


//addAllBoats Hämtar alla båtar ifrån databasen, obs återställer ej. Används ej i Frontend Demonstrationsfilerna
function addAllBoats(callback) {
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if (error) {
				console.log("An error occured. Could not connect." + error);
			return;
		}
		const col = client.db(dbName).collection(collectionName);
		let boats;
		let data = "";
		const fsReader = fs.createReadStream("./restoreboats.json");
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
			} finally {
				callback(boats)}
		});
		}
	);
	}



function getAllBoats(callback) {
	get({}, callback)
}



function getBoat(id, callback) {
	get({ _id: new ObjectID(id) }, array => callback( array[0] ))
}



async function search(query, callback) {
	let sortFilter ="";
	const filter = {};

	if ( query.word ) {
		filter.model = RegExp(`${query.word}`, 'i');
	} if (query.maxprice) {
		filter.price = {$lt : Number(query.maxprice) }
	} if (query.is_sail) {
		filter.sail = (query.is_sail);
	} if (query.has_motor) {
		filter.motor = (query.has_motor);
	} if (query.madebefore) {
		filter.model_year = {$lt : Number(query.madebefore) };
	} if (query.madeafter) {
		filter.model_year = {$gt : Number(query.madeafter) };
	}  if (query.order) {
		sortFilter = await sort(query.order)
	}

	get(filter, callback, sortFilter)
	}

function sort(order) {
	switch (order) {
		case "lowprice":
			sortFilter = {price : 1};
			break;
		case "name_asc":
			sortFilter = {model : -1};
			break;
		case "name_desc":
			sortFilter = {model : 1};
			break;
		case "oldest":
			sortFilter = {model_year : 1};
			break;	
		case "newest":
			sortFilter = {model_year : -1};
			break;	
		default:
			sortFilter = {model : 1};
	}

	return sortFilter;
}



function get(filter, callback, sortFilter) {
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if( error ) {
				callback('"ERROR!! Could not connect"');
				return;
			}
			
			const col = client.db(dbName).collection(collectionName);
			try {
				const cursor = await col.find(filter).sort(sortFilter);
				const array = await cursor.toArray()
				callback(array);

			} catch(error) {
				console.log('Query error: ' + error.message);
				callback('"ERROR!! Query error"');

			} finally {
				client.close();
			}

		}
	)
}



function editBoatList(requestBody, callback, method) {
	const doc = requestBody
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if( error ) {
				callback('"ERROR!! Could not connect"');
				return; 
			}
			const col = client.db(dbName).collection(collectionName);
			try {
				if (method === 'POST') {
					await addBoat(col, doc, callback)
				} else if (method === 'DELETE') {
					await deleteBoat(col, doc, callback)
				} else if (method === 'PUT') {
					await updateBoat(col, doc, callback)
				}
				

			} catch(error) {
				console.error('error: ' + error.message);
				callback('"ERROR!! Query error"');

			} finally {
				client.close();
			}
		}
	)
}



async function deleteBoat (col, doc, callback) {
	// const result = await col.deleteOne({_id: new ObjectID(doc)});
	const result = await col.deleteOne({});
	callback({
		result: result.result,
		ops: result.ops
	})
}

async function addBoat (col, doc, callback) {
	const result = await col.insertOne(doc);
	callback({
		result: result.result,
		ops: result.ops
	})
}


async function updateBoat (col, doc, callback) {
	const result = await col.updateOne({_id: new ObjectID(doc.query.id)}, {$set: doc.body});
	callback({
		result: result.result,
		ops: result.ops
	})
}


module.exports = {
	getAllBoats, getBoat, editBoatList, search, addAllBoats
}