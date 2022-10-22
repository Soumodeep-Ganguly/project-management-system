var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKolkata = moment.tz(Date.now(), process.env.TZ);

var UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    employee_code: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    otp: {
        type: String,
        default: ''
    },
    user_type: {
        type: String,
        default: 'admin'
    },
    assign_level: {
        type: Number,
        default: 0
    },
    permissions: {
        user_management: { type: Boolean, default: false },
        message_management: { type: Boolean, default: false },
        report_management: { type: Boolean, default: false },
        meta_data_management: { type: Boolean, default: false },
    },
    location: {
        country: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'countries',
            default: null
        }],
        state: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'states',
            default: null
        }],
        city: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cities',
            default: null
        }],
        building: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'buildings',
            default: null
        }],
        floor: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'floors',
            default: null
        }],
        screen: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'screens',
            default: null
        }],
    },
    created_date: {
        type: Date,
        default: dateKolkata
    },
    updated_date: {
        type: Date,
        default: dateKolkata
    },
    profile_image: {
        type: String,
        default: null
    },
    active: {
        type: Number,
        default: 1
    },
    blocked: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('users', UserSchema);