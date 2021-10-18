import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { GeolocateControl, ScaleControl } from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { ZoomControl } from 'mapbox-gl-controls';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Button, Select } from 'antd';
import Detail from '../components/Detail';
import logo from '../assets/images/logo.jpg';
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWxhbndhbmczIiwiYSI6ImNrdXV4dDd0ZjFraG8ydXBqZ2J1OWRwcHUifQ.5NvSu2AbiWynx-7B8TSZQw';

const { Option } = Select;

const createGeoJSONCircle = function (center, radiusInKm, points) {
  if (!points) points = 64;

  var coords = {
    latitude: center[1],
    longitude: center[0]
  };

  var km = radiusInKm;

  var ret = [];
  var distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  var distanceY = km / 110.574;

  var theta, x, y;
  for (var i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [ret]
          }
        }
      ]
    }
  };
};

export default function Map(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapSearch = useRef(null);
  const popup = useRef(null);
  const [lng, setLng] = useState(144.9594);
  const [lat, setLat] = useState(-37.8019);
  const [zoom, setZoom] = useState(13.5);
  const [type, setType] = useState('');
  const [detail, setDetail] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDoorType, setShowDoorType] = useState(false);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      maxBounds: [
        [144.319175, -38.417014], // Southwest coordinates
        [145.634826, -37.469409] // Northeast coordinates
      ],
      style: 'mapbox://styles/alanwang3/ckuw5091s6l8d17tfwcbxx3f3',
      center: [lng, lat],
      zoom: zoom
    });

    console.log(mapboxgl);

    mapSearch.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    });

    popup.current = new mapboxgl.Popup();

    map.current.addControl(mapSearch.current);

    map.current.addControl(
      new GeolocateControl({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );

    map.current.addControl(
      new ScaleControl({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );

    map.current.addControl(new ZoomControl(), 'top-right');
  });

  // style effect
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    mapInstance.on('mouseenter', 'live', e => {
      mapInstance.getCanvas().style.cursor = 'pointer';
      popup.current
        .setLngLat(e.lngLat)
        .setHTML(
          '<span class="popup-address">' +
            'Name: ' +
            e.features[0].properties['venue_name'] +
            '</span><br>' +
            ' Type: places of interests'
        )
        .addTo(mapInstance);
    });
    mapInstance.on('mouseenter', 'landmarks', e => {
      mapInstance.getCanvas().style.cursor = 'pointer';
      popup.current
        .setLngLat(e.lngLat)
        .setHTML(
          '<span class="popup-address">' +
            'Name: ' +
            e.features[0].properties['Feature Name'] +
            '</span><br>' +
            ' Type: places of interests'
        )
        .addTo(mapInstance);
    });
    mapInstance.on('mouseenter', 'cafe', e => {
      mapInstance.getCanvas().style.cursor = 'pointer';
      popup.current
        .setLngLat(e.lngLat)
        .setHTML(
          '<span class="popup-address">' +
            'Name: ' +
            e.features[0].properties['Trading name'] +
            '</span><br>' +
            ' Type: café and restaurant'
        )
        .addTo(mapInstance);
    });

    // Change it back to a pan icon when it leaves.
    mapInstance.on('mouseleave', 'live', e => {
      mapInstance.getCanvas().style.cursor = '';
    });
    mapInstance.on('mouseleave', 'landmarks', e => {
      mapInstance.getCanvas().style.cursor = '';
    });
    mapInstance.on('mouseleave', 'cafe', e => {
      mapInstance.getCanvas().style.cursor = '';
    });

    map.current.on('click', 'live', e => {
      setType('live');
      setShowModal(true);
      setDetail(e.features[0].properties);
    });
    map.current.on('click', 'landmarks', e => {
      setType('landmarks');
      setShowModal(true);
      setDetail(e.features[0].properties);
    });
    map.current.on('click', 'cafe', e => {
      setType('cafe');
      setShowModal(true);
      setDetail(e.features[0].properties);
    });

    mapSearch.current.on('result', ({ result }) => {
      measure(result.center);
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
    map.current.setFilter(layerId, ['==', ['get', key], value]);
  };

  const measure = point => {
    restAll();
    const hasSource = map.current.getSource('polygon');
    const hasLayer = map.current.getLayer('polygon');
    hasLayer && map.current.removeLayer('polygon');
    hasSource && map.current.removeSource('polygon');
    map.current.addSource('polygon', createGeoJSONCircle(point, 0.8));

    map.current.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'polygon',
      paint: {
        'fill-color': '#93C5FD',
        'fill-opacity': 0.4
      }
    });
  };

  const resetVisible = value => {
    map.current.setLayoutProperty('live', 'visibility', value);
    map.current.setLayoutProperty('cafe', 'visibility', value);
    map.current.setLayoutProperty('landmarks', 'visibility', value);
  };

  const restAll = () => {
    resetVisible('visible');
    resetFilter('cafe');
    resetFilter('landmarks');
    resetFilter('live');
  };

  const filterByType = value => {
    if (value === 'all') {
      restAll();
      return;
    }
    if (value !== 'live' && value !== 'cafe') {
      resetVisible('none');
      map.current.setLayoutProperty('landmarks', 'visibility', 'visible');
      onFilter('landmarks', 'Theme', value);
    } else {
      if (value === 'cafe') {
        setShowDoorType(true);
      } else {
        setShowDoorType(false);
      }
      resetVisible('none');
      map.current.setLayoutProperty(value, 'visibility', 'visible');
    }
  };

  const resetFilter = layerId => {
    map.current.setFilter(layerId, null);
  };

  const filterBySeatingType = value => {
    if (value === 'all') {
      resetFilter('cafe');
    } else {
      resetVisible('none');
      map.current.setLayoutProperty('cafe', 'visibility', 'visible');
      onFilter('cafe', 'Seating type', value);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  return (
    <div style={{ height: '100vh' }}>
      <div className="title-wrap">
        <img src={logo} />
        <h2>TravelExploring</h2>
      </div>

      <div id="map-wrapper" className="map-wrapper">
        {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}

        <div style={{ position: 'relative' }}>
          <div className="sidebar">
            <Select
              defaultValue="all"
              style={{ width: 200, marginRight: 20 }}
              onChange={filterByType}
            >
              <Option value="all">All</Option>
              <Option value="Community Use">Community Use</Option>
              <Option value="Leisure/Recreation">Leisure/Recreation</Option>
              <Option value="Place Of Assembly">Place Of Assembly</Option>
              <Option value="live">live music venue</Option>
              <Option value="cafe">Cafes and restaurants</Option>
            </Select>

            {showDoorType && (
              <Select defaultValue="all" style={{ width: 200 }} onChange={filterBySeatingType}>
                <Option value="all">All</Option>
                <Option value="Seats - Indoor">Indoor</Option>
                <Option value="Seats - Outdoor">Outdoor</Option>
              </Select>
            )}
          </div>
        </div>

        <div ref={mapContainer} className="map-container" />
        <Button style={{ marginTop: 20 }}>
          <Link to="/">Back</Link>
        </Button>
      </div>

      <div className="content-wrap">
        <div style={{ marginTop: 10 }}>
          {type && (
            <Modal footer={null} title="Info" visible={showModal} onCancel={handleCancel}>
              <Detail type={type} detail={detail} />
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
