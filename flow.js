const {readInputFile, writeOutputFile} = require('./input-output');

// const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
const fileName = 'b_should_be_easy.in';

readInputFile(fileName, (response) => {
    let {rides, vehicleCount, bonus, steps} = response;

    // writeOutputFile(fileName, vehicleRides, originalRides, (writeResult) => {
    //     console.log(writeResult);
    // });
});