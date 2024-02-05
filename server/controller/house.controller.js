const { StatusCodes } = require('http-status-codes');
const houseModel =require('../models/house.model');
const multer= require('multer');

// Establishing a multer storage
const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => { callback(null, './houses') },
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
    // console.log(req.file);
    // req.body.housePhoto = req.file.filename;
    next();
}

const getImages = async (req, res, next) => {
    try {
        var properties = await houseModel.find({});
        var images = properties.map(property => ({
            housePhoto: req.protocol + '://' + req.get('host') + '/' + property.housePhoto
        }));
        res.status(StatusCodes.OK).json({
            images
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({message: error.message});
    }
};

const create = async (req, res, next) => {
    console.log(req.body);
    try {
        var recordedProperty = await houseModel.create(req.body);
        console.log(recordedProperty);
        res.status(StatusCodes.CREATED).json({
            message: 'property recorded successfully',
            recordedProperty
        })
        // res.status(500).json({message: 'property already exists'}) 
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST) .json({message:error.message});
    }
};
const list = async (req, res, next) => {
    try {
        var allProperty = await houseModel.find({});
        res.status(StatusCodes.ACCEPTED).json({
            allProperty
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error);
        
    }
};

const update = async (req, res, next) => {
    try {
        console.log(req.body);
        var updatedHouse = await houseModel.findByIdAndUpdate({_id:req.query.id},req.body);
        var house = await houseModel.find(updatedHouse._id);
    
        res.status(StatusCodes.CREATED).json({
        message:'house updated successfully',
        house
        })
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
};
const remove = async (req, res, next) => {
    try{
        var deletedProperty = await houseModel.findByIdAndDelete(req.query.id);
        if(deletedProperty) {
            res.status(200).json({
                message: "This property has been deleted successfully",
            });
        }
        else{
            res.status(StatusCodes.NOT_FOUND).send("This house is not found!");
        }
    }
    catch(error){
        res.status(StatusCodes.BAD_REQUEST) .json({message:error.message});
    }
}

module.exports ={
    create,
    list,
    update,
    remove,
    attachFile,
    upload,
    getImages
}