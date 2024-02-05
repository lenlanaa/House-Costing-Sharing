const express=require('express');
const houseRouter = require('./house.routes');
const authRouter = require('./auth.routes');
const allRoutes = express();


allRoutes.use('/property', express.static('./storage'));
allRoutes.use('/house' ,houseRouter);

allRoutes.use('/auth' ,authRouter);
module.exports = allRoutes;