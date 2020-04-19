const mongoose = require('mongoose');
var playerSchema = require('./database/Mongo/player');

playerSchema.statics={
    create: function (data, cb) {
        var player = new this(data);
        player.save(cb)
    }
}

var playerModel = mongoose.model('Player', playerSchema);
module.exports = playerModel;