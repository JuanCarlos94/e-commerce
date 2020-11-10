const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StageSchema = Schema({
    description: {type: String, required: true},
    date: { type: Date, required: true},
})