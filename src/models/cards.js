const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String },
    rarity: { 
            type: String, enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], 
          default: 'Common' },
    species: { type: String},
    element : { 
        type: String, enum: ['Normal','Fire', 'Water', 'Earth', 'Grass','Electric'], 
         default: 'Normal'},
    stats: {
        attack: { type: Number, default: 0 },
        hp : { type: Number, default: 0 },
    },
    baseCards : [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Card'
    }],
    image : { type: String  },
    
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
