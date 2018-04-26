const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String },
    email: { type: String, required: true},
    password: { type: String, required: true },
    admin: Boolean,
    token: String,
    created_at: { type: Date, default: Date.now}
});

userSchema.pre('save', function(next) {
    let user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    let user = this;
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        if (err) cb(err);
        cb(null, isMatch);
    })
};

const user = mongoose.model('User', userSchema);
module.exports = user;
