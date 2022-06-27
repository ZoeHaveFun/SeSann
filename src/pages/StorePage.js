/* eslint-disable no-console */
import {
  useEffect, useRef, useState,
} from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import {
  firebaseMachines, firebaseStores, firebaseProcessing, firebaseReserve, firebaseUsers,
} from '../firestore';

const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

function AddMachine({ storeId }) {
  const machineNameRef = useRef(null);
  const machineTypeRef = useRef(null);
  const washCategorys = [
    {
      name: '快洗',
      time: 31,
      price: 50,
    },
    {
      name: '標準洗',
      time: 35,
      price: 60,
    },
    {
      name: '柔洗',
      time: 41,
      price: 70,
    },
  ];
  const dryCategorys = [
    {
      name: '微微烘',
      time: 30,
      price: 50,
    },
    {
      name: '標準烘',
      time: 36,
      price: 60,
    },
    {
      name: '超級烘',
      time: 42,
      price: 70,
    },
  ];
  const petCategorys = [
    {
      name: '髒',
      time: 30,
      price: 60,
    },
    {
      name: '很髒',
      time: 36,
      price: 70,
    },
    {
      name: '超級髒',
      time: 42,
      price: 80,
    },
  ];
  const handlePostMachine = () => {
    if (!machineNameRef.current.value || !machineTypeRef.current.value) return;
    const postData = {
      status: 0,
    };
    postData.machine_name = machineNameRef.current.value;
    postData.type = machineTypeRef.current.value;
    postData.store_id = storeId;
    if (postData.type === 'wash') {
      postData.categorys = washCategorys;
    } else if (postData.type === 'dry') {
      postData.categorys = dryCategorys;
    } else { postData.categorys = petCategorys; }

    machineNameRef.current.value = '';
    machineTypeRef.current.value = '';

    firebaseMachines.post(postData);
  };
  return (
    <div>
      <h3>新增機台</h3>
      <ul>
        <li>
          機台名稱:
          <input type="text" ref={machineNameRef} />
        </li>
        <li>
          類型:
          <select ref={machineTypeRef}>
            <option value="">選擇機台類型</option>
            <option value="wash">洗衣</option>
            <option value="dry">烘衣</option>
            <option value="pet">寵物專用</option>
          </select>
        </li>
      </ul>
      <button type="button" onClick={handlePostMachine}>新增</button>
    </div>
  );
}

const MachineWrapper = styled.div`
  display: flex;
  padding: 10px 20px;
  margin: 10px 20px;
  border-bottom: 1px #333 solid;
  align-items: center;
`;
const Button = styled.button`
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

function StorePage() {
  const [userId] = useState(localStorage.getItem('userId'));
  const [userReserveLists, setUserReserveLists] = useState([]);
  const storeId = useLocation().search.split('=')[1];
  const [storeInfo, setStoreInfo] = useState({});
  const [machines, setMachines] = useState([]);
  const [flexibleTime] = useState(5);

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
    reserveData.category = selectMachine.categorys[categoryIndex];
    reserveData.user_id = 'mVJla3AyVysvFzWzUSG5';
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

    const selectMachine = machines.filter((machine) => machine.machine_id === machineId)[0];
    const processingData = {};
    const checkUserReserved = userReserveLists.filter(
      (item) => item.reserve_id === selectMachine.reserveIds[0],
    );

    if (selectMachine.reserveIds[0] !== undefined
          && checkUserReserved.length === 0
    ) {
      console.log('你不是下一位餒 乖乖排隊');
    }
    processingData.category = selectMachine.categorys[categoryIndex];
    processingData.user_id = 'mVJla3AyVysvFzWzUSG5';
    processingData.machine_id = selectMachine.machine_id;
    processingData.machine_name = selectMachine.machine_name;
    processingData.store_id = selectMachine.store_id;
    processingData.store_name = storeInfo.store_name;
    processingData.start_time = dayjs().$d;
    processingData.end_time = dayjs().add(processingData.category.time, 'minute').$d;

    firebaseProcessing.post(processingData);
    firebaseMachines.updateStatus(machineId, 1);
    firebaseUsers.updatePointes(userId, processingData.category.price);

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
    };
    return firebaseMachines.onMachinesShot(storeId, 'store_id', handleMachinessUpdate);
  }, [storeId]);
  useEffect(() => {
    const handleUserReserve = (newData) => {
      setUserReserveLists(newData);
    };
    return firebaseReserve.onReserveShot(userId, 'user_id', handleUserReserve);
  }, [userId]);

  return (
    <>
      <Link to="/">回到首頁</Link>
      <h1>店家主頁</h1>
      <div>
        <h5>{`${storeInfo.store_name} ${storeInfo.address} ${storeInfo.phone}`}</h5>
      </div>
      <AddMachine storeId={storeId} />
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
AddMachine.propTypes = {
  storeId: PropTypes.string.isRequired,
};
