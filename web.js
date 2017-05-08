var logger = winston = require('winston');
var express = require('express');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {colorize: true});

var app = express();
app.use(express.static(__dirname + '/app/scripts'));
app.use(function(req, res) {
    logger.warn('unknown endpoint: ' + req.originalUrl);
    res.status(404).end();
});

var server = app.listen(process.env.PORT || 4567, function () {
    logger.info('opsonatus up & running on port %d!', server.address().port);
});