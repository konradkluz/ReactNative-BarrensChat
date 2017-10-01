import BackgroundGeolocation from "react-native-background-geolocation";


BackgroundGeolocation.configure({
    // Geolocation Config
    disableElasticity: false,
    desiredAccuracy: 0,
    stationaryRadius: 25,
    distanceFilter: 15,
    // Applilcation config
    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
    startOnBoot: false,        // <-- Auto start tracking when device is powered-up.


    locationAuthorizationAlert: {
        titleWhenNotEnabled: "Location-services are not enabled",
        titleWhenOff: "Location-services are OFF",
        instructions: "Enable 'Always' in location-services",
        cancelButton: "Cancel",
        settingsButton: "Settings"
    },
});


BackgroundGeolocation.getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        BackgroundGeolocation.getCurrentPosition(
            position => resolve(position),
            err => reject(err)
        )
    })
};


export default BackgroundGeolocation;


