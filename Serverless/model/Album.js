const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const Schema = mongoose.Schema;

const TrackSubSchema = new Schema({
    id: {
        type: String,
        required: true,
        validate: {
            validator(id) {
                return validator.isMongoId(id);
            }
        }
    },
    type: {
        type: String,
        required: true
    }
},
{ _id : false }
)

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
                        validator(id) {
                            return validator.isMongoId(id);
                        }
                    }
                },
                type: {
                    type: String,
                    required: true
                }
            }
        },
        tracks: {
            data: [TrackSubSchema]
        }
    }
},
{versionKey:false}
);


AlbumSchema.plugin(mongoosePaginate);
TrackSubSchema.plugin(mongoosePaginate);
module.exports = mongoose.models.Album || mongoose.model('Album', AlbumSchema);  