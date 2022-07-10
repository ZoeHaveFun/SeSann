/* eslint-disable react/no-array-index-key */
import {
  useEffect, useContext, useState,
} from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import ReactSelect from 'react-select';
import axios from 'axios';
import dayjs from 'dayjs';
import { map } from 'ramda';
import {
  ModeEdit, Check, InsertChartOutlined, SettingsSuggest, Face, MonetizationOn,
} from '@styled-icons/material-rounded';
import { Outlet, Link } from 'react-router-dom';
import { firebaseStores, firebaseUsers, firebaseMachines } from '../utils/firestore';
import Header from '../components/Header';
import AddMachineForm from '../components/AddMachineForm';
import storeMainImg from '../style/imgs/storeMainImg.jpg';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  padding-top: 80px;
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

const TitleWrpper = styled.div`
  position: absolute;
  width: 100%;
  color: #FEFCFB;
  padding: 30px 0px 160px;
  border-radius: 0 0 60% 40%;
  background-image: linear-gradient(to bottom, #327CA7, #FEFCFB);
`;
const Title = styled.div`
  z-index: 10;
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 1120px;
  margin: auto;
  padding-left: 8px;
  font-size: 16px;
  letter-spacing: 0.1rem;
  font-family: 'Noto Sans TC', sans-serif;
`;
const CustomSelect = styled(ReactSelect)`
  border-radius: 0.8rem;
  width: 80%;
  margin-left: 16px;
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 14px;
  color: #023047;
  border-radius: 1rem;
  .react-select__control {
    border-radius: 1rem;
  }
  .react-select__control--is-focused {
    box-shadow: 0px 0px 0px 1px #1C5174;
  }
  .react-select__single-value{
    color: #023047;
  }
  .react-select__option--is-focused {
    background: #DDE1E4;
  }
  .react-select__option--is-selected {
    background: #FFC94A;
    color: #1C5174;
  }
`;
const Container = styled.div`
  width: 80%;
  max-width: 1120px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
`;
const StoreHeader = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: flex-start;
  padding: 20px;
  background-color: #EFF0F2;
  border-radius: 0.8rem;
  margin-bottom: 20px;
  box-shadow: 0px 0px 8px #8B8C89;
`;
const Left = styled.div`
  flex: 2;
  display: flex;
  border-right: 1px #DDE1E4 solid;
  margin-right: 16px;
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const InformationSpan = styled.span`
  font-size: 24px;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  position: relative;
  z-index: 1;
  cursor: default;
  &:before {
    content: '';
    font-size: 14px;
    position: absolute;
    z-index: -1;
    top: -22px;
    left: 38px;
    padding: 4px 10px;
    border-radius: 0.2rem;
    transition: all .2s;
  }
  >svg {
    width: 30px;
    margin-right: 8px;
  }
`;
const CustomerInform = styled(InformationSpan)`
  &:hover {
    color: #1C5174;
    &:before {
      content: '來客數';
      background-color: #FEFCFB;
      box-shadow: 0px 0px 4px #999;
    }
  }
`;
const IncomeInform = styled(InformationSpan)`
  &:hover {
    color: #1C5174;
    &:before {
      content: '銷售額';
      background-color: #FEFCFB;
      box-shadow: 0px 0px 4px #999;
    }
  }
`;
const StoreImg = styled.img`
  width: 120px;
  border-radius: 50%;
  margin-right: 14px;
  box-shadow: 0px 0px 2px #999;
`;
const StoreInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans TC', sans-serif;
  input {
    width: 100%;
    font-size: 16px;
    padding: 4px 8px 2px;
    margin-bottom: 2px;
    border-radius: 0.4rem 0.4rem 0 0;
    border: transparent;
    font-family: 'Noto Sans TC', sans-serif;
    color: #1C5174;
    box-shadow: ${(props) => (props.isEdit ? '0px 1px #8B8C89' : '')};
    background-color: ${(props) => (props.isEdit ? '#FEFCFB' : 'transparent')};
    transition: all .3s;
  }
  &>span:nth-child(2) {
    color: #8B8C89;
    font-size: 12px;
    padding-left: 8px;
  }
  &>label:nth-child(3) {
    input {
      margin-bottom: 8px;
    }
  }
  &>label:nth-child(5) {
    input {
      width: 50%;
    }
  }
`;
const EditBtn = styled.button`
  position: absolute;
  right: 16px;
  bottom: -2px;
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
const MainContain = styled.div`
  width: 100%;
`;
const TabBar = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  font-family: 'Noto Sans TC', sans-serif;
`;
const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 4px 2px;
  text-align: center;
  color:  ${(props) => (props.isSelect ? '#1C5174' : '#8B8C89')};
  box-shadow: ${(props) => (props.isSelect ? '0px 2px #1C5174' : '')};
  text-decoration: none;
  transition: all .3s;
  &+& {
    margin-left: 26px;
  }
`;
const Icon = styled.span`
  display: flex;
  margin-right: 2px;
  &>svg{
    width: ${(props) => (props.bigger ? '30px' : '20px')};
  }
`;

function Backstage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;
  const [userStores, setUserStores] = useState([]);
  const [storeData, setStoreData] = useState('');
  const [selectStore, setSelectStore] = useState('');
  const [machines, setMachines] = useState([]);
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const geoKey = 'AIzaSyAKvX91_wrPBCvJUcPDFCVF18upOWq7GdM';

  const myStores = () => map((storeItem) => (
    { value: storeItem.store_id, label: storeItem.store_name }
  ), userStores);
  const updateMachines = (newData) => {
    setMachines(newData);
  };
  const handleSelectChange = async (e) => {
    setSelectStore(e);
    const data = await firebaseStores.getOne(e.value);
    setStoreData(data);

    return firebaseMachines.onMachinesShot(e.value, 'store_id', updateMachines);
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
  const updateStoreInfo = () => {
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
      .then((data) => {
        setUserStores(data);
      });
  }, [userId]);
  return (
    <>
      <Header />
      <Wrapper>
        <TitleWrpper>
          <Title>
            我的店家
            <CustomSelect
              classNamePrefix="react-select"
              options={myStores()}
              value={selectStore}
              onChange={handleSelectChange}
              // defaultValue={{ value: '111', label: '222' }}
              placeholder="選擇店家"
            />
          </Title>
        </TitleWrpper>
        <Container>
          <StoreHeader>
            <Left>
              <StoreImg src={storeMainImg} />
              <StoreInfo isEdit={edit}>
                <label htmlFor="storeName">
                  <input type="text" name="storeName" value={storeData.store_name} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
                </label>
                <span>{`ID: ${storeData.store_id}`}</span>
                <label htmlFor="address">
                  <input type="text" name="address" value={storeData.address} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
                </label>
                <p>{errorMessage}</p>
                <label htmlFor="phone">
                  <input type="text" name="phone" value={storeData.phone} disabled={!edit} onChange={(e) => { changeStoreData(e); }} />
                </label>
                <EditBtn isEdit={edit} type="button" onClick={() => { updateStoreInfo(); }}>
                  {
                  edit ? <Check /> : <ModeEdit />
                }
                </EditBtn>
              </StoreInfo>
            </Left>
            <Right>
              {
                storeData ? (
                  <>
                    TODAY :
                    <CustomerInform>
                      <Face />
                      {handleCustomerRecord(1)}
                    </CustomerInform>
                    <IncomeInform>
                      <MonetizationOn />
                      {handleIncomeRecord(1)}
                    </IncomeInform>
                  </>
                ) : ''
              }
            </Right>
          </StoreHeader>
          <MainContain>
            <TabBar>
              <Button to="/store/backstage">
                <Icon bigger>
                  <InsertChartOutlined />
                </Icon>
              </Button>
              <Button to="/store/backstage/manage">
                <Icon>
                  <SettingsSuggest />
                </Icon>
              </Button>
            </TabBar>
            <Outlet storeData={storeData} />
          </MainContain>
        </Container>
        {
            storeData ? (
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
            ) : ''
          }
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
