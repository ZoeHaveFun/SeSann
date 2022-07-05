import { useRef } from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { firebaseMachines } from '../../utils/firestore';

const Button = styled.button`
  border: 1px #00072d solid;
  padding: 8px 12px;
  border-radius: 0.8rem;
  cursor: pointer;
`;

function AddMachineForm({ storeId }) {
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
    <div>
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
      <Button type="button" onClick={handlePostMachine}>新增</Button>
    </div>
  );
}

AddMachineForm.propTypes = {
  storeId: PropTypes.string.isRequired,
};

export default AddMachineForm;
