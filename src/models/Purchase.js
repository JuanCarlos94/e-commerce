const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = Schema({
    createdAt: {type: Date, required: true},
    amount: {type: Number, required: true, default: 0},
    status: {type: Enumerator, required: true},
    stageHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    },
    discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount'
    }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);