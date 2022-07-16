import {
  useEffect, useContext, useState,
} from 'react';
import styled from 'styled-components/macro';
import ReactSelect from 'react-select';
// import axios from 'axios';
import { map } from 'ramda';
import {
  InsertChartOutlined, SettingsSuggest, Face, MonetizationOn, LocalLaundryService,
} from '@styled-icons/material-rounded';
import { Outlet, Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { firebaseStores, firebaseUsers } from '../utils/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import storeMainImg from '../style/imgs/storeMainImg.jpg';
import { totalCustomerRecord, totalIncomeRecord } from '../utils/reuseFunc';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  padding-top: 80px;
`;

const TitleWrpper = styled.div`
  position: absolute;
  width: 100%;
  color: #FEFCFB;
  padding: 30px 0px 160px;
  border-radius: 0 0 60% 40%;
  background-image: linear-gradient(to bottom, #327CA7, #FEFCFB);
`;
const Title = styled.div`
  z-index: 9;
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
  div {
    font-size: 16px;
    padding: 4px 8px 2px;
    font-family: 'Noto Sans TC', sans-serif;
    color: #1C5174;
  }
  &>span:nth-child(2) {
    color: #8B8C89;
    font-size: 12px;
    padding-left: 8px;
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
  const pathArray = useLocation().pathname.split('/');
  const currentTag = pathArray[pathArray.length - 1];
  const { CurrentStoreIdContext } = firebaseStores;
  const [userStores, setUserStores] = useState([]);
  const [storeData, setStoreData] = useState('');
  const [selectStore, setSelectStore] = useState('');

  const myStores = () => map((storeItem) => (
    { value: storeItem.store_id, label: storeItem.store_name }
  ), userStores);
  const handleSelectChange = async (e) => {
    setSelectStore(e);
  };
  useEffect(() => {
    if (selectStore) {
      const updateStoreInfo = (data) => {
        setStoreData(data);
      };
      return firebaseStores.onOneStoreShot(selectStore.value, updateStoreInfo);
    }
    return undefined;
  }, [selectStore]);
  useEffect(() => {
    firebaseStores.getQuery(userId, 'user_id')
      .then((res) => res.map((docc) => docc.data()))
      .then(async (data) => {
        setUserStores(data);
        setSelectStore({ value: data[0].store_id, label: data[0].store_name });
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
              placeholder="選擇店家"
            />
          </Title>
        </TitleWrpper>
        <Container>
          <StoreHeader>
            <Left>
              <StoreImg src={storeMainImg} />
              <StoreInfo>
                <div>{storeData.store_name}</div>
                <span>{`ID: ${storeData.store_id}`}</span>
                <div>{storeData.address}</div>
                <div>{storeData.phone}</div>
              </StoreInfo>
            </Left>
            <Right>
              {
                storeData ? (
                  <>
                    TODAY :
                    <CustomerInform>
                      <Face />
                      {totalCustomerRecord(1, storeData)}
                    </CustomerInform>
                    <IncomeInform>
                      <MonetizationOn />
                      {totalIncomeRecord(1, storeData)}
                    </IncomeInform>
                  </>
                ) : ''
              }
            </Right>
          </StoreHeader>
          <MainContain>
            <TabBar>
              <Button to="/store/backstage/manage" isSelect={currentTag === 'manage'}>
                <Icon>
                  <LocalLaundryService />
                </Icon>
                管理
              </Button>
              <Button to="/store/backstage" isSelect={currentTag === 'backstage'}>
                <Icon bigger>
                  <InsertChartOutlined />
                </Icon>
              </Button>
              <Button to="/store/backstage/setting" isSelect={currentTag === 'setting'}>
                <Icon>
                  <SettingsSuggest />
                </Icon>
                設定
              </Button>
            </TabBar>
            <CurrentStoreIdContext.Provider value={selectStore.value}>
              <Outlet />
            </CurrentStoreIdContext.Provider>
          </MainContain>
        </Container>
      </Wrapper>
      <Footer />
    </>

  );
}
export default Backstage;
