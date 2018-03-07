/**
 * @version         v1.0.0              {Build}.{Update}.{Bugfixes}
 * @author          Richard Mauritz     Ask me if questions or improvements ;
 */
(function () {
    'use strict';

    angular.module("GoogleMaps", [])

    .factory("GoogleMaps", function ($rootScope, $http, $injector, $compile, $location, $timeout, $q, $templateCache) {
        /**
         * The constructor
         */
        var GoogleMaps = {
            /**
             * Create map function
             *
             * @param {object}  settings    - MapOptions object specification. See: https://developers.google.com/maps/documentation/javascript/reference
             * @param {object}  markers     - Object with markers containing latitude and longitude values
             * @param {integer} zoom        - Zoom level between 0 and 22
             * @param {boolean} center      - If set to false, the map will set auto focus on one marker. When zooming out the other markers are then visible
             * @param {integer} focusOn     - Specify which address you want to zoom at. To use this, you have to set center to false For example: 
             *                                If you have 3 addresses you can focus on either address 0, 1 or 2.
             * @param {integer} elem        - Directive element
             */
            createMap: function (settings, markers, zoom, center, focusOn, elem) {

                /**
                 * Set an unique ID selector
                 */
                var uid = Math.random().toString(36).substr(2, 9);
                /**
                 * Set the uid as ID on the element
                 */
                elem.attr("id", uid);
                
                /**
                 * Prevent API throwing an error: 'InvalidValueError: setClickableIcons: not a boolean'
                 */
                settings["clickableIcons"] = false
                
                /**
                 * Create the map
                 */
                var map = new google.maps.Map(document.getElementById(uid), settings),
                    infowindow = new google.maps.InfoWindow(),
                    bounds = new google.maps.LatLngBounds();

                /**
                 * Set markers
                 */
                for (var i in markers) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
                        map: map
                    });                    
                    
                    if (markers.length > 1 && center) {
                        bounds.extend(marker.position);
                        map.fitBounds(bounds);
                    } else {
                        map.setCenter(markers[focusOn]);
                        map.setZoom(zoom);
                    }
                }
            },
            /**
             * Gets the coordinates from a given address using the google API
             *
             * @param   {address}   - Full address, Eg. 1600 Amphitheatre Parkway Mountain View CA 94043 USA
             * @returns {string}    - Returns coordinates as string, Eg. 37.4224764 -122.0842499
             */
            addressToCoordinates: function (address) {
                /**
                 * Get coordinates data through google API
                 */
                var promise = $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyDYrkvFvaOOB1bLLS40mTwHG2B5_G4t-c0").then(function (response) {
                    /**
                     * Push latitude and longitude to locations array
                     */
                    return response.data.results[0].geometry.location.lat + " " + response.data.results[0].geometry.location.lng;
                });

                return promise;
            },
            /**
             * Returns an object with coordinates
             *
             * @param   {string}    - String with marker(s), Eg. "37.4224764 -122.0842499;Dalwagenseweg 60a Opheusden Nederland;Puerto Williams Chili"
             * @returns {object}    - Returns an object with coordinates, Eg. {"37.4224764 -122.0842499", "37.4224764 -122.0842499", "51.9277423 5.6366264"}
             */
            setCoordinates: function(markers) {
                var deferred = $q.defer(), // This is the correct way to setup an AngularJS promise
                    markers = markers.split(";"), // Multiple markers can be seperated by ; symbol
                    locations = new Array(); // Markers coordinated will be pushed inside this array

                for (var i = 0; i < markers.length; i++) {
                    
                    if (new RegExp(/^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/).exec(markers[i])) {

                        locations.push(markers[i]);

                    } else {

                        var getCoordinates = GoogleMaps.addressToCoordinates(markers[i]).then(function (coordinates) {
                            locations.push(coordinates);
                        });

                    }
                }

                if (typeof getCoordinates === "object") {

                    getCoordinates.then(function (response) {
                        deferred.resolve(locations);
                    });

                } else {

                    deferred.resolve(locations);

                }

                return deferred.promise;
            }
        }

        /**
         * Return the constructor
         */
        return GoogleMaps;

    })

    .directive("googleMaps", function ($http, $q, GoogleMaps) {
        return {
            restrict: "E",
            scope: {
                markers: "@",
                center: "@",
                focusOn: "@",
                backgroundColor: "@",
                clickableIcons: "@",
                disableDefaultUI: "@",
                disableDoubleClickZoom: "@",
                draggingCursor: "@",
                fullscreenControl: "@",
                fullscreenControlOptions: "@",
                gestureHandling: "@",
                heading: "@",
                keyboardShortcuts: "@",
                mapTypeControl: "@",
                mapTypeControlOptions: "@",
                mapTypeId: "@",
                maxZoom: "@",
                minZoom: "@",
                noClear: "@",
                rotateControl: "@",
                scaleControl: "@",
                scaleControlOptions: "@",
                streetView: "@",
                streetViewControl: "@",
                streetViewControlOptions: "@",
                styles: "@",
                tilt: "@",
                zoom: "@",
                zoomControl: "@",
                zoomControlOptions: "@",
            },
            link: function (scope, elem, attrs) {
                console.log(scope);
              
                /**
                 * Check if multiple markers are set
                 */
                if (scope.markers) {
                    /**
                     * End result of this array will be something like {lat: 32.0348982, lgn: -122.453435}, {lat: 25.2432342, lgn: -140.454357}
                     */
                    var markers = [];

                    /**
                     * List of settings which can be used as options inside the google.maps.Map() function
                     */
                    var settings = {
                        backgroundColor: scope.backgroundColor,
                        clickableIcons: scope.clickableIcons,
                        disableDefaultUI: scope.disableDefaultUI,
                        disableDoubleClickZoom: scope.disableDoubleClickZoom,
                        draggingCursor: scope.draggingCursor,
                        fullscreenControl: scope.fullscreenControl,
                        fullscreenControlOptions: scope.fullscreenControlOptions,
                        gestureHandling: scope.gestureHandling,
                        heading: scope.heading,
                        keyboardShortcuts: scope.keyboardShortcuts,
                        mapTypeControl: scope.mapTypeControl,
                        mapTypeControlOptions: scope.mapTypeControlOptions,
                        mapTypeId: scope.mapTypeId,
                        maxZoom: scope.maxZoom,
                        minZoom: scope.minZoom,
                        noClear: scope.noClear,
                        rotateControl: scope.rotateControl,
                        scaleControl: scope.scaleControl,
                        scaleControlOptions: scope.scaleControlOptions,
                        streetView: scope.streetView,
                        streetViewControl: scope.streetViewControl,
                        streetViewControlOptions: scope.streetViewControlOptions,
                        styles: scope.styles,
                        tilt: scope.tilt,
                        zoomControl: scope.zoomControl,
                        zoomControlOptions: scope.zoomControlOptions,
                    }

                    /**
                     * Set the coordinates
                     */
                    GoogleMaps.setCoordinates(scope.markers).then(function (coordinates) {
                        /**
                         * Push coordinates to markers array
                         */
                        for (let i in coordinates) {
                            var coordinate = coordinates[i].split(" ");
                                markers.push({ lat: Number(coordinate[0]), lng: Number(coordinate[1]) });
                        }

                        /**
                         * Set data which is necessary for the GoogleMaps.createMap() function
                         */
                        var zoom = (attrs.zoom ? Number(attrs.zoom) : 8);
                        var center = (attrs.center == "false" ? false : true);
                        var focusOn = (attrs.focusOn ? Number(attrs.focusOn) : 0);

                        /**
                         * Create the map
                         */
                        GoogleMaps.createMap(settings, markers, zoom, center, focusOn, elem);
                    });
                }
            }
        }
    })
})();
