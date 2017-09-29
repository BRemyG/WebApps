/**
 * Created by RemyValery on 12/10/2016.
 */
var userLatitude = 41.878114, userLongitude = -87.629798, myCenter;
function showUserLocation(userLoc){
    userLatitude = userLoc.coords.latitude;
    userLongitude = userLoc.coords.longitude;
    myCenter = new google.maps.LatLng(userLatitude, userLongitude);
}
function getUserLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showUserLocation);
    }
};

getUserLocation();

//<!-- Google Map Location -->



function initialize() {
    var mapProp = {
        center: myCenter,
        zoom: 12,
        scrollwheel: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("scoreTradesMap"),mapProp);

    var marker = new google.maps.Marker({
        position: myCenter
    });

    marker.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);

// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
}


// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

//Used to drop dowm a list of options when attached to a button
function dropDownContent(Id){

    var x = document.getElementById(Id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

//used to grab image from singIn index page
function grabImage(){
    var preView = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function(){
        preView.src = reader.result;
    }
    if (file){
        reader.readAsDataURL(file);
    } else {
        preView.src = ""
    }

}