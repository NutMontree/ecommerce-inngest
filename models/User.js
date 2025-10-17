import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // ใช้ String ถ้าใช้ UID หรือ custom ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: {
        type: Object,
        default: {},
    },
}, { minimize: false });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;