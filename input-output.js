const fs = require('fs'),
    path = require('path');

function readInputFile(name, callback) {
    fs.readFile(`./files/input/${name}`, 'utf8', function (err, data) {
        const fileRows = data.toString().split('\n');
        const file = {
            rows: 0,
            columns: 0,
            vehicleCount: 0,
            ridesCount: 0,
            bonus: 0,
            steps: 0,
            rides: [] //{intersections: [[0, 0], [1, 1]], earliestStart: 0, latestFinish: 0}
        };
        fileRows.forEach((row, index) => {
            if(row.length > 0) {
                const cells = row.split(' ').map((cell) => parseInt(cell));
                if (index === 0) {
                    const [rows, columns, vehicleCount, ridesCount, bonus, steps] = cells;
                    Object.assign(file, {rows, columns, vehicleCount, ridesCount, bonus, steps});
                } else {
                    const [a, b, x, y, earliestStart, latestFinish] = cells;
                    file.rides.push({intersections: [[a, b], [x, y]], earliestStart, latestFinish});
                }
            }
        });
        callback(file);
    });
}

function writeOutputFile(name, vehicleRides, rides, callback) {
    const vehicleRideIndexArrays = [];
    vehicleRides.forEach((vehicleRide) => {
        vehicleRideIndexArrays[vehicleRide.vehicle] = vehicleRideIndexArrays[vehicleRide.vehicle] || [];
        vehicleRideIndexArrays[vehicleRide.vehicle].push(rides.indexOf(vehicleRide.ride));
    });
    let resultString = '';
    vehicleRideIndexArrays.map((vehicleRideIndexArray, vehicleIndex) => {
        resultString += `${vehicleRideIndexArray.length} ${vehicleRideIndexArray.join(' ')}\n`
    })
    fs.writeFile(`./files/output/${name}`, resultString, function (err, data) {
        callback('success!');
    });
}



module.exports = {readInputFile, writeOutputFile};



