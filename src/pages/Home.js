import {
  useEffect, useRef, useState, useContext,
} from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseStores, firebaseUsers } from '../utils/firestore';

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

function RegisterForm() {
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
    <div>
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
  const userInfo = useContext(firebaseUsers.AuthContext);
  const [stores, setStores] = useState([]);
  const storeNameRef = useRef(null);
  const storeAddressRef = useRef(null);
  const storePhoneRef = useRef(null);

  const handlePostStore = () => {
    if (!userInfo.user_id) {
      window.location.href = './login';
    }

    const postData = {};
    postData.address = storeAddressRef.current.value;
    postData.store_name = storeNameRef.current.value;
    postData.phone = storePhoneRef.current.value;
    postData.user_id = userInfo.user_id;

    const storeId = firebaseStores.post(postData);
    const newStoreIds = [...userInfo.storeIds, storeId];
    firebaseUsers.updateStoreIds(userInfo.user_id, newStoreIds);

    storeAddressRef.current.value = '';
    storeNameRef.current.value = '';
    storePhoneRef.current.value = '';
  };
  useEffect(() => {
    const handleStoresUpdate = (newData) => {
      setStores(newData);
    };
    return firebaseStores.onStoresShot(handleStoresUpdate);
  }, []);
  return (
    <div>
      {
        !userInfo
          ? (
            <Link to="/login">
              <button type="button">登入</button>
            </Link>
          )
          : (
            <>
              <span>{`哈囉! ${userInfo.user_name}`}</span>
              <Link to="/user/processing">我的帳戶</Link>
            </>
          )
      }
      <RegisterForm />

      <div>
        <h2>店家入駐</h2>
        <label htmlFor="storeName">
          店家名稱
          <input type="text" name="storeName" placeholder="妳的店名..." ref={storeNameRef} />
        </label>
        <label htmlFor="storeAddress">
          店家地址
          <input type="text" name="storeAddress" placeholder="店在哪裡..." ref={storeAddressRef} />
        </label>
        <label htmlFor="storePhone">
          電話
          <input type="text" name="storePhone" placeholder="連絡電話..." ref={storePhoneRef} />
        </label>
        <button type="submit" onClick={handlePostStore}>入駐店家</button>
      </div>

      <div>
        {
          stores.map((item) => <Store item={item} key={item.store_id} />)
        }
      </div>
      <div>
        <h2>找一找</h2>
      </div>
    </div>
  );
}

export default Home;
