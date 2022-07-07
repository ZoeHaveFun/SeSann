import {
  useRef, useContext, useState,
} from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';
import { firebaseUsers, firebaseStores } from '../../utils/firestore';

const Wrapper = styled.div`
  padding-top: 100px;
  background-color: #cbf3f0;
  height: 100vh;
`;

function StoreJoinForm() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const storeNameRef = useRef(null);
  const storePhoneRef = useRef(null);
  const [storeAddress, setStoreAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const geoKey = 'AIzaSyAKvX91_wrPBCvJUcPDFCVF18upOWq7GdM';

  const handlePostStore = () => {
    if (!userInfo.user_id) {
      window.location.href = './login';
    }
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${storeAddress}&key=${geoKey}`)
      .then((res) => {
        if (res.data.status === 'ZERO_RESULTS') {
          setErrorMessage('這地方不存在餒=..=');
          return;
        }
        setErrorMessage('');
        const postData = {};
        const addressComponents = res.data.results[0].address_components;
        postData.address = res.data.results[0].formatted_address;
        postData.location = res.data.results[0].geometry.location;
        postData.city = addressComponents[addressComponents.length - 3].long_name;
        postData.districts = addressComponents[addressComponents.length - 4].long_name;
        postData.store_name = storeNameRef.current.value;
        postData.phone = storePhoneRef.current.value;
        postData.user_id = userInfo.user_id;
        postData.order_record = [];

        const storeId = firebaseStores.post(postData);
        const newStoreIds = [...userInfo.storeIds, storeId];
        firebaseUsers.updateStoreIds(userInfo.user_id, newStoreIds);

        setStoreAddress('');
        storeNameRef.current.value = '';
        storePhoneRef.current.value = '';
      });
  };
  return (
    <Wrapper>
      <h2>店家入駐</h2>
      <label htmlFor="storeName">
        店家名稱:
        <input type="text" name="storeName" placeholder="妳的店名..." ref={storeNameRef} />
      </label>
      <label htmlFor="storeAddress">
        店家地址:
        <input type="text" name="storeAddress" value={storeAddress} placeholder="店在哪裡..." onChange={(e) => { setStoreAddress(e.target.value); }} />
      </label>
      <p>{errorMessage}</p>
      <label htmlFor="storePhone">
        電話
        <input type="text" name="storePhone" placeholder="連絡電話..." ref={storePhoneRef} />
      </label>
      <button type="submit" onClick={() => handlePostStore()}>入駐店家</button>
    </Wrapper>
  );
}

export default StoreJoinForm;
