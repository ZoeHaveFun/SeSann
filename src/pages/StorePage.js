import {
  useEffect, useState, useContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import { Washer, Dryer, HeartCircle } from '@styled-icons/boxicons-solid';
import { Pets } from '@styled-icons/material-rounded';
import Swal from 'sweetalert2';
import {
  firebaseMachines, firebaseStores, firebaseProcessing, firebaseReserve, firebaseUsers,
} from '../utils/firestore';
import { handleIdleMachines } from '../utils/reuseFunc';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MachineCard from '../components/MachineCard';
import DefaultstoreMainImg from '../style/imgs/storeMainImg.jpg';
import { Toast } from '../components/Alert';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

const Wrapper = styled.div`
  padding-top: 100px;
`;
const MachinesWrapper = styled.div`
  margin-top:  20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 30px 20px;
`;

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
  margin-right: 20px;
  border-radius: 0.8rem;
  padding: 16px 22px 10px;
  color: #1C5174;
  box-shadow: 0px 0px 8px #8B8C89;
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
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  > span {
    padding-left: 10px;
  }
  > span:nth-child(2) {
    background-color: #DDE1E4;
    margin: 4px 0px 0px 10px;
    padding: 1px 8px;
  }
  div {
    display: flex;
    flex: 1;
    padding: 24px 0px 24px 6px;
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
  margin-right: 16px;
  color: ${(props) => (markerColor(props.type))};
  &+& {
    border-left: 1.8px #E7ECEF solid;
    padding-left: 16px;
  }
  & > svg {
    width: 50px;
    margin-right: 10px;
  }
`;

const CollecIcon = styled(HeartCircle)`
  width: 32px;
  position: absolute;
  right: 14px;
  top: 14px;
  border-radius: 50%;
  cursor: pointer;
  color: ${(props) => (props.like ? '#b64a41' : '#8B8C89')};
  &:hover {
    box-shadow: 0px 0px 10px #8B8C89;
  }
`;

function StoreHeader({ storeInfo, idleMachines }) {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const handleCollec = () => {
    if (!userInfo) {
      Toast.fire({
        icon: 'warning',
        title: '請先登入喔',
      });
      return;
    }

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
          like={userInfo?.collectIds?.includes(storeInfo.store_id)}
          onClick={handleCollec}
        />
      </StoreInfo>
      <StoreSection>
        <span>目前可使用:</span>
        <span />
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
    store_name: PropTypes.string,
    store_id: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  idleMachines: PropTypes.shape({
    wash: PropTypes.arrayOf(PropTypes.shape({})),
    dry: PropTypes.arrayOf(PropTypes.shape({})),
    pet: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

const Container = styled.div`
  width: 80%;
  margin: auto;
`;
const TagWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-family: 'Noto Sans TC', sans-serif;
  color: #1C5174;
`;
const Tag = styled.span`
  padding: 8px 16px;
  box-shadow: 0px 0px 2px #8B8C89;
  border-radius: 20px;
  background-color: ${(props) => (props.isSelect ? '#FFB703' : '#FEFCFB')};
  cursor: pointer;
  &+&{
    margin-left: 20px;
  }
  &:hover {
    background-color: #8B8C89;
    color: #E7ECEF;
  }
`;

function StorePage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const storeId = useLocation().search.split(/[= ?\s+]/)[2];
  const remindMachineId = useLocation().search.split(/[= ?\s+]/)[4];
  const [userReserveLists, setUserReserveLists] = useState([]);
  const [storeInfo, setStoreInfo] = useState({});
  const [machines, setMachines] = useState([]);
  const [filterMachines, setFilterMachines] = useState([]);
  const [tag, setTag] = useState('all');
  const [idleMachines, setIdleMachines] = useState({});
  const [flexibleTime] = useState(3);

  const ChangeTag = (e) => {
    if (e.target.attributes[0].nodeName !== 'data-tag') return;
    const tagValue = e.target.attributes[0].value;
    setTag(tagValue);
  };
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
    if (!userInfo) {
      Toast.fire({
        icon: 'warning',
        title: '請先登入喔',
      });
      return;
    }
    if (selectMachine.status === 0) {
      Toast.fire({
        icon: 'warning',
        title: '請直接啟動機台喔',
      });
      return;
    }
    if (typeof categoryIndex !== 'number') {
      Toast.fire({
        icon: 'warning',
        title: '請選擇洗滌項目喔',
      });
      return;
    }
    const reserveSameMachine = userReserveLists.filter((list) => list.machine_id === machineId);
    if (reserveSameMachine.length === 2) {
      Toast.fire({
        icon: 'error',
        title: '一個機台最多預約兩筆喔',
      });
      return;
    }
    if (reserveSameMachine.length > 0) {
      Swal.fire({
        title: '確定要再次預約嗎?',
        text: '我們發現您在這個機台已有一筆預約囉',
        icon: 'info',
        showCancelButton: true,
        customClass: {
          popup: 'secondReserve',
        },
        cancelButtonText: '我再想想',
        confirmButtonText: '是的,我要預約',
      }).then(async (result) => {
        if (result.isConfirmed === false) return;
        reserveData.category = selectMachine.categorys[categoryIndex];
        reserveData.user_id = userInfo.user_id;
        reserveData.machine_id = selectMachine.machine_id;
        reserveData.machine_name = selectMachine.machine_name;
        reserveData.store_id = selectMachine.store_id;
        reserveData.store_name = storeInfo.store_name;
        reserveData.reserve_time = dayjs().$d;

        const prevEstimateEndTime = await getPrevEstimateEndTime(
          newReserveIds[newReserveIds.length - 1],
        );
        reserveData.estimate_startTime = dayjs(prevEstimateEndTime).add(flexibleTime, 'minute').$d;
        reserveData.estimate_endTime = dayjs(reserveData.estimate_startTime).add(reserveData.category.time, 'minute').$d;
        const reserveId = firebaseReserve.post(reserveData);
        newReserveIds.push(reserveId);
        firebaseMachines.updateReserveIds(machineId, newReserveIds);

        Swal.fire(
          '您已預約機台囉',
          '可以到預約中查看預約狀態',
          'success',
        );
      });
      return;
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

      Toast.fire({
        icon: 'success',
        title: '您已預約機台囉',
      });
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

    Toast.fire({
      icon: 'success',
      title: '您已預約機台囉',
    });
  };

  const handleProcessing = async (machineId, categoryIndex) => {
    if (!userInfo) {
      Toast.fire({
        icon: 'warning',
        title: '請先登入喔',
      });
      return;
    }
    if (typeof categoryIndex !== 'number') {
      Toast.fire({
        icon: 'warning',
        title: '請選擇洗滌項目',
      });
      return;
    }
    const selectMachine = machines.filter((machine) => machine.machine_id === machineId)[0];
    const processingData = {};
    const checkUserReserved = userReserveLists.filter(
      (item) => item.reserve_id === selectMachine.reserveIds[0],
    );
    if (selectMachine.reserveIds[0] !== undefined
          && checkUserReserved.length === 0
    ) {
      Toast.fire({
        icon: 'warning',
        title: '拍謝~您不是下一位預約者喔',
      });
      return;
    }

    Swal.fire({
      title: '確定付款啟動嗎?',
      text: `您的點數 ${userInfo.points}`,
      icon: 'info',
      showCancelButton: true,
      customClass: {
        popup: 'secondReserve',
      },
      cancelButtonText: '我再想想',
      confirmButtonText: '是的,我要啟動',
    }).then(async (result) => {
      if (result.isConfirmed === false) return;
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
      firebaseUsers.updatePointes(
        userInfo.user_id,
        userInfo.points - processingData.category.price,
      );
      if (checkUserReserved.length !== 0) {
        const newReserveIds = [...selectMachine.reserveIds];
        newReserveIds.shift();
        firebaseMachines.updateReserveIds(machineId, newReserveIds);
        firebaseReserve.delet(checkUserReserved[0].reserve_id);
      }
      Swal.fire(
        '您已啟動機台囉',
        '可以到進行中查看剩餘時間',
        'success',
      );
    });
  };
  useEffect(() => {
    if (userInfo?.user_id) {
      const updateUserReserve = (data) => {
        setUserReserveLists(data);
      };
      return firebaseReserve.onReserveShot(userInfo.user_id, 'user_id', updateUserReserve);
    }
    return undefined;
  }, [userInfo]);
  useEffect(() => {
    if (tag === 'all') {
      setFilterMachines(machines);
    } else {
      const filterM = machines.filter((machine) => machine.type === tag);
      setFilterMachines(filterM);
    }
  }, [machines, tag]);
  useEffect(() => {
    firebaseStores.getOne(storeId)
      .then((res) => setStoreInfo(res));
  }, [storeId]);
  useEffect(() => {
    const handleMachinessUpdate = (newData) => {
      setMachines(newData);
      setFilterMachines(newData);
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
        <Container>
          <TagWrapper onClick={(e) => { ChangeTag(e); }}>
            <Tag data-tag="all" isSelect={tag === 'all'}>全部</Tag>
            <Tag data-tag="wash" isSelect={tag === 'wash'}>洗衣</Tag>
            <Tag data-tag="dry" isSelect={tag === 'dry'}>烘衣</Tag>
            <Tag data-tag="pet" isSelect={tag === 'pet'}>寵物專用</Tag>
          </TagWrapper>
          <MachinesWrapper>
            {filterMachines.length === 0 ? <p>沒有餒~</p>
              : filterMachines.map((item) => (
                <MachineCard
                  remindMachineId={remindMachineId}
                  machine={item}
                  key={item.machine_id}
                  handleProcessing={handleProcessing}
                  handleReserve={handleReserve}
                />
              ))}
          </MachinesWrapper>
        </Container>
      </Wrapper>
      <Footer />
    </>
  );
}

export default StorePage;
