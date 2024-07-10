import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user-interface";

const user_schema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    image_url: {
        type: String,
        required: false,
        default: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D"
    },
    phone: {
        type: String,
        required: false
    },
})

const User = model<IUser & Document>('User', user_schema)
export default User