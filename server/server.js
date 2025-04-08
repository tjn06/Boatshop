const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 1337;
const { getAllBoats, getBoat, editBoatList, search, addAllBoats } = require('./database.js');
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

// **** Middleware ****
app.use( express.static(__dirname + '/../public') )
app.use( (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next()
} )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )

// ROUTES
app.get('/api/addboats', (req, res) => {
	addAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})

// GET Frontend display of API
app.get("/", (req, res) => {
	res.sendFile('frontend.html', { root: './public' });
});

app.get('/api/boats', (req, res) => {
	getAllBoats(dataOrError => {
		res.send(dataOrError)
	});
})

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

app.post('/api/boat?', (req, res) => {
	editBoatList(req.body, dataOrError => {
		res.send(dataOrError)
	}, req.method)
})

app.put('/api/boat?', (req, res) => {
	editBoatList(req, dataOrError => {
		res.send(dataOrError)
	}, req.method)
})

app.delete('/api/boat?', (req, res) => {
	editBoatList(req.query.id, dataOrError => {
		res.send(dataOrError)
	}, req.method)
})

// Images frontend.html
app.use(express.json());
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/../public/views'));

const mongoURI = "mongodb://localhost:27017/boatshop";

const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

let gfs;
conn.once("open", () => {
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
	});
});

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

app.get("/api/imagelist", (req, res) => {
	if(!gfs) {
    	console.log("some error occured, check connection to db");
    	res.send("some error occured, check connection to db");
    	process.exit(0);
	}
	gfs.find().toArray((err, files) => {
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

app.post("/api/frontendupload", upload.single("file"), (req, res) => {
	// res.json({file : req.file})
	// res.redirect("/");
});



// Images image-handeling.ejs
app.get("/handleimages", (req, res) => {
	if(!gfs) {
    	console.log("some error occured, check connection to db");
    	res.send("some error occured, check connection to db");
    	process.exit(0);
	}
	gfs.find().toArray((err, files) => {
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

app.get("/api/files", (req, res) => {
	gfs.find().toArray((err, files) => {
    	if (!files || files.length === 0) {
			return res.status(404).json({
        	err: "no files exist"
		});
    }
    return res.json(files);
	});
});

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

app.get("/api/image/:filename", (req, res) => {
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

app.post("/api/files/del/:id", (req, res) => {
	gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    	if (err) return res.status(404).json({ err: err.message });
    	res.redirect("/handleimages");
	});
});

app.listen(port, () => console.log('Server is listening on port ' + port))
