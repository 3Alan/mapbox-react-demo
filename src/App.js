import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Select } from 'antd';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWxhbndhbmczIiwiYSI6ImNrdXV4dDd0ZjFraG8ydXBqZ2J1OWRwcHUifQ.5NvSu2AbiWynx-7B8TSZQw';

const { Option } = Select;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(144.943835);
  const [lat, setLat] = useState(-37.81656882);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/alanwang3/ckuv1ryyabym517mlgsks0n51',
      center: [lng, lat],
      zoom: zoom
    });
    console.log(mapboxgl);

    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
  });

  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;
    // mapInstance.on('mousemove', e => {
    //   let buildinginfo = mapInstance.queryRenderedFeatures(e.point, {
    //     layers: ['live']
    //   });

    //   if (buildinginfo.length > 0) {
    //     document.querySelector('#info').innerHTML =
    //       '<p>' +
    //       buildinginfo[0].properties.Title +
    //       '</p><p><em>' +
    //       buildinginfo[0].properties.Date +
    //       '</em></p>';
    //   } else {
    //     document.querySelector('#info').innerHTML =
    //       '<p>Move your mouse over a point to view details.</p>';
    //   }
    // });

    mapInstance.on('mouseenter', 'live', e => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });
    mapInstance.on('mouseenter', 'landmarks', e => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pan icon when it leaves.
    mapInstance.on('mouseleave', 'live', e => {
      mapInstance.getCanvas().style.cursor = '';
    });
    mapInstance.on('mouseleave', 'landmarks', e => {
      mapInstance.getCanvas().style.cursor = '';
    });

    map.current.on('click', 'live', e => {
      console.log(e.features[0].properties);
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          '<span class="popup-address">' +
            e.features[0].properties.Title +
            '</span><br>' +
            ' Location: ' +
            e.features[0].properties.Location +
            ' <br>Number of Victims: ' +
            e.features[0].properties.Total_Number_of_Victims +
            ' <br>Shooter Name: ' +
            e.features[0].properties.Shooter_Name +
            '<br>Shooter Race: ' +
            e.features[0].properties.Shooter_Race
        )
        .addTo(mapInstance);
    });
    map.current.on('click', 'landmarks', e => {
      console.log(e.features[0].properties);
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          '<span class="popup-address">' +
            e.features[0].properties.Title +
            '</span><br>' +
            ' Location: ' +
            e.features[0].properties.Location +
            ' <br>Number of Victims: ' +
            e.features[0].properties.Total_Number_of_Victims +
            ' <br>Shooter Name: ' +
            e.features[0].properties.Shooter_Name +
            '<br>Shooter Race: ' +
            e.features[0].properties.Shooter_Race
        )
        .addTo(mapInstance);
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const onFilter = (layerId, key, value) => {
    // const a = map.current.getLayoutProperty('landmarks', 'visibility');
    map.current.setFilter(layerId, ['==', ['get', key], value]);
    // map.current.setFilter('landmarks', ['==', ['get', 'Theme'], 'Transport']);
    // map.current.setFilter('landmarks', null);
    // map.current.getFilter('landmarks');
    // const visibility = map.current.getLayoutProperty('landmarks', 'visibility');
    // map.current.setLayoutProperty(
    //   'landmarks',
    //   'visibility',
    //   visibility === 'visible' ? 'none' : 'visible'
    // );
    console.log(map.current.getFilter('landmarks'));
  };

  const measure = () => {
    var distanceX = 1 / (111.32 * Math.cos((lat * Math.PI) / 180));
    var distanceY = 1 / 110.574;
    console.log(distanceY, distanceY + parseFloat(lat), parseFloat(lat) - distanceY);
    map.current.setFilter('landmarks', ['<=', ['get', 'lat'], distanceY + parseFloat(lat)]);
    map.current.setFilter('landmarks', ['>=', ['get', 'lat'], parseFloat(lat) - distanceY]);
  };

  const filterByTheme = value => {
    onFilter('landmarks', 'Theme', value);
  };

  const filterBySeatingType = value => {
    onFilter('cafes', 'Seating type', value);
  };

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <button onClick={onFilter}>filter</button>
      {/* live表 */}
      <button onClick={onFilter}>live music venue</button>
      {/* lands表 */}
      {/* Place of assembly、Leisure/recreation、Community Use */}
      <button onClick={onFilter}>lands</button>
      {/* cafe表 */}
      <button onClick={onFilter}>cafe</button>
      {/* cafe表 */}
      <button onClick={onFilter}>seating type</button>
      <button onClick={measure}>measure</button>
      <Select defaultValue="" style={{ width: 120 }} onChange={filterByTheme}>
        <Option value="Transport">Transport</Option>
        <Option value="Mixed Use">Mixed Use</Option>
        <Option value="Place Of Assembly">Place Of Assembly</Option>
      </Select>
      <Select defaultValue="" style={{ width: 120 }} onChange={filterBySeatingType}>
        <Option value="Seats - Indoor">Seats - Indoor</Option>
        <Option value="Seats - Outdoor">Seats - Outdoor</Option>
      </Select>
    </div>
  );
}

export default App;
