// console.log(req.body);
const handleSignin = (req, res, bcrypt, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('invalid form submission');
  }

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
}

module.exports = {
  handleSignin: handleSignin
};