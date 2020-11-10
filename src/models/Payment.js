const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = Schema({
    status: {type: String, required: true},
    method: { type: Enumerator, required: true},
    installments: { type: Number, required: true},
});

module.exports = mongoose.model('Payment', PaymentSchema);