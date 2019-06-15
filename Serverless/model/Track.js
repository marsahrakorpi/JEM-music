const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
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
        composer: {
            type: String,
            required: false
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
        album: {
            type: String,
            required: true,
            validate: {
                validator(album) {
                    return validator.isNumeric(album);
                }
            }
        },
        milliseconds: {
            type: String,
            required: true,
            validate: {
                validator(milliseconds) {
                    return validator.isNumeric(milliseconds);
                }
            }
        },
        bytes: {
            type: String,
            required: true,
            validate: {
                validator(bytes) {
                    return validator.isNumeric(bytes);
                }
            }
        },
        unitPrice: {
            type: String,
            required: true,
            validate: {
                validator(unitPrice) {
                    return validator.isDecimal(unitPrice);
                }
            }
        },
    }
},
);

module.exports = mongoose.models.Track || mongoose.model('Track', TrackSchema);  