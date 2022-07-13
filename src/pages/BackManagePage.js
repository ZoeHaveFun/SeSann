/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import { PropTypes } from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import ReactSelect from 'react-select';
import { Washer, Dryer } from '@styled-icons/boxicons-solid';
import {
  Pets, AccessTime, MonetizationOn, Add,
} from '@styled-icons/material-rounded';
import { firebaseMachines, firebaseStores } from '../utils/firestore';
import AddMachineForm from '../components/AddMachineForm';

const MachinesWrapper = styled.div`
  margin-top:  20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 30px 20px;
`;
const MachineItem = styled.div`
  width: calc(100% / 3 - 14px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 20px 52px;
  align-items: center;
  box-shadow: 0px 0px 1px #8B8C89;
  border-radius: 0.8rem;
  position: relative;
`;
const MachineInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #1C5174;
  font-family: 'Noto Sans TC', sans-serif;
  border-bottom: 1px #DDE1E4 solid;
  padding-bottom: 8px;
  input {
    border-radius: 0.4rem;
    padding: 4px 8px;
    border: ${(props) => (props.isEdit ? '1px #8ECAE6 solid' : '1px #E7ECEF solid')} ;
  }
`;
const DefaultIcon = styled.span`
  color: #DDE1E4;
  display: flex;
  > svg {
    width: 30px;
    margin-right: 16px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  gap: 0px 10px;
`;
const Button = styled.button`
  width: calc(50%);
  padding: 8px;
  border: 1px #DDE1E4 solid;
  border-radius: 0.8rem;
  color: #1C5174;
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #FEFCFB;
  color: #1C5174;
  &:hover{
    background-color: ${(props) => (props.isDelet ? '#B64A41' : '#023047')} ;
    color:#FEFCFB;
    box-shadow: 0px 0px 4px #bbbec0;
  }
  &>svg{
    width: 20px;
  }
`;

const CategoryWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;
const Category = styled.div`
  margin: 8px 0px;
  display: flex;
  gap: 10px;
  label {
    display: flex;
  }
  input {
    width: 100%;
    border-radius: 0.4rem;
    padding: 4px 8px;
    border: ${(props) => (props.isEdit ? '1px #8ECAE6 solid' : '1px #E7ECEF solid')} ;
  }
  svg{
    width: 20px;
    color: #8B8C89;
    margin-right: 2px;
  }
`;
function MachineCard({ machine }) {
  const [edit, setEdit] = useState(false);
  const [machineName, setMachineName] = useState(machine.machine_name);
  const [categorys, setCategorys] = useState(machine.categorys);
  const handleCategoryChange = (e, index) => {
    const objKey = e.target.name;
    const newData = [...categorys];
    if (objKey === 'name') {
      newData[index].name = e.target.value;
    }
    if (objKey === 'price') {
      newData[index].price = Number(e.target.value);
    }
    if (objKey === 'time') {
      newData[index].time = Number(e.target.value);
    }
    setCategorys(newData);
  };
  const deletMachine = () => {
    firebaseMachines.delet(machine.machine_id);
  };
  const handleMachineEdit = () => {
    if (!edit) {
      setEdit(!edit);
      return;
    }
    const newData = { ...machine };
    newData.machine_name = machineName;
    newData.categorys = categorys;
    firebaseMachines.updateData(machine.machine_id, newData);
    setEdit(!edit);
  };

  return (
    <MachineItem>
      <MachineInfo isEdit={edit}>
        <DefaultIcon>
          {
            machine.type === 'wash' ? <Washer />
              : machine.type === 'dry' ? <Dryer />
                : <Pets />
          }
          {`TYPE ${machine.type}`}
        </DefaultIcon>

        <label htmlFor="machineName">
          機台名稱:
          <input type="text" name="machineName" value={machineName} disabled={!edit} onChange={(e) => { setMachineName(e.target.value); }} />
        </label>
      </MachineInfo>

      <CategoryWrapper>
        {
          categorys.map((category, index) => (
            <Category key={index} isEdit={edit}>
              <label htmlFor="name">
                <input type="text" name="name" value={category.name} disabled={!edit} onChange={(e) => { handleCategoryChange(e, index); }} />
              </label>
              <label htmlFor="time">
                <AccessTime />
                <input type="text" name="time" value={category.time} disabled={!edit} onChange={(e) => { handleCategoryChange(e, index); }} />
              </label>
              <label htmlFor="price">
                <MonetizationOn />
                <input type="text" name="price" value={category.price} disabled={!edit} onChange={(e) => { handleCategoryChange(e, index); }} />
              </label>
            </Category>
          ))
        }
      </CategoryWrapper>
      <ButtonWrapper>
        <Button type="button" onClick={() => { handleMachineEdit(); }}>{edit ? '完成' : '編輯'}</Button>
        <Button type="button" onClick={deletMachine} isDelet>刪除</Button>
      </ButtonWrapper>
    </MachineItem>
  );
}

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

const NavWrapper = styled.div`
  display: flex;
`;
const AddBtton = styled.button`
  background-color: #ebb12b;
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  color: #FEFCFB;
  padding: 8px 14px;
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

const FormWrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 80px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(138 139 137 / 62%);
  display: ${(props) => (props.isAdd ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
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
    border-radius: 0.8rem;
    width: 160px;
  }
  .react-select__menu {
    width: 160px;
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

const manageOptions = [
  { value: 'all', label: '全部' },
  { value: 'wash', label: '洗衣機' },
  { value: 'dry', label: '烘衣機' },
  { value: 'pet', label: '寵物專用' },
];

function BackManagePage() {
  const storeId = useContext(firebaseStores.CurrentStoreIdContext);
  const [machines, setMachines] = useState([]);
  const [selectedOption, setSelectedOption] = useState(manageOptions[0]);
  const [filterMachines, setFilterMachines] = useState([]);
  const [isAdd, setIsAdd] = useState(false);

  const handleSelectChange = (e) => {
    setSelectedOption(e);
  };
  useEffect(() => {
    if (selectedOption.value === 'all') {
      setFilterMachines(machines);
    } else {
      const filterData = machines.filter((item) => item.type === selectedOption.value);
      setFilterMachines(filterData);
    }
  }, [selectedOption, machines]);
  useEffect(() => {
    if (storeId) {
      const updateMachines = (newData) => {
        setMachines(newData);
        setFilterMachines(newData);
      };
      return firebaseMachines.onMachinesShot(storeId, 'store_id', updateMachines);
    }
    return undefined;
  }, [storeId]);
  return (
    <>
      <NavWrapper>
        <AddBtton onClick={() => { setIsAdd(!isAdd); }}>
          <Add />
          新增機台
        </AddBtton>
        <FormWrapper isAdd={isAdd}>
          <AddMachineForm storeId={storeId} setIsAdd={setIsAdd} />
        </FormWrapper>
        <CustomSelect
          classNamePrefix="react-select"
          options={manageOptions}
          value={selectedOption}
          onChange={handleSelectChange}
          placeholder="選擇店家"
        />
      </NavWrapper>
      <MachinesWrapper>
        {
        storeId && machines.length === 0 ? <h2>老闆你這家店還沒機台餒</h2>
          : filterMachines?.map?.(
            (machine) => <MachineCard machine={machine} key={machine.machine_id} />,
          )
      }
      </MachinesWrapper>
    </>
  );
}

export default BackManagePage;
