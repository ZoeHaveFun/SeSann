/* eslint-disable react/no-array-index-key */
import {
  useEffect, useContext, useState,
} from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import axios from 'axios';
import dayjs from 'dayjs';
import { firebaseStores, firebaseUsers, firebaseMachines } from '../utils/firestore';
import Header from '../components/Header';
import AddMachineForm from '../components/AddMachineForm';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  padding-top: 80px;
`;
const Title = styled.h1`
  color: #001c55;
  margin: 30px 10px 20px 10px;
  border-bottom: 1px #001c55 solid;
`;
const ButtonWrapper = styled.div`
  display: flex;
  & > button {
    border: 1px #001c55 solid;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 0.8rem;
    margin: 10px 8px;
  }
`;
const MachineWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  margin: 10px 20px;
  border-bottom: 1px #333 solid;
  align-items: flex-start;
  flex-direction: column;
`;
// const Button = styled.button`
//   border-radius: 0.5rem;
//   cursor: ${(props) => (props.isProcessing || props.notAllow ? 'not-allowed' : 'pointer')};
//   &:hover{
//     box-shadow: 0px 0px 4px #999;
//   }
// `;
// const CategoryBtn = styled(Button)`
//   padding: 4px 8px;
//   flex: 1;
//   height: 40px;
//   border: ${(props) => (props.isSelected ? '4px #666 solid' : '1px #999 solid')};
// `;
const CategoryWrapper = styled.div`
  margin: 0px 40px 0px 20px;
  width: 600px;
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
`;
const Category = styled.div`
  margin: 8px 0px;
`;

function MachineCard({ machine }) {
  const [edit, setEdit] = useState(false);
  const [machineName, setMachineName] = useState(machine.machine_name);
  const [categorys, setCategorys] = useState(machine.categorys);
  const handleCategoryChange = (e, index) => {
    const objKey = e.target.name;
    const newData = [...categorys];
    if (objKey === 'name') {
      newData[index].name = e.target.value;
    }
    if (objKey === 'price') {
      newData[index].price = Number(e.target.value);
    }
    if (objKey === 'time') {
      newData[index].time = Number(e.target.value);
    }
    setCategorys(newData);
  };
  const deletMachine = () => {
    firebaseMachines.delet(machine.machine_id);
  };
  const handleMachineEdit = () => {
    if (!edit) {
      setEdit(!edit);
      return;
    }
    const newData = { ...machine };
    newData.machine_name = machineName;
    newData.categorys = categorys;
    firebaseMachines.updateData(machine.machine_id, newData);
    setEdit(!edit);
  };

  return (
    <MachineWrapper>
      <label htmlFor="machineName">
        機台名稱:
        <input type="text" name="machineName" value={machineName} disabled={!edit} onChange={(e) => { setMachineName(e.target.value); }} />
      </label>
      <label htmlFor="machineType">
        類型:
        <input type="text" name="machineType" value={machine.type} disabled />
      </label>
      <CategoryWrapper>
        {
          categorys.map((category, index) => (
            <Category key={index}>
              <label htmlFor="name">
                <input type="text" name="name" value={category.name} disabled={!edit} onChange={(e) => { handleCategoryChange(e, index); }} />
              </label>
              <label htmlFor="time">
                <input type="text" name="time" value={category.time} disabled={!edit} onChange={(e) => { handleCategoryChange(e, index); }} />
                分鐘
              </label>
              <label htmlFor="price">
                <input type="text" name="price" value={category.price} disabled={!edit} onChange={(e) => { handleCategoryChange(e, index); }} />
                元
              </label>
            </Category>
          ))
        }
      </CategoryWrapper>
      <ButtonWrapper>
        <button type="button" onClick={() => { handleMachineEdit(); }}>{edit ? '完成' : '編輯'}</button>
        <button type="button" onClick={deletMachine}>刪除</button>
      </ButtonWrapper>
    </MachineWrapper>
  );
}

function Backstage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;
  const [userStores, setUserStores] = useState([]);
  const [storeData, setStoreData] = useState('');
  const [machines, setMachines] = useState([]);
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const geoKey = 'AIzaSyAKvX91_wrPBCvJUcPDFCVF18upOWq7GdM';
  const handleMachinessUpdate = (newData) => {
    setMachines(newData);
  };
  const changeStoreBackstage = async (e) => {
    const storeId = e.target.selectedOptions[0].id;
    const data = await firebaseStores.getOne(storeId);
    setStoreData(data);

    return firebaseMachines.onMachinesShot(storeId, 'store_id', handleMachinessUpdate);
  };
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
  const handleStoreEdit = () => {
    if (!edit) {
      setEdit(!edit);
      return;
    }
    firebaseStores.updateData(storeData.store_id, storeData);
    setEdit(!edit);
  };
  const handleCustomerRecord = (days) => {
    let customer;
    if (days === undefined) {
      customer = storeData.order_record.length;
    }
    if (days === 1) {
      const toddayRecord = storeData.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYYMMDD') === dayjs().format('YYYYMMDD'));
      customer = toddayRecord.length;
    }
    return customer;
  };
  const handleIncomeRecord = (days) => {
    let income;
    if (days === undefined) {
      income = storeData.order_record.reduce((accu, curr) => accu + curr.category.price, 0);
    }
    if (days === 1) {
      const toddayRecord = storeData.order_record.filter((record) => dayjs(record.start_time.seconds * 1000).format('YYYYMMDD') === dayjs().format('YYYYMMDD'));
      income = toddayRecord.reduce((accu, curr) => accu + curr.category.price, 0);
    }
    return income;
  };
  useEffect(() => {
    firebaseStores.getQuery(userId, 'user_id')
      .then((res) => res.map((docc) => docc.data()))
      .then((data) => { setUserStores(data); });
  }, [userId]);
  return (
    <>
      <Header />
      <Wrapper>
        <Title>我的店家</Title>
        <div>
          我的店家:
          <select onChange={(e) => changeStoreBackstage(e)}>
            <option>pick</option>
            {
              userStores.map((store) => (
                <option id={store.store_id} key={store.store_id}>{store.store_name}</option>
              ))
            }
          </select>
          {
            storeData ? (
              <>
                <div>
                  <label htmlFor="storeName">
                    店名:
                    <input type="text" name="storeName" value={storeData.store_name} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
                  </label>
                  <label htmlFor="address">
                    地址:
                    <input type="text" name="address" value={storeData.address} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
                  </label>
                  <p>{errorMessage}</p>
                  <label htmlFor="phone">
                    連絡電話:
                    <input type="text" name="phone" value={storeData.phone} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
                  </label>
                  <button type="button" onClick={() => { handleStoreEdit(); }}>{edit ? '完成' : '編輯'}</button>
                </div>
                <div>
                  <span>
                    今日來客數:
                    {handleCustomerRecord(1)}
                  </span>
                  <span>
                    今日營業額:
                    {handleIncomeRecord(1)}
                  </span>
                  <span>
                    累積來客數:
                    {handleCustomerRecord()}
                  </span>
                  <span>
                    累積營業額:
                    {handleIncomeRecord()}
                  </span>
                </div>
              </>
            ) : ''
          }

        </div>
        {
          storeData ? <AddMachineForm storeId={storeData.store_id} /> : ''
        }
        {
          storeData && machines.length === 0 ? <h2>老闆你這家店還沒機台餒</h2>
            : machines?.map?.(
              (machine) => <MachineCard machine={machine} key={machine.machine_id} />,
            )
        }
      </Wrapper>
    </>

  );
}
export default Backstage;

MachineCard.propTypes = {
  machine: PropTypes.shape({
    machine_id: PropTypes.string.isRequired,
    machine_name: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    store_id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    categorys: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      time: PropTypes.number.isRequired,
    })).isRequired,
  }).isRequired,
};
