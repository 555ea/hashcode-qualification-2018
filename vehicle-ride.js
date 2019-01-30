const { max } = require('lodash');

// vehicleRide = {
//  ride:{}
//  step: number
// }

export const distance_to_ride_start = (start, end) =>
    Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);

export const wait_time = (vehicleRide, ride) =>
    max(0, ride.earliestStart - (vehicleRide.step + distance_to_ride_start(vehicleRide.ride.intersections[1], ride.intersections[0])));

export const arrival = (vehicleRide, ride) =>
    vehicleRide.step
    + distance_to_ride_start(vehicleRide.ride.intersections[1], ride.intersections[0])
    + wait_time(vehicleRide, ride)
    + distance_to_ride_start(ride.intersections[0], ride.intersections[1]);

export const can_start_on_time = (vehicleRide, ride) =>
    vehicleRide.step + distance_to_ride_start(vehicleRide, ride) <= ride.step_min
