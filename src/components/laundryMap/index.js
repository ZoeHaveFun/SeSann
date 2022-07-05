/* eslint-disable global-require */
/* eslint-disable react/jsx-no-useless-fragment */
import {
  MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components/macro';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const Wrapper = styled.div`
  height: 500px;
  padding: 10px 50px;
`;

function ChangeCenter() {
  const map = useMap();
  map.locate();
  const mapEvent = useMapEvents({
    locationfound(e) {
      mapEvent.flyTo(e.latlng, 17);
    },
  });
  return <></>;
}
function LaundryMap() {
  const [makers, setMakers] = useState([23.991074, 121.611198]);
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMakers([position.coords.latitude, position.coords.longitude]);
    });
  }, []);
  return (
    <div>
      <h2>找一找</h2>
      <Wrapper>
        <MapContainer center={makers} zoom={9} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
          <ChangeCenter />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={makers}>
            <Popup>
              A pretty CSS3 popup.
              <br />
              Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Wrapper>
    </div>

  );
}
export default LaundryMap;
