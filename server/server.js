const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 1337;

const { getAllBoats, getBoat, editBoatList, search } = require('./database.js');

// Tema: hattaffär

// **** Middleware ****
app.use( express.static(__dirname + '/../public') )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next()
} )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )

// **** Routes ****
// GET /api/hats
app.get('/api/boats', (req, res) => {
	getAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})

// GET /api/hat?id=x
app.get('/api/boat', (req, res) => {
	getBoat(req.query.id, dataOrError => {
		res.send(dataOrError)
	})
})

app.get('/api/search', (req, res) => {
	console.log(req.query)
	search(req.query, dataOrError => {
		res.send(dataOrError)
	})
})

// POST
app.post('/api/boat?', (req, res) => {
	editBoatList(req.body, dataOrError => {
		res.send(dataOrError)
	}, req.method)
})

// PUT
// app.put('/api/boat?', (req, res) => {
// 	addHat(req.query.id, dataOrError => {
// 		res.send(dataOrError)
// 	}, req.method, req.body)
// })
app.put('/api/boat?', (req, res) => {
	editBoatList(req, dataOrError => {
		res.send(dataOrError)
	}, req.method)
})

// DELETE
app.delete('/api/boat?', (req, res) => {
	editBoatList(req.query.id, dataOrError => {
		res.send(dataOrError)
	}, req.method)
})


// **** (eventuellt felhantering) ****


// ****Starta webbservern ****
app.listen(port, () => console.log('Server is listening on port ' + port))