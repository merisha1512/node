const express = require("express");
const  mongoose = require("mongoose");
const router = require('./course/course.router');
const app = express();

app.use(express.json());
app.use('/', router);

mongoose.connect("mongodb+srv://Akash:05121998@cluster0.b9jwp.mongodb.net/akash?retryWrites=true&w=majority",
{useNewUrlParser : true , useUnifiedTopology : true})
.then(()=> console.log("Connected To Database"));

const port = 7000;
app.listen(port, () => console.log(`Server Start & port:${port}`));
