const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = Schema({
    name: {type: String, required: true},
    code: { type: String, required: true},
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    value: {type: Number, required: true},
    expiresAt: {type: Date, required: true},
    percentage: {type: Boolean, default: false}
});

module.exports = mongoose.model('Coupon', CouponSchema);