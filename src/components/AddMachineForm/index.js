import { useRef } from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { Close, CheckCircleOutline } from '@styled-icons/material-rounded';
import { firebaseMachines } from '../../utils/firestore';

const washCategorys = [
  {
    name: '快洗',
    time: 0.5,
    price: 50,
  },
  {
    name: '標準洗',
    time: 1,
    price: 60,
  },
  {
    name: '柔洗',
    time: 1,
    price: 70,
  },
];
const dryCategorys = [
  {
    name: '微微烘',
    time: 0.5,
    price: 50,
  },
  {
    name: '標準烘',
    time: 1,
    price: 60,
  },
  {
    name: '超級烘',
    time: 1,
    price: 70,
  },
];
const petCategorys = [
  {
    name: '髒',
    time: 0.5,
    price: 60,
  },
  {
    name: '很髒',
    time: 1,
    price: 70,
  },
  {
    name: '超級髒',
    time: 1,
    price: 80,
  },
];

const Wrapper = styled.div`
  background-color: #FEFCFB;
  position: relative;
  padding: 30px 24px 20px;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 4px #8B8C89;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #1C5174;
  &>h3 {
    width: 100%;
    text-align: center;
    margin-bottom: 12px;
  }
  ul {
    font-size: 16px;
    font-family: 'Noto Sans TC', sans-serif;
    margin-bottom: 16px;
  }
`;
const CloseBtn = styled.span`
  position: absolute;
  right: 20px;
  top: 16px;
  cursor: pointer;
  padding: 3px;
  display: flex;
  border-radius: 50%;
  &:hover {
    background-color: #B64A41;
    color: #FEFCFB;
  }
  &>svg{
    width: 20px;
  }
`;
const Button = styled.button`
  background-color: #ebb12b;
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  color: #FEFCFB;
  padding: 6px 14px;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px #DDE1E4;
  cursor: pointer;
  &:hover{
    color: #1C5174;
    background-color: #FEFCFB;
    box-shadow: 0px 0px 2px 1px #1C5174;
  }
  >svg{
    width: 20px;
  }
`;

function AddMachineForm({ storeId, setIsAdd }) {
  const machineNameRef = useRef(null);
  const machineTypeRef = useRef(null);

  const handlePostMachine = () => {
    if (!machineNameRef.current.value || !machineTypeRef.current.value) return;
    const postData = {
      status: 0,
    };
    postData.machine_name = machineNameRef.current.value;
    postData.type = machineTypeRef.current.value;
    postData.reserveIds = [];
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
    <Wrapper>
      <CloseBtn onClick={() => { setIsAdd(false); }}>
        <Close />
      </CloseBtn>
      <h3>新增機台</h3>
      <ul>
        <li>
          機台名稱:
          <input type="text" ref={machineNameRef} />
        </li>
        <li>
          機台類型:
          <select ref={machineTypeRef}>
            <option value="">選擇機台類型</option>
            <option value="wash">洗衣</option>
            <option value="dry">烘衣</option>
            <option value="pet">寵物專用</option>
          </select>
        </li>
        {/* <li>
          選項模板:
          <select ref={machineCategorysRef}>
            <option value="">選項模板</option>
          </select>
        </li> */}
      </ul>
      <Button type="button" onClick={handlePostMachine}>
        <CheckCircleOutline />
        確定
      </Button>
    </Wrapper>
  );
}

AddMachineForm.propTypes = {
  storeId: PropTypes.string.isRequired,
  setIsAdd: PropTypes.func.isRequired,
};

export default AddMachineForm;
