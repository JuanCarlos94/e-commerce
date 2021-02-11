const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiscountSchema = Schema({
    name: {type: String, required: true},
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    value: {type: Number, required: true},
    expiresAt: {type: Date, required: true},
    percentage: {type: Boolean, default: false}
});

DiscountSchema.methods.apply = function(value) {
    if(this.percentage)
        return value - (this.value * value);
    return value - this.value;
}

module.exports = mongoose.model('Discount', DiscountSchema);