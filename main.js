const {readInputFile, writeOutputFile} = require('./input-output');
const util = require('util');

// const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
const fileName = 'b_should_be_easy.in';

readInputFile(fileName, (response) => {
    let {rides, vehicleCount} = response;
    const originalRides = rides.slice();
    const {firstRides, rides: ridesWithoutFirstOnes} = getFirstRides(rides, vehicleCount);
    rides = ridesWithoutFirstOnes;
    let vehicleIndex = 0;
    const vehicleRides = firstRides.map(({weight, ride}) => {
        return {vehicle: vehicleIndex++, ride, weight, step: weight};
    });
    let vehicleRideIndex = 0;
    while (vehicleRides.length !== originalRides.length) {
        let vehicleRide = vehicleRides[vehicleRideIndex++];
        const result = getNextRide(vehicleRide, rides);
        const nextRide = result.vehicleRide;
        rides = result.rides;
        vehicleRides.push(nextRide);
    }
    writeOutputFile(fileName, vehicleRides, originalRides, (writeResult) => {
        console.log(writeResult);
    });
});

function print(arg) {
    console.log(util.inspect(arg, {showHidden: false, depth: null})); // deep print
}

function getDistance(distanceArray) {
    let start = distanceArray[0];
    let end = distanceArray[1];
    return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])
}


function getRideWeigth(ride) {
    let distance = getDistance([ride.intersection[0], ride.intersection[1]]);
    let totalDistance;
    if (distance > ride.earliestStart) {
        totalDistance = distance
    }
    else {
        totalDistance = (ride.earliestStart - distance) + distance
    }
}

function getSoonestRide(rides) {
    rides.forEach((ride) => {
        const steps = getDistance(ride.intersections[0], ride.intersections[0], ride);
    })
}

function getFirstRides(rides, carsCount) {
    let onDeleteIndexes = [];
    let weightedRides = rides.reduce((result, ride, rideIndex) => {
        const initialRideWeight = getInitialRideWeigth(ride);
        result[initialRideWeight] = result[initialRideWeight] || [];
        result[initialRideWeight].push(ride);
        return result
    }, {});
    let weights = Object.keys(weightedRides);
    let sortedWeights = weights.sort();
    const firstRides = [];
    sortedWeights.forEach((weight) => {
        weightedRides[weight].forEach((ride) => {
            if (firstRides.length !== carsCount) {
                const originalRideIndex = rides.indexOf(ride);
                firstRides.push({weight, ride, originalRideIndex});
                onDeleteIndexes.push(originalRideIndex);
            }
        })
    });
    rides = rides.filter((ride, rideIndex) => !onDeleteIndexes.includes(rideIndex));
    return {firstRides, rides};
}

function getNextRide(vehicleRide, rides) {
    let weightedRides = rides.reduce((result, ride, rideIndex) => {
        const calculatedWeight = getSimpleRideWeight(vehicleRide.ride.intersections[1], ride, vehicleRide.step);
        result[calculatedWeight] = result[calculatedWeight] || [];
        result[calculatedWeight].push(ride);
        return result
    }, {});
    let weights = Object.keys(weightedRides);
    const weight = weights.sort().slice(0, 1)[0];
    let neededWeigtedRide = weightedRides[weight][0] //TODO: get not first
    rides = rides.filter((ride, rideIndex) => rideIndex !== rides.indexOf(neededWeigtedRide));
    return {
        vehicleRide: {
            vehicle: vehicleRide.vehicle,
            ride: neededWeigtedRide,
            weight,
            step: vehicleRide.step + weight
        }, rides
    }
}

function getInitialRideWeigth(ride) {
    //TODO: step = earliest start + distance
    let distance = getDistance([[0, 0], ride.intersections[0]]);
    const max = Math.max(ride.earliestStart, distance);
    return max;
}

function getSimpleRideWeight(startCoordinates, ride, step) {
    //TODO: use currennm  t step (weight)
    let distance = getDistance([startCoordinates, ride.intersections[0]])
    // if (distance > (ride.earliestStart - step)) {
    //     return distance
    // }
    // else {
    //     return (ride.earliestStart - step) + distance
    // }
    const max = Math.max((ride.earliestStart - step), distance);
    return max;
}