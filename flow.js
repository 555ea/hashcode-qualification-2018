const util = require('util');
const { can_start_on_time, can_finish_in_time, assign, wait_time, distance_to_ride_start } = require('./vehicle-ride');
const {readInputFile, writeOutputFile} = require('./input-output');
const createKDTree = require("static-kdtree");
const { minBy, sortBy, flatMap } = require('lodash');

// const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
const fileName = 'b_should_be_easy.in';

const RADIUS = 20;

readInputFile(fileName, (response) => {
    let {rides, vehicleCount, bonus, steps} = response;

    const cars = [...Array(vehicleCount)].map((car, vehicle) => ({vehicle, ride:{intersections:[[], [0,0]]}, step: 0, assigned_rides:[]}));

    let flowRides = rides.map((ride, rideIndex) => ({...ride, rideIndex, flow: 0}));
    const departures = rides.map((ride) => ride.intersections[0]);
    const kdtree = createKDTree(departures);
    flowRides.forEach((flowRide) => {
        const flowArray = [];
        const last = kdtree.rnn(flowRide.intersections[1], RADIUS, (point) => {
            if(point !== undefined) {
                flowArray.push(point);
                flowRide.flow = flowArray.length;
            }
        });
    });
    flowRides = sortBy(flowRides, ['earliestStart', 'flow']);
    flowRides.forEach((flowRide, flowRideIndex) => {
        const candidates = cars.filter((car) => can_finish_in_time(car, flowRide, steps));
        const cars_with_bonus = cars.filter((car) => can_start_on_time(car, flowRide, steps));
        if(cars_with_bonus.length){
            const best_car = minBy(cars_with_bonus, (car) => wait_time(car, flowRide));
            assign(best_car, flowRide);
        } else if (candidates.length) {
            const best_car = minBy(candidates, (car) => distance_to_ride_start(car.ride.intersections[1], flowRide.intersections[0]));
            assign(best_car, flowRide);
        }
    });
    const result = flatMap(cars, (car) => car.assigned_rides);
    writeOutputFile(fileName, result, (writeResult) => {
        console.log(writeResult);
    });
});