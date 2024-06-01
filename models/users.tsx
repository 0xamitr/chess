import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    creation:{
        type: Date,
        required: true,
        default: Date.now,
    },
    elo: Number
})

const User = mongoose.models.user || mongoose.model('user', UserSchema);


export default User