// cài đặt seversever
const express = require('express');
const engines = require('consolidate');
const lol = express();

var bodyParser = require("body-parser");
lol.use(bodyParser.urlencoded({ extended: false }));
// cài đặt dùng file static
var publicDir = require('path').join(__dirname,'/public');
lol.use(express.static(publicDir));

//npm i handlebars consolidate --save
lol.engine('hbs',engines.handlebars);
lol.set('views','./views');
lol.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/test";

lol.get('/',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    let results = await dbo.collection("sales").find({}).toArray();
    res.render('index',{model:results});
})


//localhost:3000/student
lol.get('/student',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    let results = await dbo.collection("sales").find({}).toArray();
    res.render('car',{model:results});
})

const PORT = process.env.PORT || 3000;
var server=lol.listen(PORT,function() {});

