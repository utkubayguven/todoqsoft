const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');


const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos')

const dburl = "mongodb://localhost:27017/tododb"
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true})

app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());



app.use(authRoutes)
app.use(todosRoutes)


app.listen(3000);