const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductEvaluation = Schema({
    user: { type: Schema.Types.ObjectId, ref: "Address" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    rating: {type: String, required: true},
    date: { type: Date, required: true}
});

module.exports = mongoose.model('ProductEvaluation', ProductEvaluation);