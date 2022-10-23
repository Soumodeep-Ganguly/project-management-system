var mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateKolkata = moment.tz(Date.now(), process.env.TZ);

var ProjectSchema = mongoose.Schema({
    requirements: {
        type: String,
        default: ''
    },
    start_date: {
        type: Date,
        default: dateKolkata
    },
    end_date: {
        type: Date,
        default: dateKolkata
    },
    documents: [{
        type: String,
        default: ''
    }],
    members: [{
        type: Schema.Types.ObjectId, 
        ref: 'users', 
        default: null
    }],
    technologies: [{
        type: Schema.Types.ObjectId, 
        ref: 'technologies', 
        default: null
    }],
    added_by: {
        type: Schema.Types.ObjectId, 
        ref: 'users', 
        default: null
    },
    created_date: {
        type: Date,
        default: dateKolkata
    },
    updated_date: {
        type: Date,
        default: dateKolkata
    },
    deleted: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('projects', ProjectSchema);