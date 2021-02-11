const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = Schema({
    createdAt: {type: Date, required: true},
    total: {type: Number, required: true, default: 0},
    status: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true},
    historic: [{
        description: {type: String, required: true},
        date: { type: Date, required: true},
    }],
    orders: [{
        product: {
            id: {type: Schema.Types.ObjectId, ref: 'Product'},
            name: {type: String},
            unitValue: {type: Number}
        },
        count: {type: Number, required: true},
        total: {type: Number, required: true},
        discount: {type: Number}
    }],
    payment: {
        status: {type: String, required: true},
        method: { type: String, required: true},
        installments: { type: Number, required: true},
    }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);