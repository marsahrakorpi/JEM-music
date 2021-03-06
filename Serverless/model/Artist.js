const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    attributes: {
        artistId: {
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

module.exports = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);  