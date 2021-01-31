const express = require('express'); // server
const bcrypt = require('bcrypt-nodejs'); // middleware for password security
const cors = require('cors'); // middleware for web security
const knex = require('knex'); // database

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'chiahohsiung',
    password : '',
    database : 'face-recognition'
  }
});


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json()); // parse json
app.use(cors());


app.get('/', (req, res) => {res.json('HELLO');})
// signin
app.post('/signin', (req, res) => {signin.handleSignin(req, res, bcrypt, db)});
// register
app.post('/register', (req, res) => {register.handleRegister(req, res, bcrypt, db)});
// profile id
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(3000, () => {
  console.log('app is running on port 3000');
})
