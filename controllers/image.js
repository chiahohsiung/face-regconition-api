const Clarifai = require('clarifai');// clarifai api

const app = new Clarifai.App({
 apiKey: '16166989a73f49b4910effe174634342'
});

const handleApiCall = (req, res) => {
  const { input } = req.body;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL,input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json(err));
}

const handleImage = (req, res, db) => {
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
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};
