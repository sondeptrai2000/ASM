// cài đặt seversever
const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// cài đặt dùng file static
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/test";

app.get('/',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    let results = await dbo.collection("sales").find({}).toArray();
    res.render('index',{model:results});
})


//localhost:3000/student
app.get('/student',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    let results = await dbo.collection("sales").find({}).toArray();
    res.render('allStudent',{model:results});
})

//user submit form
app.post('/doSearch',async (req,res)=>{
    let inputManu = req.body.Carmanufacturer;
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");

//tìm kiêm thường đúng chuẩn têntên
    let results = await dbo.collection("sales").find({CarManufacturer:inputManu}).toArray();
    res.render('allStudent',{model:results});

//tìm kiếm không phân biệt chữ hoa thường.
    // let results = await dbo.collection("sales").find({CarManufacturer: new RegExp(inputManu)}).toArray();
    // res.render('allStudent',{model:results});
})



app.get('/insert',(req,res)=>{
    res.render('insert');
})


app.get('/update',async function(req,res){
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    let results = await dbo.collection("sales").find(condition).toArray();
    res.render('update',{model:results});
})




app.post('/doInsert',async (req,res)=>{
    //lấy thông tin từ người quản trị wed
    let inputManu = req.body.txtmanufacturer;
    let inputClassify = req.body.txtClassify;
    let inputYear = req.body.txtYear;
    let inputColor = req.body.txtColor;
    let inputPrice = req.body.txtPrice;


    let newStudent = { CarManufacturer: inputManu, Classify: inputClassify , YearOfManufacture: inputYear , Color: inputColor, Price: inputPrice};
    // check xem người dùng cho nhập vào hay không
    if(inputManu.trim().length == 0){
        let modelError = {nameError:"Khong duoc de trong!"
        , emailError:"Email khong hop le"};
        res.render('insert',{model:modelError});
    }else{
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    await dbo.collection("sales").insertOne(newStudent);
    res.redirect('/student');
    }
})

app.post('/doupdate',async (req,res)=>{
    let inputId = req.body.txtId;
    let inputManu = req.body.txtmanufacturer;
    let inputClassify = req.body.txtClassify;
    let inputYear = req.body.txtYear;
    let inputColor = req.body.txtColor;
    let inputPrice = req.body.txtPrice;

    var ObjectID = require('mongodb').ObjectID;
    let condition ={ _id : ObjectID(inputId)};
    let Change = {$set :{CarManufacturer : inputManu, Classify : inputClassify , YearOfManufacture : inputYear , Color :inputColor, Price:inputPrice}};
    let client = await MongoClient.connect(url);
    let dbo = client.db("test");
    await dbo.collection("sales").updateOne(condition,Change);
    res.redirect('/student');
})


app.get('/delete',async (req,res)=>{
    let inputId = req.query.id;
    let client= await MongoClient.connect(url);
    let dbo = client.db("test");
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(inputId)};
    await dbo.collection("sales").deleteOne(condition);
    res.redirect('/student');

})
const PORT = process.env.PORT || 3000;
var server=app.listen(PORT,function() {});

