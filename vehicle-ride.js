const { max } = require('lodash');

// vehicleRide = {
//  ride:{}
//  step: number
// }

 const distance_to_ride_start = (start, end) =>
    Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);

 const distance_object = (start, end) =>
    Math.abs(start.x - end.x) + Math.abs(start.y - end.y);

 const wait_time = (vehicleRide, ride) =>
    Math.max(0, ride.earliestStart - (vehicleRide.step + distance_to_ride_start(vehicleRide.ride.intersections[1], ride.intersections[0])));

 const arrival = (vehicleRide, ride) =>
    vehicleRide.step
    + distance_to_ride_start(vehicleRide.ride.intersections[1], ride.intersections[0])
    + wait_time(vehicleRide, ride)
    + distance_to_ride_start(ride.intersections[0], ride.intersections[1]);

 const can_start_on_time = (vehicleRide, ride) =>
    vehicleRide.step + distance_to_ride_start(vehicleRide.ride.intersections[1], ride.intersections[0]) <= ride.earliestStart;

 const can_finish_in_time = (vehicleRide, ride, steps) =>
    !!arrival(vehicleRide, ride) <= Math.min(ride.latestFinish, steps);

 const assign = (vehicleRide, ride) => {
    vehicleRide.assigned_rides.push({...ride, vehicle: vehicleRide.vehicle});
    const step_departure = Math.max(ride.earliestStart, vehicleRide.step + distance_to_ride_start(vehicleRide.ride.intersections[1], ride.intersections[0]))
    vehicleRide.step = step_departure + distance_to_ride_start(ride.intersections[0], ride.intersections[1])
    vehicleRide.ride = ride;
};

module.exports = {distance_object, can_start_on_time, can_finish_in_time, assign, wait_time, distance_to_ride_start};
