/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable global-require */
/* eslint-disable react/jsx-no-useless-fragment */
import {
  MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components/macro';
import L from 'leaflet';
import { PropTypes } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  map, find, propEq,
} from 'ramda';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { firebaseStores } from '../../utils/firestore';
import userIcon from '../../style/imgs/location.png';
import storeIcon from '../../style/imgs/store.png';
import DistrictData from '../../utils/taiwanDistricts.json';

const Wrapper = styled.div`
  padding-top: 100px;
`;

const MapWrapper = styled.div`
  height: 500px;
  padding: 10px 50px;
  z-index: 2;
`;

const SelectWrapper = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  z-index: 9;
`;
const SelectBar = styled.div`
  width: 50%;
`;

function SelectLocationBar(props) {
  const {
    city, setCity, district, setDistrict, districts, setDistricts,
  } = props;
  // selectedCity
  const selectedCity = (cityName) => {
    if (!cityName) return '';
    return { value: cityName, label: cityName };
  };
  // selectedDistrict
  const selectedDistrict = (districtName) => {
    if (!districtName) return '';
    return { value: districtName, label: districtName };
  };
  // 當前縣市選項
  const cities = () => map((cityItem) => (
    { value: cityItem.name, label: cityItem.name }), DistrictData);
  // 當前區域選項
  const findDistricts = (cityName) => find(propEq('name', cityName))(DistrictData)?.districts;
  // 區域選項 (符合下拉式選單的格式)
  const districtOpts = (cityName) => map((d) => (
    { value: d.name, label: d.name, zip: d.zip }
  ), findDistricts(cityName));
  // 改變縣市
  const handleCityChange = (e) => {
    setDistrict('');
    setCity(e.value);
  };
  // city 改變對應動作
  useEffect(() => {
    if (city) {
      const result = districtOpts(city);
      setDistricts(result);
    }
  }, [city]);

  return (
    <SelectWrapper>
      <SelectBar>
        <Select
          options={cities()}
          value={selectedCity(city)}
          onChange={handleCityChange}
          placeholder="選擇城市"
        />
      </SelectBar>
      <SelectBar>
        <Select
          value={selectedDistrict(district)}
          options={districts}
          placeholder="選擇區域"
          onChange={(e) => setDistrict(e.value)}
        />
      </SelectBar>
    </SelectWrapper>
  );
}
SelectLocationBar.propTypes = {
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  district: PropTypes.string.isRequired,
  setDistrict: PropTypes.func.isRequired,
  districts: PropTypes.arrayOf(
    PropTypes.shape({
      zip: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
  ).isRequired,
  setDistricts: PropTypes.func.isRequired,
};

const icon = {
  user: L.icon({
    iconUrl: userIcon,
    iconRetinaUrl: userIcon,
    iconSize: [30, 30],
  }),
  store: L.icon({
    iconUrl: storeIcon,
    iconRetinaUrl: storeIcon,
    iconSize: [30, 30],
  }),
};

function ChangeCenter({ boundry }) {
  const Lmap = useMap();
  if (boundry.length === 0) {
    Lmap.locate();
    const mapEvent = useMapEvents({
      locationfound(e) {
        mapEvent.flyTo(e.latlng, 17);
      },
    });
  }
  if (boundry.length !== 0) {
    Lmap.fitBounds(boundry);
  }
  return <></>;
}
ChangeCenter.propTypes = {
  boundry: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.number,
    ),
  ).isRequired,
};
// ChangeCenter.propTypes = {
//   boundry: PropTypes.shape([
//     PropTypes.shape,
//   ]).isRequired,
// };

function SetBoundsRectangles({ boundry }) {
  const Lmap = useMap();
  if (boundry.length !== 0) {
    Lmap.fitBounds(boundry);
  }
}
SetBoundsRectangles.propTypes = {
  boundry: PropTypes.shape([
    PropTypes.shape([
      PropTypes.number.isRequired,
    ]),
  ]),
};

function LaundryMap() {
  const [location, setLocation] = useState([23.991074, 121.611198]);
  const mapRef = useRef(null);
  // const preBoundryRef = useRef(null);
  const [boundry, setBoundry] = useState([]);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [districts, setDistricts] = useState([]);
  const [stores, setStores] = useState([]);
  const [storesMarker, setStoresMarker] = useState([]);

  const attributionUrl = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  const mapApiKey = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_LEAFLET_MAP_APIKEY}`;

  useEffect(() => {
    if (city === '' && district === '') return;
    const cityFilter = stores.filter((store) => store.city === city);
    setStoresMarker(cityFilter);
    const newBounds = cityFilter.map((store) => [store.location.lat, store.location.lng]);
    newBounds.push(location);
    setBoundry(newBounds);
  }, [city, district]);

  useEffect(() => {
    const handleStoresUpdate = (newData) => {
      setStores(newData);
    };
    return firebaseStores.onStoresShot(handleStoresUpdate);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <Wrapper>
      <h2>找一找</h2>
      <SelectLocationBar
        city={city}
        setCity={setCity}
        district={district}
        setDistrict={setDistrict}
        districts={districts}
        setDistricts={setDistricts}
      />
      <MapWrapper>
        <MapContainer
          center={location}
          zoom={9}
          bounds={mapRef.current ? boundry : null}
          ref={mapRef}
          scrollWheelZoom
          style={{ width: '100%', height: '100%' }}
        >
          {/* <SetBoundsRectangles bounds={boundry} /> */}
          <ChangeCenter boundry={boundry} />
          <TileLayer
            attribution={attributionUrl}
            url={mapApiKey}
          />
          <Marker position={location} icon={icon.user}>
            <Popup>你在這裡!</Popup>
            <Tooltip sticky>你在這裡!</Tooltip>
          </Marker>
          {
            storesMarker?.map?.((store) => (
              <Marker
                key={store.store_id}
                position={[store.location.lat, store.location.lng]}
                icon={icon.store}
              >
                <Popup>
                  <span>{store.store_name}</span>
                  <Link to={`/store?store_id=${store.store_id}`}>前往店家</Link>
                </Popup>
                <Tooltip sticky>{store.store_name}</Tooltip>
              </Marker>
            ))
          }
        </MapContainer>
      </MapWrapper>
    </Wrapper>

  );
}
export default LaundryMap;
