import {
  useRef, useContext, useState,
} from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';
import Swal from 'sweetalert2';
import { firebaseUsers, firebaseStores } from '../../utils/firestore';

const Wrapper = styled.div`
  padding-top: 20px;
  height: 50vh;
`;
const JoinForm = styled.div`
  width: 600px;
  margin-left: calc(10vw);
  position: relative;
  box-shadow:  0px 0px 2px #999;
  display: flex;
  padding: 20px 16px;
  border-radius: 0.8rem;
  flex-direction: column;
  &>div:nth-child(2){
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    label {
      color: #1C5174;
      font-family: 'Noto Sans TC', sans-serif;
      width: 280px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      input {
        margin-left: 16px;
        flex: 1;
        border: transparent;
        border-bottom: 1px #DDE1E4 solid;
      }
    }
  }
`;
const Button = styled.button`
  position: absolute;
  right: 16px;
  bottom: 16px;
  padding: 8px 16px;
  border: 1px #DDE1E4 solid;
  border-radius: 0.8rem;
  color: #1C5174;
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  cursor: pointer;
  background-color: #FEFCFB;
  color: #1C5174;
  &:hover{
    background-color: #023047;
    color: #FEFCFB;
    box-shadow: 0px 0px 4px #bbbec0;
  }
`;
const TitleDiv = styled.div`
  width: 80%;
  display: flex;
  font-family: 'Noto Sans TC', sans-serif;
  color:  #1C5174;
  margin-bottom: 16px;
  & >h2 {
    font-size: 32px;
    margin-right: 10px;
    letter-spacing: 0.2rem;
  }
`;
const SecTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 4px;
  font-size: 16px;
  font-weight: 500;
  span:nth-child(2) {
    display: inline-block;
    background-color: #DDE1E4;
    padding: 1px 8px;
    margin-top: 2px;
    width: 60px;
  }
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

        Swal.fire(
          '入駐成功',
          '可以到我的店家查看',
          'success',
        );
      });
  };
  return (
    <Wrapper>
      <JoinForm>
        <TitleDiv>
          <h2>店家入駐</h2>
          <SecTitle>
            <span>馬上實現時間自由</span>
            <span />
          </SecTitle>
        </TitleDiv>
        <div>
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
        </div>

        <Button type="submit" onClick={() => handlePostStore()}>加入</Button>
      </JoinForm>
    </Wrapper>
  );
}

export default StoreJoinForm;
