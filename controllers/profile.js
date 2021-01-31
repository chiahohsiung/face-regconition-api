const handleProfile = (req, res, db) => {
  const { id } = req.params; // use param to get id
  db.select().from('users').where('id', id)
    .then(user => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(400).json("No such id");
      }      
    });
}

module.exports = {
    handleProfile: handleProfile
};