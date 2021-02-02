const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: {type: String, required: true},
    description: { type: String, required: true},
    images: [{type: String}],
    unitValue: { type: Number, required: true},
    count: { type: Number, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    evaluations: [{ type: Schema.Types.ObjectId, ref: 'ProductEvaluation'}]
});

module.exports = mongoose.model('Product', ProductSchema);