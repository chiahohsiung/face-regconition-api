const handleRegister = (req, res, bcrypt, db) => {  
  const {name, email, password} = req.body; // destructuring json
  if (!name || !email || !password) {
    return res.status(400).json('invalid form submission');
  }

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
}  

module.exports = {
  handleRegister: handleRegister
};