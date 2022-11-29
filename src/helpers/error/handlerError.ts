import { toast, ToastOptions } from 'react-toastify';

export const handlerError = (error: any) => {
  const message = error?.response?.data?.error;

  const toastConfig: ToastOptions = {
    type: 'error',
  };

  if (Array.isArray(message)) {
    message.forEach((m) => {
      if (m) {
        toast(m, toastConfig);
      }
    });
  }

  if (message) {
    toast(message, toastConfig);
  }
};
