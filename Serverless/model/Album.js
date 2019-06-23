const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    type: {
        type: String,
        required: true,
    },

    attributes:{
        albumId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
    },

    relationships: {
        artist: {
            data:{                
                id: {
                    type: String,
                    required: true,
                    validate: {
                        validator(artist) {
                            return validator.isMongoId(artist);
                        }
                    }
                },
                type: {
                    type: String,
                    required: true
                }
            }
        },
    }

},
);
AlbumSchema.plugin(mongoosePaginate);
module.exports = mongoose.models.Album || mongoose.model('Album', AlbumSchema);  