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

//not secure for use in production, and to only use for local development 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

//function to connect the database
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
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
app.get('/', (req, res) =>{ res.send('it is working!') })
// signin API--> POST success/fail
app.post('/signin', signin.handleSignin(db, bcrypt))
// register API --> POST = user
app.post('/register',(req, res) =>{ register.handleRegister(req, res, db, bcrypt ) })
// profile API/:userId --> GET = user
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
// image API -- PUT --> user
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () =>{
  console.log(`app is running on port ${process.env.PORT}`);
})