const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PdfSchema = Schema({
    name: String,
    url: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
});

module.exports = mongoose.model('Pdf', PdfSchema);
