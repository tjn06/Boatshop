const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 1337;

const { getAllBoats, getBoat, editBoatList, search, addAllBoats } = require('./database.js');


//START Kod för fil/bildhantering-----------------------------------------------------------------
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
//AVSLUT Kod för fil/bildhantering-----------------------------------------------------------------


// **** Middleware ****
app.use( express.static(__dirname + '/../public') )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next()
} )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )

// ROUTES

//GET request som hämtar alla båtar ifrån databasen, obs återställer inte. Används ej i Frontend Demonstrationsfilerna
app.get('/api/addboats', (req, res) => {
	addAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})

//GET Frontend display of API
app.get("/", (req, res) => {
	res.sendFile('frontend.html', { root: './public' });
  });

// GET All boats
app.get('/api/boats', (req, res) => {
	getAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})


// GET Boat by id 
app.get('/api/boat', (req, res) => {
	getBoat(req.query.id, dataOrError => {
		res.send(dataOrError)
	})
})

// GET Search Boats by filters
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




//START Kod för bildhantering---------------------------------------------------------------
//------------------------------------------------------------------------------------------

// Middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/../public/views'));

// DB
const mongoURI = "mongodb://localhost:27017/boatshop";

// connection
const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
	});
});

// Storage
const storage = new GridFsStorage({
url: mongoURI,
	file: (req, file) => {
    		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
        		if (err) {
        		return reject(err);
        }
		// const filename = buf.toString("hex") + path.extname(file.originalname);
		const filename = file.originalname;
        const fileInfo = {
        	filename: filename,
        	bucketName: "uploads"
        };
        resolve(fileInfo);
		});
	});
	}
});

const upload = multer({
	storage
});

//START kod för bildhantering frontend.hmtl--------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------

//GET list of imagefiles
app.get("/api/imagelist", (req, res) => {
	if(!gfs) {
    	console.log("some error occured, check connection to db");
    	res.send("some error occured, check connection to db");
    	process.exit(0);
	}
	gfs.find().toArray((err, files) => {
    // check if files
    	if (!files || files.length === 0) {
			console.log('No imagefiles in database')
			return res.json();
    	} else {
			//check filetype return images
			const f = files.filter(file => file.contentType === "image/png" || file.contentType === "image/jpeg");
			return res.json(f); //
    }
    // return res.json(files);
	});
});

//POST One file frontend
app.post("/api/frontendupload", upload.single("file"), (req, res) => {
	// res.json({file : req.file})
	//   res.redirect("/");
  });

//-------------------------------------------------------------------------------------------------------------
//AVSLUT Kod för bildhantering frontend.html-------------------------------------------------------------------



//START Kod för bildhanterin image-handeling.ejs-------------------------------------------------------------------------
// Route För separat fil image-handeling.ejs
app.get("/handleimages", (req, res) => {
	if(!gfs) {
    	console.log("some error occured, check connection to db");
    	res.send("some error occured, check connection to db");
    	process.exit(0);
	}
	gfs.find().toArray((err, files) => {
    // check if files
    	if (!files || files.length === 0) {
			return res.render("image-handeling", {
        		files: false
		});
    	} else {
			const f = files
        	.map(file => {
				if (
            	file.contentType === "image/png" ||
            	file.contentType === "image/jpeg"
				) {
            	file.isImage = true;
				} else {
            	file.isImage = false;
				}
				return file;
        })
        .sort((a, b) => {
			return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
			);
        });


		return res.render("image-handeling", {
         	files: f
		 });
    }

    // return res.json(files);
	});
});


app.post("/api/upload", upload.single("file"), (req, res) => {
  // res.json({file : req.file})
	res.redirect("/handleimages");
});


app.post("/api/uploads", upload.array("myFiles", 22), (req, res) => {
	// res.json({file : req.file})
	  res.redirect("/handleimages");
});

//GET all files
app.get("/api/files", (req, res) => {
	gfs.find().toArray((err, files) => {
    // check if files
    	if (!files || files.length === 0) {
			return res.status(404).json({
        	err: "no files exist"
		});
    }

    return res.json(files);
	});
});

//GET file by filname
app.get("/api/files/:filename", (req, res) => {
	gfs.find(
    {
		filename: req.params.filename
    },
    (err, file) => {
		if (!file) {
        return res.status(404).json({
			err: "no files exist"
        });
		}

		return res.json(file);
    }
	);
});

//GET image by filname
app.get("/api/image/:filename", (req, res) => {
  // console.log('id', req.params.id)
	const file = gfs
    .find({
		filename: req.params.filename
    })
    .toArray((err, files) => {
		if (!files || files.length === 0) {
        	return res.status(404).json({
				err: "no files exist"
        });
		}
		gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});


// Delete chunks from the db
app.post("/api/files/del/:id", (req, res) => {
	gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    	if (err) return res.status(404).json({ err: err.message });
    	res.redirect("/handleimages");
	});
});
//-------------------------------------------------------------------------------------------------------------
//AVSLUT Kod för bildhanterin image-handeling.ejs------------------------------------------------------------------------



// START WEBSERVER
app.listen(port, () => console.log('Server is listening on port ' + port))