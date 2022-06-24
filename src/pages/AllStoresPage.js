/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseStores, firebaseUsers } from '../firestore';

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

function LoginForm() {
  const loginEmail = useRef();
  const loginPassword = useRef();

  const postLogin = () => {
    const userInfo = firebaseUsers.login(
      loginEmail.current.value,
      loginPassword.current.value,
    );

    loginEmail.current.value = '';
    loginPassword.current.value = '';
  };
  return (
    <div>
      <h2>會員登入</h2>
      <label htmlFor="loginEmail">
        Email
        <input type="email" name="loginEmail" placeholder="輸入email" ref={loginEmail} />
      </label>
      <label htmlFor="loginPassword">
        密碼
        <input type="password" name="loginPassword" placeholder="輸入密碼" ref={loginPassword} />
      </label>
      <button type="button" onClick={postLogin}>登入</button>
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

function AllStoresPage() {
  const [stores, setStores] = useState([]);
  const storeNameRef = useRef(null);
  const storeAddressRef = useRef(null);
  const storePhoneRef = useRef(null);
  const handlePostStore = () => {
    const postData = {};
    postData.address = storeAddressRef.current.value;
    postData.store_name = storeNameRef.current.value;
    postData.phone = storePhoneRef.current.value;
    firebaseStores.post(postData);

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
  useEffect(() => {
    const userId = 'mVJla3AyVysvFzWzUSG5';
    window.localStorage.setItem('userId', userId);
  }, []);
  return (
    <div>
      <Link to="/user/processing">我的帳戶</Link>
      <RegisterForm />
      <LoginForm />
      <ul>
        <li>
          <span>店家名稱</span>
          <input type="text" ref={storeNameRef} />
        </li>
        <li>
          <span>店家地址</span>
          <input type="text" ref={storeAddressRef} />
        </li>
        <li>
          <span>電話</span>
          <input type="text" ref={storePhoneRef} />
        </li>
        <li>
          <button type="submit" onClick={handlePostStore}>入駐店家</button>
        </li>
      </ul>
      <div>
        {
          stores.map((item) => <Store item={item} key={item.store_id} />)
        }
      </div>
    </div>
  );
}

export default AllStoresPage;
