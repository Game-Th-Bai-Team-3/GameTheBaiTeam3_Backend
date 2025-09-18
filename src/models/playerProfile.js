const mongoose = require('mongoose');

// Chứa dữ liệu lâu dài của người chơi
const playerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    currency: [{
        gold: {
            type: Number,
            default: 0
        },
        gem: {
            type: Number,
            default: 0
        },
    }],

    cards: [{
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    
    // achievements: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Achievement'
    // }],
    // 
    // stats: {
    //   gamesPlayed: { type: Number, default: 0 },
    //   wins: { type: Number, default: 0 }
    // },
}, { timestamps: true });

const PlayerProfile = mongoose.model('PlayerProfile', playerProfileSchema);
module.exports = PlayerProfile;