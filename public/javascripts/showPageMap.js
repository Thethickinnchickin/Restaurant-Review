    //Obtaining the Map Box token from account
    
    mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHJlaWxleSIsImEiOiJja2xib3ZseHMybmtzMm9wZWNrdTk0OG9kIn0.lb90yBKLnT1OL6tO1bkHog'
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: restaurant.geometry.coordinates,
        zoom: 8
    });

    //Creating map on the show restaurant page

    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker()
    .setLngLat(restaurant.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${restaurant.title}</h3><p>${restaurant.location}</p>`
            )
    )
    .addTo(map)


