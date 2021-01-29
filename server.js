const express = require('express'); // server
const bcrypt = require('bcrypt-nodejs'); // middleware for password security
const cors = require('cors'); // middleware for web security
const knex = require('knex');

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


app.get('/', (req, res) => {
  res.json('HELLO');
})

// signin
app.post('/signin', (req, res) => {
  console.log(req.body);
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password ) {
    res.json(database.users[0]);
  }
  else {
    res.status(400).json('Error logging in');
  }
})

// register
app.post('/register', (req, res) => {
  // if (req.body.email === database.users[0].email) {
  //  res.json('The email already exists');
  // }
  // else {
  const {name, email, password} = req.body; // destructuring json
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(users => {
      res.json(users[0]);
    })
    .catch(err => {
      res.status(400).json('Unable to register');
    });;
})

// profile id
app.get('/profile/:id', (req, res) => {
  const { id } = req.params; // use param to get id
  // loop over users 
  
  db.select().from('users').where('id', id)
    .then(user => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(400).json("No such id");
      }
      
    });
})

app.put('/image', (req, res) => {
  const { id } = req.body; // use param to get id
  // loop over users 
  
  for (i = 0; i<database.users.length; ++i) {
    if (database.users[i].id === id) {
      database.users[i].entries++;
      res.json(database.users[i].entries)
      return;
    }
  }
  res.status(400).json("No such id");
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})
