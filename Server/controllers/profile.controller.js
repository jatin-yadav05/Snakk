const User = require("../models/user");

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
        const userId = req.params.id;
        const { name, email, bio } = req.body;

        // validate user:
        if (user._id.toString() !== userId) {
            return res.status(403).json({
                message: "Forbidden access."
            });
        }

        // update user details:
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email, bio }, { new: true });
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

const deleteProfile = async (req, res) => {
    try {
        // extract user from req:
        const user = req.user;
        const userId = req.params.id;

        // validate user:
        if (user._id.toString() !== userId) {
            return res.status(403).json({
                message: "Forbidden access."
            });
        }

        // delete user from DB:
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

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

module.exports = { getProfile, updateProfile, deleteProfile };