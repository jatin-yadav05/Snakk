const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const getProfile = async (req, res) => {
    try {
        // extract userid from params:
        const userId = req.params.id;

        // fetch user details from DB:
        const userDetails = await User.findById(userId).select("-password"); // exclude password
        if (!userDetails) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // check if user is public or private:
        if(userDetails.isPrivate) {
            return res.status(403).json({
                message: "This profile is private."
            });
        }

        res.status(200).json({
            message: "User profile fetched successfully.",
            user: userDetails
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while fetching user profile."
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        // extract user from req:
        const user = req.user;
        const { name = "", bio = "", hostel = "", isPublic = user.isPublic, roomNumber = "" } = req.body; // if no value is provided, set to empty string

        if(typeof(isPublic) !== "boolean") {
            return res.status(400).json({
                message: "isPublic should be a boolean value."
            });
        }

        // update user details which are not empty:
        const updatedUser = await User.findByIdAndUpdate(user._id, 
            {
                name: name.length > 0 ? name : user.name,
                bio: bio.length > 0 ? bio : user.bio,
                hostel: hostel.length > 0 ? hostel : user.hostel,
                isPublic: isPublic !== user.isPublic ? isPublic : user.isPublic,
                roomNumber: roomNumber.length > 0 ? roomNumber : user.roomNumber
            },
        { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            message: "User profile updated successfully.",
            user: updatedUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while updating user profile."
        });
    }
};

const updateProfilePicture = async(req, res) => {
    try {
        
        // extract user from req:
        const user = req.user;

        // extract image from req.files:
        const { image } = req.files;

        // validate image:
        if(!image) {
            return res.status(400).json({
                message: "No image file provided."
            });
        }

        // if user already has a profile picture, delete it from cloudinary:
        if(user.profilePicturePublicId) {
            await cloudinary.uploader.destroy(user.profilePicturePublicId); 
        }

        // upload image to cloudinary:
        const uploadedImage = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        // Delete temp file after upload
        fs.unlink(image.tempFilePath, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });

        // update user profile picture in DB:
        await User.findByIdAndUpdate(user._id, { profilePicture: uploadedImage.secure_url, profilePicturePublicId: uploadedImage.public_id });

        // update user object also:
        user.profilePicture = uploadedImage.secure_url;
        user.profilePicturePublicId = uploadedImage.public_id;

        // send response:
        res.status(200).json({
            message: "Profile picture updated successfully.",
        });

    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            message: "Error while updating profile picture."
        });
    }
}

const deleteProfile = async (req, res) => {
    try {
        // extract user from req:
        const user = req.user;

        // delete user from DB:
        const deletedUser = await User.findByIdAndDelete(user._id);

        // if user had a profile picture, delete it from cloudinary:
        if (user.profilePicturePublicId) {
            await cloudinary.uploader.destroy(user.profilePicturePublicId);
        }

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // setting user = null to invalidate the user in req
        req.user = null;

        // clearing the token cookie:
        res.clearCookie("token", {
            httpOnly: true
        });

        // send response:
        res.status(200).json({
            message: "User profile deleted successfully."
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while deleting user profile."
        });
    }
};

module.exports = { getProfile, updateProfile, deleteProfile, updateProfilePicture };