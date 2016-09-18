const cli = require('./../src/cli'),
    order = require('./order'),
    process = require('process');

// type node test drink mocha --temperature cold
cli(order, '0.0.1', process.argv);
