const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect('mongodb://localhost:27017/excellenceDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const testSchema = new mongoose.Schema({
  first_round: {
    type: Number,
    min: 1,
    max: 10
  },
  second_round: {
    type: Number,
    min: 1,
    max: 10
  },
  third_round: {
    type: Number,
    min: 1,
    max: 10
  }
});

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Candidate name is required."]
  },
  email: {
    type: String,
    required: [true, "Email is required."]
  },
  score: testSchema
});

const Test = mongoose.model("test", testSchema);
const test = new Test({
  first_round: 8,
  second_round: 6,
  third_round: 8
});
test.save();

const Candidate = mongoose.model("Candidate", candidateSchema);
const candidate = new Candidate({
  name: "Hiamshi Tiwari",
  email: "hhkjhj",
  score: test
});
candidate.save();


app.get("/", (req, res) => {
  Candidate.find((err, user) => {
    if (!err) {
      res.send(user);
    } else {
      res.send(err);
    }
  });
});

app.post("/", (req, res) => {
    //Inserting a candidate into database
    //Assigning score to the candidate based on the test
    const newTest = new Test({
      first_round: req.body.first_round,
      second_round: req.body.second_round,
      third_round: req.body.third_round
    });
    newTest.save();

    const newCandidate = new Candidate({
      name: req.body.name,
      email: req.body.email,
      score: newTest
    });
    newCandidate.save((err) => {
      if (err){
        res.send(err);
      }
    });

    //Api to get highest scoring candidate and average scores per round for all candidates

  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.first_round);
  console.log(req.body.second_round);
  console.log(req.body.third_round);
  
  const fround = req.body.first_round;
  const sround = req.body.second_round;
  const tround = req.body.third_round;
  const total = parseInt(fround) + parseInt(sround) + parseInt(tround);
  const avrg = total/3;
  console.log("The avg of the round score is : " + avrg);
});



app.listen(27017, () => {
  console.log("Server is running at port 27017.");
});
