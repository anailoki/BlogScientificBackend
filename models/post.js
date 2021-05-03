const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const PostSchema = Schema({
    title: String,
    url: {
        type: String,
        unique: true,
    },
    description: String,
    briefDescription: String,
    date: Date,
    active: Boolean,
    image: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
