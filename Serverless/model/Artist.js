const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    type:{
        type: String,
        required: true
    },

    _id: {
        type: String,
        required: true,
        validate: {
            validator(_id) {
                return validator.isNumeric(_id);
            }
        }
    },
    attributes: {
        name: {
            type: String,
            required: true
        
        },
    }
},
);

module.exports = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);  