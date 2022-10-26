import { store } from '../app/store';
import { setNotifications } from '../features/users/userSlice';

export const setNewNotifications = (prev: any, newData: any) => {
  store.dispatch(setNotifications([...prev, newData]));
  localStorage.setItem('notifications', JSON.stringify([...prev, newData]));
};

export const setNewNotification = (newData: any) => {
  store.dispatch(setNotifications(newData));
  localStorage.setItem('notifications', JSON.stringify(newData));
};
