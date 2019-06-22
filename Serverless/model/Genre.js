const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    attributes: {
        genreId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        
        }
    }

},
);

module.exports = mongoose.models.Genre || mongoose.model('Genre', GenreSchema);  