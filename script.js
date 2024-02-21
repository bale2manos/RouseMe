let estoyEnVerde = false;
let estoyEnRojo = false;


// *****************************************************************
// 1. Variables
// *****************************************************************
const trenSpeed = 60; 
const metroSpeed = 25; 
const busSpeed = 20; 
let touchStartX = 0;
let touchEndX = 0;
let awaken = true;
let destination_set = false;
let audioPlaying = false;
let resetCounter = 0;
let destinationMarker; 
let greenArea;
let redArea;
let mymap;
let destination;
let vibrationInterval;
let currentAudio;


showPopup();



function reloadPage() {
  location.reload(); 
}



// *****************************************************************
// 2. Audio
// *****************************************************************

function playSound(soundFile, volume) {
  console.log('NUEVA CANCION');
  const audio = new Audio(soundFile);
  audio.loop= true;
  if (soundFile == './music/hidden-gem.mp3'){
    audio.loop = false;
  }
  audio.volume = volume;
  audio.play();
  audioPlaying = true;
  audio.onended = function() {
    audioPlaying = false;
  };

  currentAudio = audio;
}

function stopSound() {
  if (currentAudio) {
    console.log('silencio');
    currentAudio.pause();
    currentAudio.currentTime = 0; 
    audioPlaying = false;
  }
}


// *****************************************************************
// 3. Three finger swipe listeners
// *****************************************************************


function handleTouchStart(e) {
  if (e.touches.length === 3) {
    touchStartX = e.touches[0].screenX;
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 3) {
    touchEndX = e.touches[0].screenX;
  }
}

function handleTouchEnd() {
  const swipeThreshold = 100; 

  if (touchEndX > touchStartX && touchEndX - touchStartX > swipeThreshold) {
    finishTrip();
    resetDestination();
    document.getElementById('resetButton').style.display = 'none';
    document.getElementById('destination-banner').style.display = 'none';
    document.getElementById('homeButton').style.display = 'none';
    successfulMessage();
    
  }
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

function showSwipeInfo(message){
  Swal.fire({
    icon: 'info',
    title: message,
    position: 'top',
    showConfirmButton: false,
    toast: true,
    background: '#fffff',
  });
}


function successfulMessage() {
  Swal.fire({
    icon: 'success',
    title: '¡Buenos días! Conseguiste despertarte, enhorabuena',
    showConfirmButton: true,
    confirmButtonText: 'OK',
    allowOutsideClick: false, 
  }).then((result) => {
    if (result.isConfirmed) {
      reloadPage();
    }
  });
}


// *****************************************************************
// 4. Auxiliary calculation functions
// *****************************************************************

function setRanges(transportType) {
  switch (transportType) {
    case 'Tren':
      rango1 = calculateDistanceByTime(trenSpeed, 3 * 60); 
      rango2 = calculateDistanceByTime(trenSpeed, 1.5 * 60); 
      break;
    case 'Metro':
      rango1 = calculateDistanceByTime(metroSpeed, 3 * 60);
      rango2 = calculateDistanceByTime(metroSpeed, 1.5 * 60);
      break;
    case 'Bus':
      rango1 = calculateDistanceByTime(busSpeed, 3 * 60);
      rango2 = calculateDistanceByTime(busSpeed, 1.5 * 60);
      break;
    default:
      rango1 = 3000;
      rango2 = 1000;
  }

}

function calculateDistanceByTime(speed, time) {
  const speedMetersPerSecond = speed * (1000 / 3600);
  const distance = speedMetersPerSecond * time;
  return distance;
}


function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}




// *****************************************************************
// 5. Show and close popups
// *****************************************************************


function showAlert(message) {
  Swal.fire({
    icon: 'info',
    title: message,
    position: 'top',
    showConfirmButton: false,
    timer: 2000, 
    toast: true,
    background: '#fffff', 
  });
}



// FIRST POPUP
function showPopup() {
  document.getElementById('overlay').style.display = 'flex';
}

function closePopup(type) {
  const destinationSpan = document.getElementById('destination');
  const destinationText = destinationSpan.textContent.trim();
  
  if (destinationText === 'Destino') {
    showAlert('Selecciona el destino');
    return
    };
   
  
  setRanges(type); 
  document.getElementById('popup-options').style.display = 'none';

  const listItems = document.querySelectorAll('.slide li');
  let selectedLi;

  listItems.forEach(li => {
    if (li.textContent.trim() === destinationText) {
      selectedLi = li;
    }
  });

  const lat = selectedLi.dataset.lat;
  const lon = selectedLi.dataset.lon;

  destination = {
    name: destinationText,
    lat: parseFloat(lat),
    lng: parseFloat(lon),
  };

  showDndPopup();

}

// First popup slider
document.addEventListener('DOMContentLoaded', function () {
  const destinationSpan = document.getElementById('destination');
  const arrowSpan = document.getElementById('arrow');

  document.getElementById('touch').addEventListener('change', function () {
    const content = this.checked ? '▼' : '+';
    arrowSpan.textContent = content;
  });

  const options = document.querySelectorAll('.slide li');
  options.forEach(option => {
    option.addEventListener('click', function () {
      destinationSpan.textContent = option.textContent;
      arrowSpan.textContent = '+';

      document.getElementById('touch').checked = false;
    });
  });

  const initialContent = document.getElementById('touch').checked ? '▼' : '+';
  arrowSpan.textContent = initialContent;
});


// First popup bar
document.addEventListener('DOMContentLoaded', function () {
  const slide = document.querySelector('.slide');
  new SimpleBar(slide, {
    autoHide: false, 
  });

  const destinationTitle = document.querySelector('#location-dropdown span');
  const touchCheckbox = document.getElementById('touch');

  const options = document.querySelectorAll('.slide li');
  options.forEach(option => {
    option.addEventListener('click', function () {
      destinationTitle.textContent = option.textContent;

      touchCheckbox.checked = false;
    });
  });
});


// SECOND POPUP
function showDndPopup() {
  
  Swal.fire({
    icon: 'warning',
    title: 'Desactiva el modo No Molestar, desilencia el dispositivo y activa la vibración',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#7A2E53',
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(() => {
        closeDndPopup();
      }, 200);
    }
  });


  
}

function closeDndPopup() {
  document.getElementById('overlay').style.display = 'none';
  navigator.geolocation.getCurrentPosition(function (position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    initializeMap(userLat, userLng);
  });
  
  const destinationBanner = document.getElementById('destination-banner');
  if (destination.name != 'Selecciona en el mapa'){
    destinationBanner.textContent += destination.name;
    destinationBanner.style.display = 'block';
    }
  
  document.getElementById('resetButton').style.display = 'block';
  document.getElementById('homeButton').style.display = 'block';
  

}


// *****************************************************************
// 6. Check location distance to destination
// *****************************************************************

function vibrateIfCloseToDestination(userLat, userLng, destLat, destLng, threshold1, threshold2) {
  const distance = calculateDistance(userLat, userLng, destLat, destLng);
  console.log(distance);
  if (distance <= threshold2) {
    
    if (!estoyEnRojo){
      estoyEnRojo = true;
      estoyEnVerde=false;
      silenceEverything();
    }
    
    if (!vibrationInterval) {
      vibrationInterval = setInterval(() => {
        navigator.vibrate([800, 100]);
      }, 900);
    }
    if (!audioPlaying) {
      playSound('./music/sound1.mp3', 1);
    }
    showSwipeInfo('Good morning! Swipe with three fingers to the right to mute the app!!');
    return;
    }
 
  if (distance <= threshold1) {
    if (!estoyEnVerde){
      estoyEnRojo = false;
      estoyEnVerde=true;
      silenceEverything();
    }
    if (!vibrationInterval) {
      vibrationInterval = setInterval(() => {
        navigator.vibrate([600, 100]);
      }, 700);
    }
    if (!audioPlaying) {
      playSound('./music/sound.mp3', 0.2);
    }
    showSwipeInfo('¡Buenos días! Arrastra con tres dedos de izquierda a derecha para silenciar la alarma!!')
    return;
  }
    estoyEnVerde=false;
  estoyEnRojo=false;
  stopSound();
  Swal.close();
}


// *****************************************************************
// 7. Map initialization
// *****************************************************************

function initializeMap(userLat, userLng) {
  mymap = L.map('sample_map').setView([userLat, userLng], 15);


  // USER MARKER
  const userMarkerBlur = L.circleMarker([userLat, userLng], {
    radius: 14,
    color: 'transparent',
    fillColor: 'blue',
    fillOpacity: 0.2,
  }).addTo(mymap);

  const userMarkerBlur2 = L.circleMarker([userLat, userLng], {
    radius: 18,
    color: 'transparent',
    fillColor: 'blue',
    fillOpacity: 0.1,
  }).addTo(mymap);

  const userMarker = L.circleMarker([userLat, userLng], {
    radius: 8,
    color: 'white',
    fillColor: 'blue',
    fillOpacity: 1,
  }).addTo(mymap);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 18
  }).addTo(mymap);

  if (destination.name != 'Selecciona en el mapa'){
    console.log(destination);
    updateMarkerPosition(destination);
  }


  // DRAW AREAS
  function drawGreenArea(lat, lng) {
    if (greenArea) {
      mymap.removeLayer(greenArea);
    }
    greenArea = L.circle([lat, lng], {
      radius: rango1,
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.2,
    }).addTo(mymap);
    destination_set = true;
  }

  function drawRedArea(lat, lng) {
    if (redArea) {
      mymap.removeLayer(redArea);
    }
      redArea = L.circle([lat, lng], {
      radius: rango2,
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.2,
    }).addTo(mymap);
    destination_set = true;
  }

  mymap.on('click', function (e) {   
    if (!destination_set){
      updateMarkerPosition(e.latlng);
    }
  });


  function updateMarkerPosition(location){
    console.log(location);
    awaken = false;
    destinationMarker = L.marker(location).addTo(mymap);
    drawGreenArea(location.lat, location.lng);
    drawRedArea(location.lat, location.lng); 

    const destLat = destinationMarker ? destinationMarker.getLatLng().lat : 0;
    const destLng = destinationMarker ? destinationMarker.getLatLng().lng : 0;

    vibrateIfCloseToDestination(userLat, userLng, destLat, destLng, rango1, rango2);
  }


  navigator.geolocation.watchPosition(function (position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    userMarkerBlur.setLatLng([userLat, userLng]);
    userMarkerBlur2.setLatLng([userLat, userLng]);
    userMarker.setLatLng([userLat, userLng]);

    const destLat = destinationMarker ? destinationMarker.getLatLng().lat : 0;
    const destLng = destinationMarker ? destinationMarker.getLatLng().lng : 0;

    if (!awaken){
      vibrateIfCloseToDestination(userLat, userLng, destLat, destLng, rango1, rango2); 
      }
  });
}



// *****************************************************************
// 8. Reset destination and silence the app
// *****************************************************************
function resetDestination() {
  destination_set = false;
  if (greenArea) {
    mymap.removeLayer(greenArea);
  }
  if (redArea){
    mymap.removeLayer(redArea);
  }
  if (destinationMarker) {
    mymap.removeLayer(destinationMarker);
  }
  document.getElementById('destination-banner').style.display = 'none';
  resetCounter += 1;
  finishTrip();
  if (resetCounter >= 33){
    showAlert('¿Te vas a decidir de una maldita vez? Llevas más de 33 intentos');
    if (!audioPlaying){playSound('./music/hidden-gem.mp3', 1)}
  }
}

function silenceEverything() {
  navigator.vibrate(0); 
  if (vibrationInterval) {
    clearInterval(vibrationInterval); 
    vibrationInterval = null;
  }
  stopSound();
  if (resetCounter < 33) {Swal.close();}
}

function finishTrip(){
  silenceEverything();
  awaken = true;
}


