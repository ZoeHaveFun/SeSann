import { PropTypes } from 'prop-types';

function DashboardPage({ storeData }) {
  console.log('dashbord', storeData);
  return (
    <h1>its dashbord</h1>
  );
}

export default DashboardPage;

DashboardPage.propTypes = {
  storeData: PropTypes.shape({}).isRequired,
};
