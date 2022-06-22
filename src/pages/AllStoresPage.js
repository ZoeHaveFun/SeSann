import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseStores } from '../firestore';

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
  const handleGet = () => {
    firebaseStores.getAll()
      .then((res) => res.map((item) => item.data()))
      .then((data) => setStores(data));
  };
  useEffect(() => { handleGet(); }, []);
  useEffect(() => {
    const handleStoresUpdate = (data) => {
      const newData = [];
      data.forEach((doc) => {
        newData.push(doc.data());
      });
      setStores(newData);
    };
    return firebaseStores.postSnapshot(handleStoresUpdate);
  }, []);
  useEffect(() => {
    const userId = 'mVJla3AyVysvFzWzUSG5';
    window.localStorage.setItem('userId', userId);
  }, []);
  return (
    <div>
      <Link to="/user/processing">我的帳戶</Link>
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
