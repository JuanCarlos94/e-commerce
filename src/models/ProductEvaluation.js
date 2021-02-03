const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductEvaluation = Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: {type: String, required: true},
    date: { type: Date, required: true},
    message: {type: String}
});

module.exports = mongoose.model('ProductEvaluation', ProductEvaluation);