const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: {type: String, required: true},
    description: { type: String, required: true},
    images: [{type: String}],
    unitValue: { type: Number, required: true},
    count: { type: Number, required: true},
    sold: {type: Number, required: true, default: 0},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    evaluations: [{ type: Schema.Types.ObjectId, ref: 'ProductEvaluation'}]
});

ProductSchema.index({name: 'text', description: 'text'});

module.exports = mongoose.model('Product', ProductSchema);