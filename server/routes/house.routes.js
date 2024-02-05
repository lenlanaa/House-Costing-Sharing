const express = require('express');
const houseRouter = express.Router();
const {create,list,update, remove, attachFile, upload, getImages} = require ('../controller/house.controller');


houseRouter.post('/add', upload.single('housePhoto'), attachFile, create);
houseRouter.get('/list', list);

houseRouter.put('/update', update);
houseRouter.delete('/delete', remove);

houseRouter.get('/images', getImages);

module.exports = houseRouter;