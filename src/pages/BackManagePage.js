import { PropTypes } from 'prop-types';

function BackManagePage({ storeData }) {
  console.log('Manage', storeData);
  return (
    <h1>its managePage</h1>
  );
}

BackManagePage.propTypes = {
  storeData: PropTypes.shape({}).isRequired,
};

export default BackManagePage;
