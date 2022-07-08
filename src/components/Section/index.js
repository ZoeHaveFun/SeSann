import styled from 'styled-components/macro';
import { PropTypes } from 'prop-types';
import useWeb from '../../style/imgs/useWeb.jpg';
import scanQrCode from '../../style/imgs/scanQrCode.png';
import laundryMap from '../../style/imgs/laundryMap.jpg';
import doLaundry from '../../style/imgs/doLaundry.jpg';
// import loading from '../../style/imgs/loading.gif';

const Banner = styled.div`
  background-image: url(${(props) => props.img});
  background-position: center;
  background-size: contain;
  background-repeat: ${(props) => (props.isFirst ? 'repeat' : 'no-repeat')};

  width: 100vw;
  height: 100vh;
  ${(props) => (props.isFirst ? 'padding-top: 80px;' : 'padding: 100px 50px 40px 50px;')}
  
`;
// const LoadingImg = styled.img`
//   width: 50px;
// `;
// const LoadingDiv = styled.div`
//   width: 50px;
//   background-image: url(${(props) => props.src});
// `;

function FirstBanner({ FirstBannerRef }) {
  return (
    <>
      <Banner ref={FirstBannerRef} img={doLaundry} isFirst />
      {/* <LoadingImg src={loading} /> */}
    </>
  );
}
FirstBanner.propTypes = {
  FirstBannerRef: PropTypes.func.isRequired,
};
function SectionA({ AboutRef }) {
  return (
    <Banner img={laundryMap} ref={AboutRef}>
      <h1>
        洗衣地圖
        <br />
        搜尋小幫手
      </h1>
    </Banner>

  );
}
SectionA.propTypes = {
  AboutRef: PropTypes.func.isRequired,
};
function SectionB() {
  return (
    <Banner img={useWeb}>
      <h1>
        在線預定
        <br />
        洗衣更從容
      </h1>
    </Banner>
  );
}

function SectionC() {
  return (
    <Banner img={scanQrCode}>
      <h1>
        掃碼洗衣
        <br />
        快速方便
      </h1>
    </Banner>

  );
}

export {
  FirstBanner, SectionA, SectionB, SectionC,
};
