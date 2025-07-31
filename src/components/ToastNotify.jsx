// ToastNotify.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Optional default config
const toastOptions = {
  position: 'top-right',
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  closeOnClick: true,
  // theme: 'colored',
};

export const showToast = {
  success: (msg) => toast.success(msg, toastOptions),
  error: (msg) => toast.error(msg, toastOptions),
  info: (msg) => toast.info(msg, toastOptions),
  warning: (msg) => toast.warning(msg, toastOptions),
};

export default function ToastNotify() {
  return <ToastContainer />;
}
