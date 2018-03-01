const {readInputFile} = require('./input-output');
const util = require('util')

readInputFile('a_example.in', (response) => {
    console.log(util.inspect(response, {showHidden: false, depth: null})); // deep print
})