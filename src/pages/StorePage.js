import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import {
  firebaseMachines, firebaseStores, firebaseReserve, firebaseProcessing,
} from '../firestore';

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
  cursor: pointer;
  &:hover{
    box-shadow: 0px 0px 4px #999;
  }
`;
const CategoryBtn = styled(Button)`
  padding: 4px 8px;
  flex: 1;
  height: 40px;
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

function Category({ category, handleCategory, idx }) {
  return (
    <CategoryBtn onClick={() => handleCategory(idx)}>
      {`${category.name} ${category.time}分鐘 ${category.price}元`}
    </CategoryBtn>
  );
}

function MachineCard({ machine }) {
  // const [nowCategory, setNowCategory] = useState();
  const [categoryIndex, setCategoryIndex] = useState();
  const getStoreName = (storeId) => firebaseStores.getOne(storeId)
    .then((doc) => {
      const storeName = doc.store_name;
      return storeName;
    });

  const handleReserve = (e) => {
    if (!categoryIndex) {
      return;
    }
    setCategoryIndex('');
    const MachineId = e.target.parentElement.id;
    const reserveData = {};
    firebaseMachines.getOne(MachineId)
      .then((res) => {
        reserveData.category = res.categorys[categoryIndex];
        reserveData.machine_id = MachineId;
        reserveData.machine_name = res.machine_name;
        reserveData.user_id = 'mVJla3AyVysvFzWzUSG5';
        reserveData.user_name = '阿辰';
        reserveData.reserve_time = Date.now();
        return getStoreName(res.store_id).then((value) => {
          reserveData.store_name = value;
          return reserveData;
        });
      })
      .then((data) => firebaseReserve.post(data));
  };

  const handleProcessing = (e) => {
    if (!categoryIndex) {
      return;
    }

    setCategoryIndex('');
    const MachineId = e.target.parentElement.id;
    const processingData = {};
    firebaseMachines.getOne(MachineId)
      .then((res) => {
        const time = new Date();
        const startTime = time.getTime();
        const endTime = time.setTime(startTime + res.categorys[categoryIndex].time * 1000 * 60);
        processingData.category = res.categorys[categoryIndex];
        processingData.user_id = 'mVJla3AyVysvFzWzUSG5';
        processingData.start_time = startTime;
        processingData.end_time = endTime;
        processingData.machine_id = MachineId;
        processingData.machine_name = res.machine_name;

        return getStoreName(res.store_id).then((value) => {
          processingData.store_name = value;
          return processingData;
        });
      })
      .then((data) => firebaseProcessing.post(data));
  };

  const handleCategory = (index) => {
    setCategoryIndex(index);
  };
  return (
    <MachineWrapper>
      <span>{machine.machine_name}</span>
      <CategoryWrapper>
        {
          machine.categorys.map((item, idx) => (
            <Category
              category={item}
              key={item.name}
              handleCategory={handleCategory}
              idx={idx}
            />
          ))
        }
      </CategoryWrapper>
      <EffectWrapper id={machine.machine_id}>
        <Button type="button" onClick={(e) => handleProcessing(e)}>付款啟動</Button>
        <Button type="button" onClick={(e) => handleReserve(e)}>即時預訂</Button>
      </EffectWrapper>
    </MachineWrapper>
  );
}

function StorePage() {
  const storeId = useLocation().search.split('=')[1];
  const [storeInfo, setStoreInfo] = useState({});
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    firebaseStores.getOne(storeId)
      .then((res) => setStoreInfo(res));
  }, [storeId]);
  useEffect(() => {
    firebaseMachines.getQuery(storeId, 'store_id')
      .then((res) => res.map((item) => item.data()))
      .then((data) => setMachines(data));
  }, [storeId]);
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
        {machines.map((item) => <MachineCard machine={item} key={item.machine_id} />)}
      </div>
    </>
  );
}

export default StorePage;

Category.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
  }).isRequired,
  handleCategory: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
};

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

AddMachine.propTypes = {
  storeId: PropTypes.string.isRequired,
};
