let map;
let marker;

async function initMap() {
  try {
    const response = await fetch('/api/maps-key');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const apiKey = data.key;
    if (!apiKey) {
      throw new Error('No API key returned from server.');
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=loadMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error during map initialization:', error);
  }
}

// This is the callback function that initializes the map
// It should not be async and should not have any awaits.
function loadMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.794629, lng: -117.850284},
    zoom: 17.5,
  });

  // Create the initial marker when the map is first loaded
  updateMarker();

  // Call updateMarker every minute
  setInterval(updateMarker, 60000);

  // fetch('/api/coordinates')
  // .then(response => response.text())
  // .then(data => {
  //   const [lat, lng] = data.trim().split(',').map(Number);
  //   const position = { lat, lng };

  //   new google.maps.Marker({
  //     position: position,
  //     map: map,
  //     icon: {
  //       url: 'assets/corgi.svg',
  //       scaledSize: new google.maps.Size(50, 50)
  //     },
  //     title: 'Corgi Location'
  //   });

  // })
  // .catch(error => console.error('Error fetching coordinates:', error));
}

function updateMarker() {
  fetch('/api/coordinates')
    .then(response => response.text())
    .then(data => {
      const [lat, lng] = data.trim().split(',').map(Number);
      const position = { lat, lng };

      // Check if marker exists
      if (marker) {
        // Update marker position
        marker.setPosition(position);
      } else {
        // Create a new marker if it doesn't exist
        marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: {
            url: 'assets/corgi.svg',
            scaledSize: new google.maps.Size(50, 50)
          },
          title: 'Corgi Location'
        });
      }

      // Update map center to the new position
      map.setCenter(position);
    })
    .catch(error => console.error('Error fetching coordinates:', error));
}

// Make the loadMap function available globally
window.loadMap = loadMap;

// Make the initMap function available globally
window.initMap = initMap;