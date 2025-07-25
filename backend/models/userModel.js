import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    address: {
        type: String,
        required : true
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default : false
    },
    token: {
        type: String,
        required: false,
        default : ""
    }
}, { timestamps: true })

const UserModel = mongoose.model('userModel', userSchema)
export default UserModel;