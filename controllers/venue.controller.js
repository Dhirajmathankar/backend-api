const Venue = require('../models/venue.model');


const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = process?.env?.UPLOAD_DIR || "D:/Project New/APP_LOGIN_PAGE/ALL-IMAGE-PROJECT";

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

exports.createVenue = async (req, res) => {
    try {
        const venueData = req.body;
        const savedImageNames = [];
        if (venueData.images && Array.isArray(venueData.images)) {
            venueData.images.forEach((imgObj) => {
                if (imgObj.data && imgObj.fileName) {
                    const base64Data = imgObj.data.replace(/^data:image\/\w+;base64,/, "");
                    const fullFilePath = path.join(UPLOAD_DIR, imgObj.fileName);
                    fs.writeFileSync(fullFilePath, base64Data, 'base64');
                    savedImageNames.push(imgObj.fileName);
                }
            });
        }
        const finalData = { 
            ...venueData, 
            images: savedImageNames 
        };

        const venue = new Venue(finalData);
        await venue.save();

        res.status(201).json({ success: true, data: venue });
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getVenues = async (req, res) => {
    try {
        const venues = await Venue.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: venues.length, data: venues });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateVenue = async (req, res) => {
    try {
        const venueData = req.body;
        let updatedImages = [];
        if (venueData.images && Array.isArray(venueData.images)) {
            venueData.images.forEach((imgObj) => {
                if (imgObj.data && imgObj.data.startsWith('data:image')) {
                    const base64Data = imgObj.data.replace(/^data:image\/\w+;base64,/, "");
                    const fileName = imgObj.fileName || `update_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`;
                    const fullFilePath = path.join(UPLOAD_DIR, fileName);
                    fs.writeFileSync(fullFilePath, base64Data, 'base64');
                    updatedImages.push(fileName);
                } 
                else if (typeof imgObj === 'string') {
                    updatedImages.push(imgObj);
                }
                else if (imgObj.fileName && !imgObj.data) {
                    updatedImages.push(imgObj.fileName);
                }
            });
            venueData.images = updatedImages;
        }
        const venue = await Venue.findByIdAndUpdate(
            req.params.id, 
            venueData, 
            { new: true, runValidators: true }
        );
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }
        res.status(200).json({ success: true, data: venue });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.deleteVenue = async (req, res) => {
    try {
        await Venue.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Venue Deleted' });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};