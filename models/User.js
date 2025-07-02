const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
        email: {type: String, unique: true},
        username: {type: String, unique: false},
        password: String,
        salt: String
});

UserSchema.plugin(passportLocalMongoose,{
        usernameField: 'email',
        hashField: 'password'
});

module.exports = mongoose.model('User', UserSchema);