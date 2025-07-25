import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required : true
    },
    isGroup: {
        type: String,
        required : true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "userModel"
    }
}, { timestamps: true })

const CategoryModel = mongoose.model('categoryModel', categorySchema)
export default CategoryModel;