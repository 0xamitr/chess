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
    password: {
        type: String,
        required: true,
    },
    creation:{
        type: Date,
        required: true,
        default: Date.now,
    },
    friends: {
        type: [
            {
                id: {
                    type: String,
                },
                name: {
                    type: String,
                },
            }
        ]
    },
    pendingfriends:{
        type: [
            {
                id: {
                    type: String,
                },
                name: {
                    type: String,
                },
            }
        ]
    },
    games:{
        type: [
            {
                winner: {
                    type: String,
                },
                creation: {
                    type: Date,
                    default: Date.now,
                },
                moves: Number,
            },
        ],
    },
    elo: Number
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)


export default User