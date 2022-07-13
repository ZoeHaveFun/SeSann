import { useContext, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Washer, Dryer } from '@styled-icons/boxicons-solid';
import { Pets } from '@styled-icons/material-rounded';
import { firebaseUsers, firebaseStores, firebaseMachines } from '../utils/firestore';
import DefaultstoreMainImg from '../style/imgs/storeMainImg.jpg';
import { handleIdleMachines } from '../utils/reuseFunc';

const CardWrapper = styled.div`
  width: calc(100% / 3 - 20px);
  display: flex;
  flex-direction: row;
  box-shadow: 0px 0px 4px #8B8C89;
  padding: 16px 20px ;
  border-radius: 0.8rem;
  background-color: #FEFCFB;
`;
const MainImg = styled.img`
  width: 100px;
`;
const StoreInfo = styled.div`
  width: 200px;
  padding-left: 16px;
  border-left: 1px #8B8C89 solid;
  font-family: 'Noto Sans TC', sans-serif;
  color: #023047;
  h1 {
    font-size: 20px;
  }
  div {
    display: flex;

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
    width: 30px;
    margin-right: 10px;
  }
`;

function CollectCard({ storeInfo }) {
  const [idleMachines, setIdleMachines] = useState({});
  useEffect(() => {
    const handleMachinessUpdate = (newData) => {
      const result = handleIdleMachines(newData);
      setIdleMachines(result);
    };
    return firebaseMachines.onMachinesShot(storeInfo.store_id, 'store_id', handleMachinessUpdate);
  }, [storeInfo.store_id]);

  return (
    <CardWrapper>
      <MainImg src={DefaultstoreMainImg} alt="storeMainImg" />
      <StoreInfo>
        <h1>{storeInfo.store_name}</h1>
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
        <Link to={`/store?store_id=${storeInfo.store_id}`}>
          前往店家
        </Link>
      </StoreInfo>
    </CardWrapper>
  );
}
CollectCard.propTypes = {
  storeInfo: PropTypes.shape({
    store_name: PropTypes.string.isRequired,
    store_id: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

`;

function CollectPage() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const [collectStores, setCollectStores] = useState([]);
  useEffect(() => {
    firebaseStores.collectQuery(userInfo.collectIds, 'store_id')
      .then((res) => res.map((docc) => docc.data()))
      .then((data) => { setCollectStores(data); });
  }, [userInfo]);
  return (
    <Wrapper>
      {
         collectStores?.map?.((store) => <CollectCard storeInfo={store} key={store.store_id} />)
      }
    </Wrapper>
  );
}
export default CollectPage;
