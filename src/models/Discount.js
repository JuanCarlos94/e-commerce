const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountSchema = Schema({
    method: {type: Enumerator, required: true},
    value: {type: Number, required: true}
});

module.exports = mongoose.model('Discount', DiscountSchema);