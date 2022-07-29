import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';
import {
  ModeEdit, Check,
} from '@styled-icons/material-rounded';
import { firebaseStores } from '../utils/firestore';
import { Toast } from '../components/Alert';

const Wrapper = styled.div`

`;
const Section = styled.div`
  box-shadow: 0px 0px 8px #E7ECEF;
  padding: 12px 18px 20px;
  border-radius: 0.8rem;
`;
const Tittle = styled.h3`
  font-family: 'Noto Sans TC', sans-serif;
  color: #1C5174;
  font-weight: 500;
  position: relative;
  margin-bottom: 8px;
  >span {
    position: absolute;
    bottom: -2px;
    left: 0px;
    background-color: #E7ECEF;
    width: 60px;
    padding: 2px 6px;
  }
`;
const StoreInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans TC', sans-serif;
  label {
    display: flex;
    align-items: center;
    color: #8B8C89;
    font-family: 'Noto Sans TC', sans-serif;
  }
  input {
    flex: 1;
    font-size: 16px;
    padding: 4px 8px 2px;
    margin-left: 10px;
    margin-bottom: 2px;
    border-radius: 0.4rem 0.4rem 0 0;
    border: transparent;
    font-family: 'Noto Sans TC', sans-serif;
    color: #1C5174;
    box-shadow: ${(props) => (props.isEdit ? '0px 1px #8B8C89' : '')};
    background-color: ${(props) => (props.isEdit ? '#efefef' : 'transparent')};
    transition: all .3s;
  }
  &>span:nth-child(2) {
    color: #8B8C89;
    font-size: 12px;
    padding-left: 2px;
  }
`;
const EditBtn = styled.button`
  position: absolute;
  left: 90px;
  top: -36px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${(props) => (props.isEdit ? '#a5be00' : '#DDE1E4')};
  cursor: pointer;
  transition: all .3s;
  &:hover {
    box-shadow: 0px 0px 4px #666;

    color: #1C5174;
    >svg { 
      color: #1C5174;
    }
  }
  >svg { 
    width: 20px;
    color: #FEFCFB;
  }
`;

function BackSetting() {
  const storeId = useContext(firebaseStores.CurrentStoreIdContext);
  const [edit, setEdit] = useState(false);
  const [storeData, setStoreData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const geoKey = 'AIzaSyAKvX91_wrPBCvJUcPDFCVF18upOWq7GdM';

  const changeStoreData = (e) => {
    const newData = { ...storeData };
    if (e.target.name === 'address') {
      newData.address = e.target.value;
      setStoreData(newData);
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.target.value}&key=${geoKey}`)
        .then((res) => {
          if (res.data.status === 'ZERO_RESULTS') {
            setErrorMessage('這地方不存在餒=..=');
            return;
          }
          setErrorMessage('');
          const addressComponents = res.data.results[0].address_components;
          newData.address = res.data.results[0].formatted_address;
          newData.location = res.data.results[0].geometry.location;
          newData.city = addressComponents[addressComponents.length - 3].long_name;
          newData.districts = addressComponents[addressComponents.length - 4].long_name;
          setStoreData(newData);
        });
    }
    if (e.target.name === 'storeName') {
      newData.store_name = e.target.value;
      setStoreData(newData);
    }
    if (e.target.name === 'phone') {
      newData.phone = e.target.value;
      setStoreData(newData);
    }
  };
  const updateStoreInfo = () => {
    if (!edit) {
      setEdit(!edit);
      return;
    }
    firebaseStores.updateData(storeData.store_id, storeData);
    setEdit(!edit);
    Toast.fire({
      icon: 'success',
      title: '修改成功',
    });
  };
  useEffect(() => {
    const getStoreInfo = async () => {
      const data = await firebaseStores.getOne(storeId);
      setStoreData(data);
    };
    getStoreInfo();
  }, [storeId]);
  return (
    <Wrapper>
      <Section>
        <Tittle>
          店家設定
          <span />
        </Tittle>
        <StoreInfo isEdit={edit}>
          <label htmlFor="storeName">
            店名:
            <input type="text" name="storeName" value={storeData.store_name} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
          </label>
          <span>{`ID: ${storeData.store_id}`}</span>
          <label htmlFor="address">
            店家地址:
            <input type="text" name="address" value={storeData.address} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
          </label>
          <p>{errorMessage}</p>
          <label htmlFor="phone">
            連絡電話:
            <input type="text" name="phone" value={storeData.phone} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
          </label>
          <EditBtn isEdit={edit} type="button" onClick={() => { updateStoreInfo(); }}>
            {
              edit ? <Check /> : <ModeEdit />
            }
          </EditBtn>
        </StoreInfo>
      </Section>
    </Wrapper>

  );
}

export default BackSetting;
