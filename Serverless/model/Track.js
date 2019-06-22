const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const validator = require('validator');
const Schema = mongoose.Schema;

const TrackSchema = new Schema({
    type:{
        type: String,
        required: true
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
    },

    relationships:{
        album: {
            data:{
                id: {
                    type: String,
                    required: true,
                    validate: {
                        validator(_id) {
                            return validator.isMongoId(_id);
                        }
                    }
                },
                type: {
                    type: String,
                    required: true
                }
            }

        },
        genre: {
            data: {
                id: {
                    type: String,
                    required: true,
                    validate: {
                        validator(_id) {
                            return validator.isMongoId(_id);
                        }
                    }
                },
                type: {
                    type: String,
                    required: true
                }
            }
        },
        mediaType:{
            data: {
                id: {
                    type: String,
                    required: true,
                    validate: {
                        validator(_id) {
                            return validator.isMongoId(_id);
                        }
                    }
                },
                type: {
                    type: String,
                    required: true
                }
            }
        }
    }
},
);

TrackSchema.plugin(mongoosePaginate);

module.exports = mongoose.models.Track || mongoose.model('Track', TrackSchema);  