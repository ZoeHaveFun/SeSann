/* eslint-disable no-console */
import {
  useEffect, useState, useContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import { Washer, Dryer, HeartCircle } from '@styled-icons/boxicons-solid';
import { Pets } from '@styled-icons/material-rounded';
import {
  firebaseMachines, firebaseStores, firebaseProcessing, firebaseReserve, firebaseUsers,
} from '../utils/firestore';
import handleIdleMachines from '../utils/reuseFunc';
import { Header } from '../components/Header';
import DefaultstoreMainImg from '../style/imgs/storeMainImg.jpg';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  padding-top: 100px;
`;
const MachineWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  margin: 10px 20px;
  border-bottom: 1px #333 solid;
  align-items: center;
`;
const Button = styled.button`
  border: 1px #001c55 solid;
  border-radius: 0.5rem;
  cursor: ${(props) => (props.isProcessing || props.notAllow ? 'not-allowed' : 'pointer')};
  &:hover{
    box-shadow: 0px 0px 4px #999;
  }
`;
const CategoryBtn = styled(Button)`
  padding: 4px 8px;
  flex: 1;
  height: 40px;
  border: ${(props) => (props.isSelected ? '4px #666 solid' : '1px #999 solid')};
`;
const CategoryWrapper = styled.div`
  margin: 0px 40px 0px 20px;
  width: 600px;
  display: flex;
  gap: 20px;
`;
const EffectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > button {
    padding: 8px;
    margin: 4px;
  }
`;
function MachineCard({ machine, handleProcessing, handleReserve }) {
  const [categoryIndex, setCategoryIndex] = useState(null);
  const [reverveList, setReverveList] = useState([]);
  const totalTime = () => reverveList.reduce((pre, current) => pre + current.category.time, 0);

  useEffect(() => {
    const handleReserveUpdate = (newData) => {
      setReverveList(newData);
    };
    return firebaseReserve.onReserveShot(machine.machine_id, 'machine_id', handleReserveUpdate);
  }, [machine.machine_id]);

  return (
    <MachineWrapper>
      <span>{machine.machine_name}</span>
      <CategoryWrapper>
        {
          machine.categorys.map((category, idx) => (
            <CategoryBtn
              onClick={() => setCategoryIndex(idx)}
              key={category.name}
              isSelected={categoryIndex === idx}
            >
              {`${category.name} ${category.time}分鐘 ${category.price}元`}
            </CategoryBtn>
          ))
        }
      </CategoryWrapper>
      <EffectWrapper>
        {
          machine.status === 0
            ? (
              <Button
                type="button"
                onClick={() => {
                  handleProcessing(machine.machine_id, categoryIndex);
                  setCategoryIndex('');
                }}
              >
                付款啟動
              </Button>
            )
            : <Button type="button" isProcessing>運轉中</Button>
        }
        <Button
          type="button"
          onClick={() => {
            handleReserve(machine.machine_id, categoryIndex);
            setCategoryIndex('');
          }}
          notAllow={!machine.status}
        >
          即時預定

        </Button>
        <span>
          {`預約人數:${reverveList.length}`}
        </span>
        {reverveList.length !== 0 ? <span>{`預計等待時間:${totalTime()}分鐘`}</span> : ''}
      </EffectWrapper>
    </MachineWrapper>
  );
}

const StoreHeaderStyled = styled.div`
  display: flex;
  width: 80%;
  margin: 10px auto 20px ;
  font-family: 'Noto Sans TC', sans-serif;
`;
const StoreInfo = styled.div`
  position: relative;
  flex: 1.5;
  background-color: #DDE1E4;
  margin-right: 10px;
  border-radius: 0.8rem;
  padding: 16px 22px 10px;
  color: #023047;
  h4 {
    margin-left: 10px;
    font-weight: 500;
    font-size: 14px;
  }
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  h1 {
    font-size: 26px;
    font-weight: 500;
  }
`;
const MainImg = styled.img`
  width: 80px;
  border-radius: 50%;
  margin-right: 10px;
`;
const StoreSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px 0px 10px;
  span {

  }
  div {
    display: flex;
    flex: 1;
  }
`;
const markerColor = (type) => {
  if (type === 'wash') return '#219EBC';
  if (type === 'dry') return '#F08137';
  return '#1C5174';
};
const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  line-height: 50px;
  margin-right: 8px;
  flex: 1;
  color: ${(props) => (markerColor(props.type))};
  & > svg {
    width: 50px;
    margin-right: 10px;
  }
`;

const CollecIcon = styled(HeartCircle)`
  width: 32px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  cursor: pointer;
  color: ${(props) => (props.like ? '#219EBC' : '#8B8C89')};
  &:hover {
    box-shadow: 0px 0px 10px #8B8C89;
  }
`;

function StoreHeader({ storeInfo, idleMachines }) {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const handleCollec = () => {
    console.log(storeInfo.store_id);
    if (!userInfo.collectIds.includes(storeInfo.store_id)) {
      const newData = [...userInfo.collectIds];
      newData.push(storeInfo.store_id);
      firebaseUsers.updateCollectIds(userInfo.user_id, newData);
    } else {
      const newData = [...userInfo.collectIds].filter((id) => id !== storeInfo.store_id);
      firebaseUsers.updateCollectIds(userInfo.user_id, newData);
    }
  };

  return (
    <StoreHeaderStyled>
      <StoreInfo>
        <Title>
          <MainImg src={DefaultstoreMainImg} alt="storeMainImg" />
          <h1>{storeInfo.store_name}</h1>
        </Title>
        <h4>{storeInfo.address}</h4>
        <h4>{storeInfo.phone}</h4>
        <CollecIcon
          like={userInfo.collectIds.includes(storeInfo.store_id)}
          onClick={handleCollec}
        />
      </StoreInfo>
      <StoreSection>
        <span>目前可使用:</span>
        <div>
          <Icon type="wash">
            <Washer />
            {idleMachines?.wash?.length}
          </Icon>
          <Icon type="dry">
            <Dryer />
            {idleMachines?.dry?.length}
          </Icon>
          <Icon type="pet">
            <Pets />
            {idleMachines?.pet?.length}
          </Icon>
        </div>
      </StoreSection>
    </StoreHeaderStyled>
  );
}
StoreHeader.propTypes = {
  storeInfo: PropTypes.shape({
    store_name: PropTypes.string.isRequired,
    store_id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  idleMachines: PropTypes.shape({
    wash: PropTypes.arrayOf().isRequired,
    dry: PropTypes.arrayOf().isRequired,
    pet: PropTypes.arrayOf().isRequired,
  }).isRequired,
};

function StorePage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const [userReserveLists, setUserReserveLists] = useState([]);
  const storeId = useLocation().search.split('=')[1];
  const [storeInfo, setStoreInfo] = useState({});
  const [machines, setMachines] = useState([]);
  const [idleMachines, setIdleMachines] = useState({});
  const [flexibleTime] = useState(3);

  const getProcessEndtime = (machineId) => firebaseProcessing.getQuery(machineId, 'machine_id')
    .then((res) => res.map((docc) => docc.data()))
    .then((data) => data[0].end_time.seconds * 1000);
  const getPrevEstimateEndTime = (reserveId) => firebaseReserve.getQuery(reserveId, 'reserve_id')
    .then((res) => res.map((docc) => docc.data()))
    .then((data) => data[0].estimate_endTime.seconds * 1000);

  const handleReserve = async (machineId, categoryIndex) => {
    const selectMachine = machines.filter((machine) => machine.machine_id === machineId)[0];
    const reserveData = {};
    const newReserveIds = [...selectMachine.reserveIds];

    if (categoryIndex === null) {
      return;
    }
    if (selectMachine.status === 0) {
      return;
    }
    if (!userInfo) {
      console.log('nononon');
    }
    reserveData.category = selectMachine.categorys[categoryIndex];
    reserveData.user_id = userInfo.user_id;
    reserveData.machine_id = selectMachine.machine_id;
    reserveData.machine_name = selectMachine.machine_name;
    reserveData.store_id = selectMachine.store_id;
    reserveData.store_name = storeInfo.store_name;
    reserveData.reserve_time = dayjs().$d;

    if (newReserveIds.length === 0) {
      const processItemEndtime = await getProcessEndtime(machineId);
      reserveData.estimate_startTime = dayjs(processItemEndtime).add(flexibleTime, 'minute').$d;
      reserveData.estimate_endTime = dayjs(reserveData.estimate_startTime).add(reserveData.category.time, 'minute').$d;
      const reserveId = firebaseReserve.post(reserveData);
      newReserveIds.push(reserveId);
      firebaseMachines.updateReserveIds(machineId, newReserveIds);
      return;
    }
    const prevEstimateEndTime = await getPrevEstimateEndTime(
      newReserveIds[newReserveIds.length - 1],
    );
    reserveData.estimate_startTime = dayjs(prevEstimateEndTime).add(flexibleTime, 'minute').$d;
    reserveData.estimate_endTime = dayjs(reserveData.estimate_startTime).add(reserveData.category.time, 'minute').$d;
    const reserveId = firebaseReserve.post(reserveData);
    newReserveIds.push(reserveId);
    firebaseMachines.updateReserveIds(machineId, newReserveIds);
  };

  const handleProcessing = async (machineId, categoryIndex) => {
    if (categoryIndex === null) {
      return;
    }
    if (!userInfo) {
      console.log('nononon');
    } else {
      firebaseReserve.getQuery(userInfo.user_id, 'user_id')
        .then((res) => res.map((docc) => docc.data()))
        .then((data) => { setUserReserveLists(data); });
    }
    const selectMachine = machines.filter((machine) => machine.machine_id === machineId)[0];
    const processingData = {};
    const checkUserReserved = userReserveLists.filter(
      (item) => item.reserve_id === selectMachine.reserveIds[0],
    );
    if (selectMachine.reserveIds[0] !== undefined
          && checkUserReserved.length === 0
    ) {
      console.log('你不是下一位餒 乖乖排隊');
      return;
    }
    processingData.category = selectMachine.categorys[categoryIndex];
    processingData.user_id = userInfo.user_id;
    processingData.machine_id = selectMachine.machine_id;
    processingData.machine_name = selectMachine.machine_name;
    processingData.store_id = selectMachine.store_id;
    processingData.store_name = storeInfo.store_name;
    processingData.start_time = dayjs().$d;
    processingData.end_time = dayjs().add(processingData.category.time, 'minute').$d;

    firebaseProcessing.post(processingData);
    firebaseMachines.updateStatus(machineId, 1);
    firebaseUsers.updatePointes(userInfo.user_id, userInfo.points - processingData.category.price);

    if (checkUserReserved.length !== 0) {
      const newReserveIds = [...selectMachine.reserveIds];
      newReserveIds.shift();
      firebaseMachines.updateReserveIds(machineId, newReserveIds);
      firebaseReserve.delet(checkUserReserved[0].reserve_id);
    }
  };

  useEffect(() => {
    firebaseStores.getOne(storeId)
      .then((res) => setStoreInfo(res));
  }, [storeId]);
  useEffect(() => {
    const handleMachinessUpdate = (newData) => {
      setMachines(newData);
      const result = handleIdleMachines(newData);
      setIdleMachines(result);
    };
    return firebaseMachines.onMachinesShot(storeId, 'store_id', handleMachinessUpdate);
  }, [storeId]);

  return (
    <>
      <Header />
      <Wrapper>
        <StoreHeader storeInfo={storeInfo} idleMachines={idleMachines} />
        <div>
          <h3>全部機台</h3>
          {machines.map((item) => (
            <MachineCard
              machine={item}
              key={item.machine_id}
              handleProcessing={handleProcessing}
              handleReserve={handleReserve}
            />
          ))}
        </div>
      </Wrapper>
    </>
  );
}

export default StorePage;

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
  handleProcessing: PropTypes.func.isRequired,
  handleReserve: PropTypes.func.isRequired,
};
