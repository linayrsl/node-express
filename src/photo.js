const HttpStatus = require('http-status-codes');

let photos = [];

function findPhotoById(array, id) {
    return array.find(photo => {
        return photo.id === parseInt(id);
    });
}

const putPhoto = (req, res) => {
    if (!req.body.title || !req.body.filename) {
        res.status((HttpStatus.BAD_REQUEST)).json({error: "title and filename are required fields"});
        return;
    }
    const match = photos.find(photo => {
       return (photo.title === req.body.title
               && photo.filename === req.body.filename);
    });
    if (match) {
        res.status(HttpStatus.CONFLICT).json({error: "photo already exists"});
        return;
    }
    photos.push({
        id: photos.length + 1,
        title: req.body.title,
        filename: req.body.filename
    });
    res.status(HttpStatus.CREATED).send();
};

const getPhotos = (req, res) => {
  res.json(photos);
};

const getPhotoById = (req, res) => {
    const foundPhoto = findPhotoById(photos, req.params.id);
    if(!foundPhoto) {
        res.status(HttpStatus.NOT_FOUND).json({error: "No matching photos were found"});
        return;
    }
    res.json(foundPhoto);
};

const updatePhoto = (req, res) => {
  const foundPhoto = findPhotoById(photos, req.params.id);
  if (!foundPhoto) {
      res.status(HttpStatus.NOT_FOUND).json({error: "No matching photos were found"});
      return;
  }
  const photoIndex = photos.indexOf(foundPhoto);
  if (!req.body.title || !req.body.filename) {
      res.status(HttpStatus.BAD_REQUEST).json({error: "title and filename are required fields"});
      return;
  }
  const updatedValues = req.body;
  const updatedPhoto = {
      ...foundPhoto,
      ...updatedValues
  };
  photos.splice(photoIndex, 1, updatedPhoto);
  res.status(HttpStatus.OK).json(updatedPhoto);
};

const deletePhoto = (req, res) => {
  const foundPhoto = findPhotoById(photos, req.params.id);
  if (!foundPhoto) {
      res.status(HttpStatus.NOT_FOUND).json({error: "No matching photos were found"});
      return;
  }
  const photoIndex = photos.indexOf(foundPhoto);
  photos.splice(photoIndex, 1);
  res.status(HttpStatus.OK).json({message: 'The photo was deleted'});
};

module.exports = {
   putPhoto,
    getPhotos,
    getPhotoById,
    updatePhoto,
    deletePhoto
};