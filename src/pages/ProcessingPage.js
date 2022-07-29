/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { firebaseProcessing, firebaseUsers } from '../utils/firestore';
import { ProcessinfList } from '../components/List';
import { initialData } from '../utils/reuseFunc';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0px;
`;
const Message = styled.h3`
  width: 100%;
  box-shadow: 0px 0px 8px #e7ecef;
  border-radius: 0.8rem;
  padding: 20px 0px;
  color: #bec5c9;
  text-align: center;
  font-size: 18px;
`;
function ProcessingPage() {
  const [process, setProcess] = useState([]);
  const userInfo = useContext(firebaseUsers.AuthContext);
  const userId = userInfo.user_id;
  const navegate = useNavigate();

  const getProcessing = () => {
    const handleProcessUpdate = (newData) => {
      setProcess(newData);
      initialData('processing', newData);
    };
    return firebaseProcessing.onProcessingShot(userId, 'user_id', handleProcessUpdate);
  };
  useEffect(() => {
    if (userId) {
      getProcessing();
    } else {
      navegate('/', { replace: true });
    }
  }, [userId]);
  return (
    <Wrapper>
      {
        process.length === 0 ? (
          <Message>
            “你覺得你適合穿什麼衣服”
            <br />
            “好看的衣服？”
            <br />
            “不，是被我征服”
          </Message>
        )
          : process?.map?.((item) => <ProcessinfList item={item} key={item.process_id} />)
      }
    </Wrapper>
  );
}
export default ProcessingPage;
