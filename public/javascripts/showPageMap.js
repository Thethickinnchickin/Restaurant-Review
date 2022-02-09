    //Obtaining the Map Box token from account
    
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN
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


