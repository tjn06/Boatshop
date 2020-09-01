const { MongoClient, ObjectID } = require('mongodb')

const url = 'mongodb://localhost:27017';
const dbName = 'boatshop';
const collectionName = 'boats';


function getAllBoats(callback) {
	get({}, callback)
}


function getBoat(id, callback) {
	get({ _id: new ObjectID(id) }, array => callback( array[0] ))
}

// /a/i
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
		filter.motor = (query.is_sail);
	} if (query.madebefore) {
		filter.model_year = {$lt : Number(query.madebefore) };
	} if (query.madeafter) {
		filter.model_year = {$gt : Number(query.madebefore) };
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
			sortFilter = {model : 1};
			break;
		case "name_desc":
			sortFilter = {model : -1};
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
				return;  // exit the callback function
			}
			console.log(sortFilter)
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


			// .toArray((error, docs) => {
			// 	// console.log('find filter=', filter, error, docs);
			// 	if( error ) {
			// 		callback('"ERROR!! Query error"');
			// 	} else {
			// 		callback(docs);
			// 	}
			// 	client.close();
			// })// toArray - async
		}// connect callback - async
	)//connect - async
}

function editBoatList(requestBody, callback, method) {
	console.log('addHat', requestBody);
	const doc = requestBody
	// const docBody = bodyReq
	MongoClient.connect(
		url,
		{ useUnifiedTopology: true },
		async (error, client) => {
			if( error ) {
				callback('"ERROR!! Could not connect"');
				return;  // exit the callback function
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
				console.error('addHat error: ' + error.message);
				callback('"ERROR!! Query error"');

			} finally {
				client.close();
			}
		}// connect callback - async
	)//connect - async
}


async function deleteBoat (col, doc, callback) {
	const result = await col.deleteOne({_id: new ObjectID(doc)});
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

// function deleteBoat(filter, callback) {
// 	// console.log('addHat', requestBody);
// 	const doc = filter
// 	MongoClient.connect(
// 		url,
// 		{ useUnifiedTopology: true },
// 		async (error, client) => {
// 			if( error ) {
// 				callback('"ERROR!! Could not connect"');
// 				return;  // exit the callback function
// 			}
// 			const col = client.db(dbName).collection(collectionName);
// 			try {
// 				// Wait for the resut of the query
// 				// If it fails, it will throw an error
// 				const result = await col.deleteOne({_id: new ObjectID(doc)});
// 				callback({
// 					result: result.result,
// 					ops: result.ops
// 				})

// 			} catch(error) {
// 				console.error('addHat error: ' + error.message);
// 				callback('"DELERROR!! Query error"');

// 			} finally {
// 				client.close();
// 			}
// 		}// connect callback - async
// 	)//connect - async
// }
// async function updateBoat (col, doc, callback, docBody) {
// 	console.log(docBody)
// 	const result = await col.updateOne({_id: new ObjectID(doc)}, {$set: {docBody}});
// 	callback({
// 		result: result.result,
// 		ops: result.ops
// 	})
// }


module.exports = {
	getAllBoats, getBoat, editBoatList, search
}