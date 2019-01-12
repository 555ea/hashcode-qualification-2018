const {readInputFile, writeOutputFile} = require('./input-output');
const util = require('util');

// const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
const fileName = 'e_high_bonus.in';

readInputFile(fileName, (response) => {
    const {rides, vehicleCount} = response;
    const originalRides = rides.slice();
    const results = getFirstRides(rides, vehicleCount);
    const vehicleRides = [];
    let vehicleIndex = 0;
    results.forEach((result) => {
        const key = Object.keys(result)[0];
        result[key].forEach((ride) => {
            if(vehicleRides.length < vehicleCount) {
                vehicleRides.push({vehicle: vehicleIndex++, ride})
            }
        });
    });
    let vehicleRideIndex = 0;
    while(vehicleRides.length !== originalRides.length){
        const vehicleRide = vehicleRides[vehicleRideIndex++];
        const nextRide = getNextRide(vehicleRide, rides);
        vehicleRides.push(nextRide);
    }
    writeOutputFile(fileName, vehicleRides, originalRides, (writeResult) => {
        console.log(writeResult);
    });
});

function print(arg) {
    console.log(util.inspect(arg, {showHidden: false, depth: null})); // deep print
}

function getDistance(distanceArray){
    let start = distanceArray[0];
    let end =  distanceArray[1];
    return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])
}


function getRideWeigth(ride){
    let distance = getDistance([ride.intersection[0], ride.intersection[1]]);
    let totalDistance;
    if(distance > ride.earliestStart){
        totalDistance = distance
    }
    else{
        totalDistance = (ride.earliestStart - distance) + distance
    }
}

function getSoonestRide(rides) {
    rides.forEach((ride) => {
        const steps = getDistance(ride.intersections[0], ride.intersections[0], ride);
    })
}

function getInitialRideWeigth(ride){
    let distance = getDistance([[0, 0], ride.intersections[0]]);
    if(distance > ride.earliestStart){
        return distance
    }
    else{
        return (ride.earliestStart - distance) + distance
    }
}

function getFirstRides(rides, carsCount) {
    let onDeleteIndexes = []
    let weightedRides = rides.reduce((result, ride, rideIndex) => {
        result[getInitialRideWeigth(ride)] = result[getInitialRideWeigth(ride)] || [];
        result[getInitialRideWeigth(ride)].push(ride);
        onDeleteIndexes.push(rideIndex);
        return result
    }, {});
    let weights = Object.keys(weightedRides);
    let sortedWeights = weights.sort().slice(0, carsCount); // remove slice
    onDeleteIndexes.forEach((onDeleteIndex) => {
        rides.splice(onDeleteIndex, 1)
    });
    return sortedWeights.map((weight) => {
        let obj = {};
        obj[weight] = weightedRides[weight]
        return obj
    });
}

function getNextRide(vehicleRide, rides){
    let onDeleteIndexes = [];
    let weightedRides = rides.reduce((result, ride, rideIndex) => {
        result[getSimpleRideWeight(vehicleRide.ride.intersections[1], ride)] = ride;
        onDeleteIndexes.push(rideIndex);
        return result
    }, {})
    let weights = Object.keys(weightedRides);
    let neededWeigtedRide = weightedRides[weights.sort().slice(0, 1)[0]]
    let onDeleteIndex = rides.indexOf(neededWeigtedRide)
    rides.splice(onDeleteIndex, 1)
    return {vehicle: vehicleRide.vehicle,
        ride: neededWeigtedRide}
}

function getSimpleRideWeight(startCoordinates, ride){
    let distance = getDistance([startCoordinates, ride.intersections[0]])
    if(distance > ride.earliestStart){
        return distance
    }
    else{
        return (ride.earliestStart - distance) + distance
    }
}