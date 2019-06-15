const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    type: {
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
        title: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true,
            validate: {
                validator(artist) {
                    return validator.isNumeric(artist);
                }
            }
        },
    }
},
);

module.exports = mongoose.models.Album || mongoose.model('Album', AlbumSchema);  