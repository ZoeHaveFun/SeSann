/* eslint-disable import/prefer-default-export */
import Swal from 'sweetalert2';

import './indx.css';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});
