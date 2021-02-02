const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({
    name: {type: String, required: true},
    key: { type: String, required: true}
});

module.exports = mongoose.model('Category', CategorySchema);