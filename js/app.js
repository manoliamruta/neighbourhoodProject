/* Model Melbourne Neighbourhood Map */
function NeighbourhoodMapModel() {  		

    var map;    
    var markers = [];
    var service;    
    var defaultPlace = "Melbourne";
    var largeInfowindow = new google.maps.InfoWindow();    
    var self=this;
     
    self.locationList = ko.observableArray([]); 
    self.selectedList = ko.observableArray(self.locationList()); 
    self.searchterm = ko.observable('');  
    self.bigScreen = ko.observable(true); 
    self.smallScreen = ko.observable(true); 
    self.screenWidth = ko.observable($(window).width());
    self.displayElem = ko.observable('');    
    
    initMap();  
    /* This function Initializes the map with a customized retro style.*/
    function initMap() {   

	  	var styles = [
		  {
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#ebe3cd"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#523735"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#f5f1e6"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#c9b2a6"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#dcd2be"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#ae9e90"
		      }
		    ]
		  },
		  {
		    "featureType": "landscape.natural",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#93817c"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "geometry.fill",
		    "stylers": [
		      {
		        "color": "#a5b076"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#447530"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#f5f1e6"
		      }
		    ]
		  },
		  {
		    "featureType": "road.arterial",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#fdfcf8"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#f8c967"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#e9bc62"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway.controlled_access",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#e98d58"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway.controlled_access",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#db8555"
		      }
		    ]
		  },
		  {
		    "featureType": "road.local",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#806b63"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#8f7d77"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.line",
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#ebe3cd"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.station",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#dfd2ae"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "geometry.fill",
		    "stylers": [
		      {
		        "color": "#b9d3c2"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#92998d"
		      }
		    ]
		  }
		];
	    var mapOptions = {	      
          zoom: 10,
          styles: styles,
          mapTypeControl: false,
          disableDefaultUI: true
	    };	    
	    map = new google.maps.Map(document.querySelector('#map'), mapOptions);
	    infowindow = new google.maps.InfoWindow();
	    var request = {
      		query: defaultPlace
    	};
    	service = new google.maps.places.PlacesService(map);
    	service.textSearch(request, callback);	    
	}   
	
	/* Callback function for neighborhood location */
  	function callback(results, status) {

    	if (status == google.maps.places.PlacesServiceStatus.OK) {    		
      		getLocationInfo(results[0]);
    	}
  	}
	
	/* This function is used to get the information
		about the nearby places using Foursquare API. */		
	function getLocationInfo(defaultLocation) {
			  	
	    var lat = defaultLocation.geometry.location.lat();
	    var lng = defaultLocation.geometry.location.lng();	    
	    var clientID = 'CXXZLTCGH50UFMJC5OEM3N3PUPFLMMWY0KTYXAPZB15E4ZVK';
	    var clientSecret = 'XBZV30B3H5ZZWDGF5QED4EWXYWY0UEV2X2ILXF2OWAA3USZD';
	    var fqVersion = '20180131';
    	/* Style the markers a bit. This will be our listing marker icon. */
    	var defaultIcon = makeMarkerIcon('ff4500');
    	
    	preferredLocation = new google.maps.LatLng(lat, lng);    	
    	map.setCenter(preferredLocation);
    	    	
    	foursquareQuery = 'https://api.foursquare.com/v2/venues/explore' + '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=' + fqVersion + '&ll=' + lat + ',' + lng + '&limit=15&venuePhotos=1';
    
    	console.log(foursquareQuery);
	    /* AJAX call to the foursquare api to get the nearby places details. */
	    $.getJSON(foursquareQuery, function(data) {
	      self.displayElem("Places nearby");
	      self.locationList(data.response.groups[0].items);
	      for (var i=0; i < self.locationList().length ; i++) {
	      	var markerPos = self.locationList()[i].venue;      	      	
	      	var marker = new google.maps.Marker({
	      		map: map,
	      		position: markerPos.location,
	      		title: markerPos.name,
	      		icon: defaultIcon,
	      		animation: google.maps.Animation.DROP
	    	});       	
	    	makeMarker(marker);
	      	markers.push(marker);        
	      }
	      /* Change the map zoom level by suggested bounds*/
	      var bounds = data.response.suggestedBounds;
	      if (bounds !== undefined) {
	        var mapBounds = new google.maps.LatLngBounds(
	          new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
	          new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng));
	        map.fitBounds(mapBounds);
	      }
	    }).error(function (e){    	
	        self.displayElem("Sorry !!! Failed to load neighbourhood information");
	    });     
  	}

  	function toggleBounce(marker) {  		  		
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }        
      }

  	function makeMarker(marker)
  	{
  		/* Style the markers a bit. This will be our listing marker icon. */
    	var defaultIcon = makeMarkerIcon('ff4500');
    	
  		// Create an onclick event to open the large infowindow at each marker.
		marker.addListener('click', function() {
			for (i=0; i < markers.length;i++) {
				markers[i].setAnimation(null);
			}
			toggleBounce(this);
		    populateInfoWindow(this, largeInfowindow);
		});			
  	}
    
  	/** This function populates the infowindow when the marker is clicked. We'll only allow
       one infowindow which will open at the marker that is clicked, and populate based
       on that markers position.*/
    function populateInfoWindow(marker, infowindow) {    	
        /* Check to make sure the infowindow is not already opened on this marker. */
        if (infowindow.marker != marker) {
          	/* Clear the infowindow content to give the streetview time to load. */          	
          	infowindow.setContent('');
          	infowindow.marker = marker;          	
          	/* Make sure the marker property is cleared if the infowindow is closed. */
          	infowindow.addListener('closeclick', function() {
          		marker.setAnimation(null);
            	infowindow.marker = null;
          	});
          	var streetViewService = new google.maps.StreetViewService();
          	var radius = 50;
          	var getStreetView = function(){};
          	/* In case the status is OK, which means the pano was found, compute the
          	 position of the streetview image, then calculate the heading, then get a
          	 panorama from that and set the options. */
          	getStreetView = function (data, status) {
	            if (status === google.maps.StreetViewStatus.OK) {
	              var nearStreetViewLocation = data.location.latLng;
	              var heading = google.maps.geometry.spherical.computeHeading(
	                nearStreetViewLocation, marker.position);         
	                var view = '<div>' + marker.title + '</div><div id="pano"></div>';
	                var keyword = marker.title;
	                var place;
	                var workingHours = '';
	                var phone = '';
	                var url = '';                
	                for (var i=0; i < self.locationList().length ; i++) {      
	      				place = self.locationList()[i].venue.name;
	      				if (place.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
	       					if( self.locationList()[i].venue.hours !== null)				
	       						if( self.locationList()[i].venue.hours.status !== undefined)
	       							workingHours = self.locationList()[i].venue.hours.status;
	       					if( self.locationList()[i].venue.contact !== null)
	       						if( self.locationList()[i].venue.contact.formattedPhone !== undefined)
	       							phone = self.locationList()[i].venue.contact.formattedPhone;
	       					if( self.locationList()[i].venue.url !== null)
	       						if( self.locationList()[i].venue.url !== undefined)
	       							url = self.locationList()[i].venue.url;
	      				}
	    			}
	    			var info = '<div><p>' + workingHours + '</p>' + '<p>' + phone + '</p>' + '<p>' + url + '</p></div>'; 
	                infowindow.setContent(view + info);
	                var panoramaOptions = {
	                  position: nearStreetViewLocation,
	                  pov: {
	                    heading: heading,
	                    pitch: 30
	                  }
	                };
	              var panorama = new google.maps.StreetViewPanorama(
	                document.getElementById('pano'), panoramaOptions);
            	} else {
              		infowindow.setContent('<div>' + marker.title + '</div>' +
                	'<div>No Street View Found</div>');
            	}
          	};
          	/* Use streetview service to get the closest streetview image within
          	 50 meters of the markers position */
          	streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          	/* Open the infowindow on the correct marker.*/
          	infowindow.open(map, marker);
        }
    }

    /* This function takes in a COLOR, and then creates a new marker
    icon of that color. The icon will be 21 px wide by 34 high, have an origin
    of 0, 0 and be anchored at 10, 34).*/
    function makeMarkerIcon(markerColor) {

        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
    }
    
    /* Function to trigger the list item clicked event */
  	self.clicked = function(venue) {

    	var venueName = venue.venue.name.toLowerCase();    
    	for (var i=0; i < markers.length; i++) {    	
      		if (markers[i].title.toLowerCase() === venueName) {  
      			google.maps.event.trigger(markers[i].marker, 'click');
        		map.panTo(markers[i].position);      
        		populateInfoWindow(markers[i], largeInfowindow);
        		markers[i].setAnimation(google.maps.Animation.BOUNCE);
      		}
    	}
  	}; 
  	
  	/* Function to populate the searched list */
  	self.displayLocations = ko.computed(function() {

	    var venue;
	    var list = [];
	    var keyword = self.searchterm().toLowerCase();
	    for (var i=0; i < self.locationList().length; i++) {
      		venue = self.locationList()[i].venue.name;      
      		if (venue.toLowerCase().indexOf(keyword) !== -1) {      	
        		list.push(self.locationList()[i]);        
      		}
    	}
    	self.selectedList(list);
  	});
  
  	/* Function to show the markers of the searched list on the map */
  	self.showMarkers = ko.computed(function() {  
  		var keyword = self.searchterm().toLowerCase();
  		for (var i=0; i < markers.length; i++) {  	  
	      	if (markers[i].title.toLowerCase().indexOf(keyword) !== -1)	      	
		      	markers[i].setMap(map);        	      	
	      	else
	      	   	markers[i].setMap(null);	      	
    	}		    
  	});
  	
	/* Re-center the map on resize */
  	window.addEventListener('resize', function(e) {	   		

  		var geocoder = new google.maps.Geocoder();  		  		
  		$("#map").height($(window).height());
    	$("#map").width($(window).width());
	    self.screenWidth($(window).width());
	    geocoder.geocode( {'address' : defaultPlace}, function(results, status) {
   			if (status == google.maps.GeocoderStatus.OK) {
        		map.setCenter(results[0].geometry.location);
    		}
		});	    
  	});
  	
  	/* Hide the list view when the viewport size is small */
  	self.bigScreenToggle = ko.computed(function() {  	

  		if (self.screenWidth() <= 700) 
      		self.bigScreen(false);
      	else
      		self.bigScreen(true);
  	});
  	/* Show the list view at different location when the viewport size is small */
  	self.smallScreenToggle = ko.computed(function() {  	

  		if (self.screenWidth() <= 700)   		
      		self.smallScreen(true);      		      	
      	else
      		self.smallScreen(false);
  });
}

function unhide(divID) {
    var item = document.getElementById(divID);
    if (item) {
      item.className=(item.className=='hidden')?'unhidden':'hidden';
    }
}

var isMapsApiLoaded = false;
window.mapsCallback = function () {
	unhide('app');
  	isMapsApiLoaded = true;
  	/* Initialize the binding for the Knockout variables*/
  	$(function() {  
	  	ko.applyBindings(new NeighbourhoodMapModel());
  	});
};

function loadError(){		
	unhide('error');
	console.log("error occurred");  	
}

