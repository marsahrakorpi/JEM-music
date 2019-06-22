const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const MediaTypeSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    attributes: {
        mediaTypeId: {
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

module.exports = mongoose.models.MediaType || mongoose.model('MediaType', MediaTypeSchema);  