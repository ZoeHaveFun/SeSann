/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  Menu, LocalLaundryService, Map,
} from '@styled-icons/material-rounded';
import { firebaseUsers } from '../../utils/firestore';
import logo from '../../style/imgs/raccoon.svg';
import { userUrl } from '../../utils/reuseFunc';

const HeaderWrapper = styled.div`
  z-index: 10;
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-family: 'Noto Sans TC', sans-serif;
  background-color: #ffffff;
  color: #1C5174;
  box-shadow: 0px 0px 8px #0a1128;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 34px;
  color: #1C5174;
  & > img {
    width: 46px;
    margin-right: 10px;
  }
`;
const Nav = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
`;
const NavBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  margin: 0px 4px;
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 16px;
  background-color: transparent;
  border: transparent;
  color: #1C5174;
  cursor: pointer;
`;
const Icon = styled.span`
  & > svg {
    width: 20px;
  }
`;
const Login = styled.button`
  width: 80px;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  background-color: #fefcfb;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 0.8rem;
  font-size: 16px;
  color: #1C5174;
  box-shadow: 0px 0px 4px #0a1128;
  margin-left: 10px;
  &:hover {
    background-color: #ffbf69;
    color: #ffffff;
  }
`;
const BurgerWarpper = styled.div`
  padding: 10px 16px;
  box-shadow: 0px 0px 4px #0a1128;
  border-radius: 0.8rem;
  background-color: #fefcfb;
  display: flex;
  position: relative;
`;
const MenuIcon = styled(Menu)`
  width: 30px;
  transform: ${(props) => (props.click ? 'rotate(90deg)' : 'rotate(0deg)')};
  cursor: pointer;
  transition: all 0.3s;
  z-index: 9;
`;
const MenuWrapper = styled.div`
  width: 110px;
  position: absolute;
  display: flex;
  flex-direction: column;
  /* top: ${(props) => (props.open ? '80px' : '0px')};
  right: 0px; */
  top: 80px;
  right: ${(props) => (props.open ? '0px' : '-140px')};
  opacity: ${(props) => (props.open ? '1' : '0')};
  background-color: #fefcfb;
  box-shadow: 0px 0px 4px #0a1128;
  border-radius: 0.8rem;
  padding: 10px 20px;
  transition: all 0.3s;
`;
const TopWrapper = styled.div`
  display: flex;
  flex-direction: column; 
  border-bottom: 1px #E7ECEF solid;
  padding-bottom: 5px;
  & span {
    display: block;
    padding:1px 0px ;
    color: #0a1128;
    cursor: pointer;
    &:hover {
      color: #ff9f1c;
    }
  }
`;
const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  & span {
    display: block;
    padding:2px 0px ;
    color: #0a1128;
    cursor: pointer;
    &:hover {
      color: #ff9f1c;
    }
  }
  & button {
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 16px;
    padding:2px 0px ;
    text-align: start;
    color: #0a1128;
    cursor: pointer;
    &:hover {
      color: #ff9f1c;
    }
  }
`;
const UserImg = styled.img`
  width: 30px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 50%;
  box-shadow: 0px 0px 2px #999;
`;

function Header() {
  const userInfo = useContext(firebaseUsers.AuthContext);
  const [menuOpen, serMenuOpen] = useState(false);
  const navegate = useNavigate();
  const Logout = () => {
    firebaseUsers.signOut();
    navegate('/', { replace: true });
  };
  return (
    <HeaderWrapper>
      <Link to="/">
        <Logo>
          <img alt="logo" src={logo} />
          SéSann
        </Logo>
      </Link>

      <Nav>
        <Link to="/?to=about">
          <NavBtn type="button">關於SéSann</NavBtn>
        </Link>
        <Link to="/?to=map">
          <NavBtn type="button">
            找一找
            <Icon><Map /></Icon>
          </NavBtn>
        </Link>
        <Link to="/?to=join">
          <NavBtn type="button">
            我要加入
            <Icon><LocalLaundryService /></Icon>
          </NavBtn>
        </Link>
        {
          !userInfo
            ? (
              <Link to="/login">
                <Login>Login</Login>
              </Link>
            )
            : (
              <BurgerWarpper>
                <UserImg src={userUrl('5', '6208b76f-6e08-401c-9d10-229da596cce7')} />
                <MenuWrapper open={menuOpen}>
                  <TopWrapper>
                    <Link to="/user/processing"><span>進行中</span></Link>
                    <Link to="/user/reserve"><span>預約中</span></Link>
                    <Link to="/user/orders"><span>全部訂單</span></Link>
                    <Link to="/user/collect"><span>收藏店家</span></Link>
                  </TopWrapper>
                  <BottomWrapper>
                    <Link to="/user">
                      <span>我的帳戶</span>
                    </Link>
                    {
                    userInfo.storeIds?.length !== 0
                      ? (
                        <Link to="/store/backstage">
                          <span>我的店家</span>
                        </Link>
                      ) : ('')
                  }
                    <button type="button" onClick={Logout}>登出</button>
                  </BottomWrapper>
                </MenuWrapper>
                <MenuIcon onClick={() => serMenuOpen(!menuOpen)} click={menuOpen} />
              </BurgerWarpper>
            )
        }
      </Nav>
    </HeaderWrapper>
  );
}

export default Header;
