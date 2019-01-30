const {distance_object} = require('./vehicle-ride');
const {readInputFile, writeOutputFile} = require('./input-output');
const createKDTree = require("static-kdtree");

// const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
const fileName = 'b_should_be_easy.in';

readInputFile(fileName, (response) => {
    let {rides, vehicleCount, bonus, steps} = response;

    let flowRides = rides.map((ride, rideIndex) => ({...ride, rideIndex, flow: 0}));
    const departures = rides.map((ride) => ride.intersections[0]);
    const kdtree = createKDTree(departures);
    flowRides = flowRides.map((flowRide) => {
        const flowArray = [];
        kdtree.rnn(flowRide.intersections[1], 20, (point) => {
                if(point !== undefined) {
                    flowArray.push(point);
                }
                else{
                    flowRide.flow = flowArray.length;
                }
            });
        return flowRide;
    })

    // writeOutputFile(fileName, vehicleRides, originalRides, (writeResult) => {
    //     console.log(writeResult);
    // });
});