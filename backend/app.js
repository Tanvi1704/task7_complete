const express = require("express");
const app = express()
const bodyParser = require('body-parser')
const routing = require("./modules/app-routing");
const cors = require("cors");
const path = require('path')

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.json()); // Required for parsing JSON body
app.use(express.text()); //Required to pass text in body
app.use(express.urlencoded({ extended: true })); // Required for form data

// app.use(bodyParser.json());
// app.use(bodyParser.text());
app.use('/',require('./middlewares/validators').extractHeaderLanguage);
app.use('/',require('./middlewares/validators').validateApiKey);
app.use('/',require('./middlewares/validators').validateHeaderToken);


// Use routing system
routing.v1(app);

const port = process.env.PORT || 3000 ;

app.listen (port ,() =>{
    console.log(`server is running on port ${port}`)
} )