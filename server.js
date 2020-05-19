const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
//import to connect database
const knex = require('knex');

// import register controller
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


//function to connect the database
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});

// postgres query statement
db.select('*').from('users').then(data => {
  console.log(data);
});


const app = express();

app.use(bodyParser.json());
app.use(cors())

// --> res = this is working
app.get('/', (req, res) =>{
  res.send(database.users);
})
// signin API--> POST success/fail
app.post('/signin', signin.handleSignin(db, bcrypt))
// register API --> POST = user
app.post('/register',(req, res) =>{ register.handleRegister(req, res, db, bcrypt ) })
// profile API/:userId --> GET = user
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
// image API -- PUT --> user
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, () =>{
  console.log('app is running on port 3000');
})