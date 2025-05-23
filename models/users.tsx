import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String
    },
    img:{
        type: String,
        default: '/user.png'
    },
    provider: { 
        type: String, 
        required: true, 
        enum: ["credentials", "google"] 
    },
    creation: {
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
                img: {
                    type: String,
                    default: '/user.png'
                }
            }
        ]
    },
    pendingfriends: {
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
    games: {
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