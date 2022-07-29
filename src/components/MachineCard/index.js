/* eslint-disable no-nested-ternary */
import {
  useEffect, useState,
} from 'react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components/macro';
import { Washer, Dryer } from '@styled-icons/boxicons-solid';
import {
  Pets, AccessTime, MonetizationOn, SettingsPower, CalendarToday,
} from '@styled-icons/material-rounded';
import { firebaseReserve } from '../../utils/firestore';
import '../../style/css/StorePage.css';

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
  border: ${(props) => (props.light ? '1px #FDBF31 solid' : '')};
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
  > span {

  }
`;
const DefaultIcon = styled.span`
  color: #DDE1E4;
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
  cursor: ${(props) => (props.isProcessing || props.notAllow ? 'not-allowed' : 'pointer')};
  background-color: ${(props) => (props.isProcessing || props.notAllow ? '#E7ECEF' : '#FEFCFB')};
  color: ${(props) => (props.isProcessing || props.notAllow ? '#8B8C89' : '#1C5174')};
  &:hover{
    background-color: ${(props) => (props.isProcessing || props.notAllow ? '#E7ECEF' : '#023047')};
    color: ${(props) => (props.isProcessing || props.notAllow ? '#8B8C89' : '#FEFCFB')};
    box-shadow: ${(props) => (props.isProcessing || props.notAllow ? '' : '0px 0px 4px #bbbec0')};
  }
  &>svg{
    width: 20px;
  }
`;
const ReserveDiv = styled.div`
  position: absolute;
  bottom: 10px;
  left: 22px;
  height: 36px;
  font-size: 12px;
  color: #8B8C89;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans TC', sans-serif;
`;
const CategoryBtn = styled(Button)`
  width: 100%;
  padding: 8px 10px;
  margin: 0px;
  background-color: ${(props) => (props.isSelected ? '#FFB703' : '')};
  display: flex;
  color: #1C5174;
  >span{
    flex: 1;
  }
  &:hover{
    color: #FEFCFB;
    box-shadow: 0px 0px 4px #999;
    background-color: #8B8C89;
  }
`;
const NameSpan = styled.span`
`;
const TimeSpan = styled.span`
  display: flex;
  align-items: center;
  margin-left: calc(100% / 6);
  &>svg {
    width: 20px;
    margin-right: 4px;
  }
`;
const PriceSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  &>svg {
    width: 20px;
    margin-right: 4px;
  }
`;
const CategoryWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
`;
function MachineCard({
  machine, handleProcessing, handleReserve, remindMachineId,
}) {
  const [categoryIndex, setCategoryIndex] = useState();
  const [reverveList, setReverveList] = useState([]);
  const totalTime = () => reverveList.reduce((pre, current) => pre + current.category.time, 0);

  const clickCategory = (idx) => {
    if (idx === categoryIndex) {
      setCategoryIndex(null);
    } else {
      setCategoryIndex(idx);
    }
  };
  useEffect(() => {
    const handleReserveUpdate = (newData) => {
      setReverveList(newData);
    };
    return firebaseReserve.onReserveShot(machine.machine_id, 'machine_id', handleReserveUpdate);
  }, [machine.machine_id]);

  return (
    <MachineItem
      className={remindMachineId === machine.machine_id ? 'light' : ''}
      light={remindMachineId === machine.machine_id}
    >
      <MachineInfo>
        <DefaultIcon>
          {
            machine.type === 'wash' ? <Washer />
              : machine.type === 'dry' ? <Dryer />
                : <Pets />
          }
        </DefaultIcon>
        <span>{machine.machine_name}</span>
      </MachineInfo>
      <CategoryWrapper>
        {
          machine.categorys.map((category, idx) => (
            <CategoryBtn
              onClick={() => clickCategory(idx)}
              key={category.name}
              isSelected={categoryIndex === idx}
            >
              <NameSpan>
                {category.name}
              </NameSpan>
              <TimeSpan>
                <AccessTime />
                {category.time}
              </TimeSpan>
              <PriceSpan>
                <MonetizationOn />
                {category.price}
              </PriceSpan>
            </CategoryBtn>
          ))
        }
      </CategoryWrapper>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={() => {
            handleReserve(machine.machine_id, categoryIndex);
            setCategoryIndex('');
          }}
          notAllow={!machine.status}
        >
          <CalendarToday />
          預約
        </Button>
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
                <SettingsPower />
                啟動
              </Button>
            )
            : <Button type="button" isProcessing>運轉中</Button>
        }
      </ButtonWrapper>
      <ReserveDiv>
        <span>
          {`預約人數:${reverveList.length}`}
        </span>
        {reverveList.length !== 0 ? <span>{`等待時間:${totalTime()}分鐘`}</span> : ''}
      </ReserveDiv>
    </MachineItem>
  );
}

export default MachineCard;

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
  remindMachineId: PropTypes.string,
};

MachineCard.defaultProps = {
  remindMachineId: '',
};
