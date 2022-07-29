import { useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { Close, CheckCircleOutline } from '@styled-icons/material-rounded';
import ReactSelect from 'react-select';
import { firebaseMachines } from '../../utils/firestore';
import { Toast } from '../Alert';

const washCategorys = [
  {
    name: '快洗',
    time: 32,
    price: 50,
  },
  {
    name: '標準洗',
    time: 42,
    price: 60,
  },
  {
    name: '柔洗',
    time: 56,
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
    time: 40,
    price: 60,
  },
  {
    name: '超級烘',
    time: 50,
    price: 70,
  },
];
const petCategorys = [
  {
    name: '髒',
    time: 32,
    price: 60,
  },
  {
    name: '很髒',
    time: 42,
    price: 70,
  },
  {
    name: '超級髒',
    time: 56,
    price: 80,
  },
];
const typeOptions = [
  { value: 'wash', label: '洗衣機' },
  { value: 'dry', label: '烘衣機' },
  { value: 'pet', label: '寵物專用' },
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
  label {
    display: flex;
  }
  input {
    flex: 1;
    border-radius: 0.4rem;
    padding: 4px 8px;
    margin-left: 8px;
    border: 1px #8ECAE6 solid;
  }
  >div {

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
const Title = styled.h2`
  width: 100%;
  text-align: center;
  margin-bottom: 12px;
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 500;
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
const TypeSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px 0 20px;
`;
const TypeSelect = styled(ReactSelect)`
  border-radius: 0.8rem;
  flex: 1;
  margin-left: 8px;
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 14px;
  color: #023047;
  border-radius: 1rem;
  .react-select__control {
    border-radius: 0.8rem;
  }
  .react-select__menu {
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

function AddMachineForm({ storeId, setIsAdd }) {
  const machineNameRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(typeOptions[0]);

  const handleSelectChange = (e) => {
    setSelectedOption(e);
  };
  const handlePostMachine = () => {
    if (!machineNameRef.current.value) return;
    const postData = {
      status: 0,
    };
    postData.machine_name = machineNameRef.current.value;
    postData.type = selectedOption.value;
    postData.reserveIds = [];
    postData.store_id = storeId;
    if (postData.type === 'wash') {
      postData.categorys = washCategorys;
    } else if (postData.type === 'dry') {
      postData.categorys = dryCategorys;
    } else { postData.categorys = petCategorys; }

    machineNameRef.current.value = '';

    firebaseMachines.post(postData);
    setIsAdd(false);

    Toast.fire({
      icon: 'success',
      title: '新增成功',
    });
  };
  return (
    <Wrapper>
      <CloseBtn onClick={() => { setIsAdd(false); }}>
        <Close />
      </CloseBtn>
      <Title>新增機台</Title>
      <label htmlFor="machineName">
        機台名稱:
        <input type="text" name="machineName" ref={machineNameRef} />
      </label>

      <TypeSelectWrapper>
        機台類型:
        <TypeSelect
          classNamePrefix="react-select"
          options={typeOptions}
          value={selectedOption}
          onChange={handleSelectChange}
          placeholder="選擇類型"
        />
      </TypeSelectWrapper>
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
