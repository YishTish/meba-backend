const mongoose = require("mongoose");

const member = new mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    phoneId: String,
    identifier: String
});

const event = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    date: {type: Date, default: new Date()},
    invitees: Array
});

module.exports = {
    member,
    event
};