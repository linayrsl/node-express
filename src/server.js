const express = require('express');
const bodyParser = require('body-parser');

const {deleteUser, getUser, getUserById, loginUser, putUser, updateUser} = require("./user");
const {deletePhoto, getPhotoById, getPhotos, putPhoto, updatePhoto} = require("./photo");


const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.put('/user', putUser);
app.get('/user', getUser);
app.get('/user/:id', getUserById);
app.post('/user/login', loginUser);
app.post('/user/:id', updateUser);
app.delete('/user/:id', deleteUser);

//

app.put('/photo', putPhoto);
app.get('/photo', getPhotos);
app.get('/photo/:id', getPhotoById);
app.post('/photo/:id', updatePhoto);
app.delete('/photo', deletePhoto);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

