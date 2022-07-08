/* eslint-disable no-undef */
import {
  useEffect, useRef, useState,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseStores } from '../utils/firestore';
import LaundryMap from '../components/laundryMap';
import StoreJoinForm from '../components/StoreJoinForm';
import UserRegisterForm from '../components/UserRegisterForm';
import Header from '../components/Header';
import {
  FirstBanner, SectionA, SectionB, SectionC,
} from '../components/Section';

const StoreCard = styled.div`
  padding: 10px 20px;
  box-shadow: 0px 0px 8px #999;
  margin-bottom: 16px;
  display: flex;
  & > span {
    flex: 1;
  }
  & > span:nth-child(2) {
    flex: 2;
  }
`;
function Store({ item }) {
  return (
    <StoreCard>
      <span>{item.store_name}</span>
      <span>{item.address}</span>
      <span>{item.phone}</span>
      <button type="button">
        <Link to={`/store?store_id=${item.store_id}`}>查看更多</Link>
      </button>
    </StoreCard>
  );
}
Store.propTypes = {
  item: PropTypes.shape({
    store_name: PropTypes.string.isRequired,
    store_id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};

function Home() {
  const [stores, setStores] = useState([]);
  const pathTo = useLocation().search.split('=')[1];
  const LaundryMapRef = useRef();
  const FirstBannerRef = useRef();
  const JoinFormRef = useRef();
  const AboutRef = useRef();
  useEffect(() => {
    if (pathTo === 'map') {
      LaundryMapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (pathTo === 'home') {
      FirstBannerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (pathTo === 'join') {
      JoinFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (pathTo === 'about') {
      AboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathTo]);
  useEffect(() => {
    const handleStoresUpdate = (newData) => {
      setStores(newData);
    };
    return firebaseStores.onStoresShot(handleStoresUpdate);
  }, []);
  return (
    <>
      <Header />
      <FirstBanner FirstBannerRef={FirstBannerRef} />
      <SectionA AboutRef={AboutRef} />
      <SectionB />
      <SectionC />
      <LaundryMap LaundryMapRef={LaundryMapRef} />
      <div style={{ padding: '20px' }}>
        {
          stores?.map((item) => <Store item={item} key={item.store_id} />)
        }
      </div>
      <UserRegisterForm JoinFormRef={JoinFormRef} />
      <StoreJoinForm />
    </>
  );
}

export default Home;
