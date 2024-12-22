import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
    players: {
        type: [
            {
                id: {
                    type: String,
                },
                name: {
                    type: String,
                },
            },
        ],
        required: true,
    },
    creation: {
        type: Date,
        required: true,
        default: Date.now,
    },
    winner: {
        type: {
            id: {
                type: String,
            },
            name: {
                type: String,
            },
        },
        required: true,
    },
    pgn: {
        type: String,
        required: true,
    },
    game_id: {
        type: String,
        required: true,
    },
})


const GameS = mongoose.models.GameS || mongoose.model('GameS', GameSchema)

export default GameS