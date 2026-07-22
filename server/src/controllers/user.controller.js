import User from "../models/User.js";
import bcrypt from "bcrypt";

/*
=========================
Get Logged-in User
GET /api/users/me
=========================
*/

export const getMyProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
=========================
Update Profile
PUT /api/users/me
=========================
*/

export const updateProfile = async (req, res) => {

    try {

        const { fullName, phone } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        if (fullName) user.fullName = fullName;

        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Profile Updated",

            user

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
=========================
Change Password
PUT /api/users/change-password
=========================
*/

export const changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword

        } = req.body;

        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message: "Current password is incorrect"

            });

        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Password Updated Successfully"

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};