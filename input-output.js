const fs = require('fs'),
    path = require('path');

function readInputFile(name, callback) {
    fs.readFile(`./files/input/${name}`, 'utf8', function (err, data) {
        const fileRows = data.toString().split('\n');
        const file = {
            rows: 0,
            columns: 0,
            vehicles: 0,
            ridesCount: 0,
            bonus: 0,
            steps: 0,
            rides: [] //{intersections: [[0, 0], [1, 1]], earliestStart: 0, latestFinish: 0}
        };
        fileRows.forEach((row, index) => {
            if(row.length > 0) {
                const cells = row.split(' ').map((cell) => parseInt(cell));
                if (index === 0) {
                    const [rows, columns, vehicles, ridesCount, bonus, steps] = cells;
                    Object.assign(file, {rows, columns, vehicles, ridesCount, bonus, steps});
                } else {
                    const [a, b, x, y, earliestStart, latestFinish] = cells;
                    file.rides.push({intersections: [[a, b], [x, y]], earliestStart, latestFinish});
                }
            }
        });
        callback(file);
    });
}

module.exports = {readInputFile};



