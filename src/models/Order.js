const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    product: {type: Schema.Types.ObjectId, ref: 'Product'},
    count: {type: Number, required: true},
    value: {type: Number, required: true}
});

module.exports = mongoose.model('Order', OrderSchema);