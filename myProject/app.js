const express = require("express");
const mongoose = require("mongoose");
const MovieRouter = require("./Movies/movie.router"); 
const userSignUpRouter = require("./Users/user.router");
const authRouter = require("./Authentication/auth.router");
const authenticationRouter = require("./Auth/auth.router")
const dotEnv = require('dotenv');
const app = express();


app.use(express.json());
app.use((req,res,next)=>{
  req.requestTime = new Date(). toISOString();
  console.log(req.headers);
  next()
});
app.use("/movie", MovieRouter);
app.use("/userSignUp",userSignUpRouter);
app.use("/auth",authRouter);
app.use("/authentication",authenticationRouter);


dotEnv.config({path:'./config.env'})
//console.log(app.get('env'))
//console.log(process.env)

// mongo db connection
mongoose
  .connect(
    `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.b9jwp.mongodb.net/${process.env.db}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to Database"));

  // port and listen
const port = process.env.port;
app.listen(port, () => console.log(`Server Start & port:${port}`));
