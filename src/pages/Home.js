import {
  useEffect, useRef, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { FullPage, Slide } from 'react-full-page';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseStores, firebaseUsers } from '../utils/firestore';
import LaundryMap from '../components/laundryMap';
import StoreJoinForm from '../components/StoreJoinForm';
import Header from '../components/Header';
import { SectionA, SectionB, SectionC } from '../components/Section';
import doLaundry from '../style/imgs/doLaundry.jpg';

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

function UserRegisterForm() {
  const registerName = useRef();
  const registerEmail = useRef();
  const registerPassword = useRef();

  const postRegister = () => {
    firebaseUsers.register(
      registerName.current.value,
      registerEmail.current.value,
      registerPassword.current.value,
    );

    registerName.current.value = '';
    registerEmail.current.value = '';
    registerPassword.current.value = '';
  };
  return (
    <div style={{ backgroundColor: '#ffbf69', height: '100vh' }}>
      <h2>會員註冊</h2>
      <label htmlFor="registerName">
        名稱
        <input type="text" name="registerName" placeholder="怎麼稱呼你呢" ref={registerName} />
      </label>
      <label htmlFor="registerEmail">
        Email
        <input type="email" name="registerEmail" placeholder="輸入email" ref={registerEmail} />
      </label>
      <label htmlFor="registerPassword">
        密碼
        <input type="password" name="registerPassword" placeholder="輸入密碼" ref={registerPassword} />
      </label>
      <button type="button" onClick={postRegister}>註冊</button>
    </div>
  );
}

const Banner = styled.div`
  padding-top: 80px;
  background-image: url(${(props) => props.img});
  background-position: center;
  background-size: contain;
  /* background-repeat: no-repeat; */
  height: calc(100%);
`;

function FirstBanner() {
  return (
    <Banner img={doLaundry} />
  );
}
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
  const laundryMapRef = useRef(null);
  // const toLaundryMap = () => {
  //   console.log(laundryMapRef);
  //   laundryMapRef.scrollIntoView();
  //   // window.scrollTo(0, laundryMapRef.current.offsetTop);
  // };
  useEffect(() => {
    const handleStoresUpdate = (newData) => {
      setStores(newData);
    };
    return firebaseStores.onStoresShot(handleStoresUpdate);
  }, []);
  return (
    <>
      <Header />
      <FullPage>
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
          <div ref={laundryMapRef} />
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

    </>
  );
}

export default Home;
