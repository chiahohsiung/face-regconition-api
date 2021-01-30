const express = require('express'); // server
const bcrypt = require('bcrypt-nodejs'); // middleware for password security
const cors = require('cors'); // middleware for web security
const knex = require('knex'); // database

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
  // console.log(req.body);
  const { email, password } = req.body;
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(response => {
      if (!response.length) {
        res.status(400).json('wrong email');
      }
      const isValid = bcrypt.compareSync(password, response[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(users => {
            res.json(users[0])
          })
          .catch(err => {
            res.json('error loading user');
          })
      } else {
        res.status(400).json('wrong credentials');
      }
    })
})

// register
app.post('/register', (req, res) => {
  const {name, email, password} = req.body; // destructuring json
  const hash = bcrypt.hashSync(password);
  
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .insert({
            email: email,
            name: name,
            joined: new Date()
          })
          .returning('*')
          .then(users => {
            res.json(users[0]);
          })
          .catch(err => {
            res.status(400).json('Unable to register');
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
  
})

// profile id
app.get('/profile/:id', (req, res) => {
  const { id } = req.params; // use param to get id
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
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => {
    res.status(400).json('unable to get entries');
  });
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})
