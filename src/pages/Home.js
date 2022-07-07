/* eslint-disable no-undef */
import {
  useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { FullPage, Slide } from 'react-full-page';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseStores } from '../utils/firestore';
import LaundryMap from '../components/laundryMap';
import StoreJoinForm from '../components/StoreJoinForm';
import UserRegisterForm from '../components/UserRegisterForm';
import { HomeHeader } from '../components/Header';
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
  useEffect(() => {
    const handleStoresUpdate = (newData) => {
      setStores(newData);
    };
    return firebaseStores.onStoresShot(handleStoresUpdate);
  }, []);
  return (
    <FullPage duration={400} controls={HomeHeader}>
      <Slide>
        <FirstBanner />
      </Slide>
      <Slide>
        <SectionA />
      </Slide>
      <Slide>
        <SectionB />
      </Slide>
      <Slide>
        <SectionC />
      </Slide>
      <Slide>
        <LaundryMap />
      </Slide>
      <Slide>
        <div style={{ padding: '20px' }}>
          {
            stores?.map((item) => <Store item={item} key={item.store_id} />)
          }
        </div>
      </Slide>
      <Slide>
        <UserRegisterForm />
      </Slide>
      <Slide>
        <StoreJoinForm />
      </Slide>
    </FullPage>
  );
}

export default Home;
