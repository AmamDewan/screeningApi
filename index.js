const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const config = require('config');
const winston = require('winston');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    user: config.get('DB_USER'),
    host: config.get('DB_HOST'),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_DATABASE') 
})

// db.connect()

// db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// app.get("/lol")
app.get('/',(req,res)=>{
    const obj={
        name:"amar matha"
    }
    res.send(obj);
})

app.get('/screeningapi', (req, res) => {

    res.render('inde', { title: 'NRBC' });
  
});

  
app.post("/screeningapi", (req, res) => {

    const username = req.body.username
    const fullname = req.body.fullname
    const password = req.body.password
    const phone = req.body.phone
    const location = req.body.location
    
    console.log(username)
    console.log(fullname)
    console.log(password)
    console.log(phone)
    console.log(location)

    bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) {
            console.log(err)
        }


        

        db.query(
            "INSERT INTO log_reg (user_name, full_name, password, phone, location) VALUES (?,?,?,?,?)",
            [username, fullname, hash, phone, location],
            (err, result) => {
                if (err){
                    console.log(err);
                } else {
                    res.send("VALUES INSERTED")
                }
                
            }
        ); 

    })
});







app.post("/login", (req, res) => {

    const username = req.body.username
    const password = req.body.password
   

    db.query(
        "SELECT * FROM log_reg WHERE user_name = ?;",
        username,
        (err, result) => {
            if (err){
                res.send({ err : err});
                // console.log(err);
            }
            if(result.length > 0){
                 bcrypt.compare(password, result[0].password, (error, response) =>{
                     if(response){
                         res.send(result)
                     } else {
                        res.send({ message: "Wrong username / password combination!" });
                     }
                 })
            } else {
                res.send({ message: "User does not exist" });
            }
            
        }
    );
});


// const userScore = this.state.score

app.post("/upload", (req, res) => {

    // const score = req.body.score
    // const score = Play.body.score
    console.log("possible")

    // const username = req.body.username
    const score = req.body.score
    const numberOfQuestions = req.body.numberOfQuestions
    const attemptedNoQuestions = req.body.attemptedNoQuestions
    const correctAnswers = req.body.correctAnswers
    const wrongAnswers = req.body.wrongAnswers
    const fiftyFiftyUsed = req.body.fiftyFiftyUsed
    const hintsUsed = req.body.hintsUsed
    
    // console.log(username)
    console.log(score)
    console.log(numberOfQuestions)
    console.log(attemptedNoQuestions)
    console.log(correctAnswers)
    console.log(wrongAnswers)
    console.log(fiftyFiftyUsed)
    console.log(hintsUsed)





    db.query(
        "INSERT INTO score (score ,numberOfQuestions ,attemptedNoQuestions ,correctAnswers ,wrongAnswers ,fiftyFiftyUsed ,hintsUsed) VALUES (?,?,?,?,?,?,?)",
        [score, numberOfQuestions, attemptedNoQuestions, correctAnswers, wrongAnswers, fiftyFiftyUsed, hintsUsed],
        (err, result) => {
            if (err){
                console.log(err);
            } else {
                res.send("VALUES INSERTED")
                console.log(result)
            }
            
        }
    );

 
});


const port = process.env.PORT || config.get("port");
const server = app.listen(port, ()=>{
    console.log("Server Running at "+port);
});



module.exports = server;