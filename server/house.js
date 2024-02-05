const HouseModel = require('./models/house.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
const multer= require('multer');
// Establishing a multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './properties') },
    filename: (req, file, callback) => { callback(null, `house-${file.originalname}`) }
})
// Filter files with multer
const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback("Not an image! Please upload only images.", false);
    }
  };
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});
// Middleware for attaching files to the request body before saving.
const attachFile = async (req, res, next) => {
    var pics = [];
    const {query, body, files} = req;
    // Check if there is an  house or house already
    if (query.id) {
        const  existingHouse = await HouseModel.findById(query.id);
        if ( existingHouse &&  existingHouse.pictures.length !== 0) {
            pics =  existingHouse.pictures;
            if (files.length !== 0) {
                pics =  existingHouse.pictures;
                files.forEach(file => {
                    pics.push(file.filename);
                });
            }
        } else if ( existingHouse &&  existingHouse.pictures.length === 0) {
            if (files.length !== 0) {
                pics =  existingHouse.pictures;
                files.forEach(file => {
                    pics.push(file.filename);
                });
            }
        } else if (!existingHouse) {
            throw new BadRequestError(`Not found!`);
        }
    } else {
        if (files.length !== 0) {
            files.forEach(file => {
                pics.push(file.filename);
            });
        }
    }
    req.body.pictures = pics;
    next();
}
      
const add = async (req, res) => {
    const data = req.body;
    const  house = await HouseModel.create(req.body);
    res.status(StatusCodes.CREATED).json({ message: 'Successfully added', house })
};
const getAll = async(req, res) => {
    const  properties = await HouseModel.find({})
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties })
};
const findById = async(req, res) => {
    const  houseId = req.query.id;
    const  house = await HouseModel.findById( houseId);
    if(!house){
        throw new BadRequestError(`House not found!`)
    }
    res.status(StatusCodes.OK).json({ house })
};
const findByOwnerId = async(req, res) => {
    const ownerId = req.query.ownerId;
    const properties = await HouseModel.find({ ownerId: ownerId });
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties });
};
const findByLocation = async(req, res) => {
    const location = req.query.location;
    let  properties = [];
    const allProperties = await HouseModel.find({});
    allProperties.forEach(house => {
        if ( house.location === location ||  house.location.includes(location)) {
            properties.push(house);
        }
    })
    res.status(StatusCodes.OK).json({ nbHits: properties.length, properties });
};
const findByMapCoordinates = async(req, res) => {
    const mapCoordinates = req.query.mapCoordinates;
    const properties = await HouseModel.find({ mapCoordinates: mapCoordinates });
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties });
};
const findByStatus = async(req, res) => {
    const status = req.query.status;
    const properties = await HouseModel.find({ status: status });
    res.status(StatusCodes.OK).json({ nbHits: properties.length, properties });
};
const findByPostId = async(req, res) => {
    const postId = req.query.postId;
    const  properties = await HouseModel.find({ postId: postId });
    res.status(StatusCodes.OK).json({ nbHits:  properties.length,  properties });
};
const edit = async(req, res) => {
    const  house = req.body;
    const  houseId = req.query.id;
    const updated = await HouseModel.findByIdAndUpdate({ _id:  houseId }, house);
    const updatedHouse = await HouseModel.findById(updated._id);
    res.status(StatusCodes.OK).json({ message: 'Updated', house: updatedHouse })
};
function fetchLatestUploadedHouse(properties) {
    var unpaid = properties.filter(element => element.status === 'Unpaid')
    const latestHouse =  unpaid.reduce((prev, current) => {
        if (!prev || current.createdOn > prev.createdOn) {
          return current;
        } else {
          return prev;
        }
    }, null);
    return latestHouse;
};
const editLatest = async(req, res) => {
    const  { ownerId, status } = req.body;
    const userProperties = await HouseModel.find({ ownerId: ownerId });
    const latestPostedHouse = fetchLatestUploadedHouse(userProperties);
    console.log(latestPostedHouse);
    await HouseModel.findByIdAndUpdate({ _id: latestPostedHouse._id }, { status: status });
    res.status(StatusCodes.OK).json({ message: 'Updated' });
};
const remove = async(req, res) => {
    const houseId = req.query.id;
    const deletedHouse = await HouseModel.findByIdAndRemove({ _id: houseId});
    if (!deletedHouse) {
        throw new NotFoundError(`House with id ${houseId} not found!`);
    }
    res.status(StatusCodes.OK).json({ message: 'Deleted'})
};
module.exports = { add, getAll, findById, findByStatus,}