var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKolkata = moment.tz(Date.now(), "Asia/Kolkata");
var ScreenSchema = mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: ""
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'countries',
        default: null
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'states',
        default: null
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cities',
        default: null
    },
    building: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'buildings',
        default: null
    },
    floor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'floors',
        default: null
    },
    created_date: {
        type: Date, default: dateKolkata
    },
    update_date: {
        type: Date, default: dateKolkata
    },
    deleted: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('screens', ScreenSchema);