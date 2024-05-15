import { create } from 'zustand';

interface UserState {
  token: string;
  userId: string;
  setToken: (token: string, userId: string) => void;
  delToken: () => void;
}

const getLocalStorage = (key: string): string => window.localStorage.getItem(key) || "";
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key, value);
const removeLocalStorage = (key: string) => window.localStorage.removeItem(key);

const useStore = create<UserState>((set) => ({
  token: getLocalStorage('token'),
  userId: getLocalStorage('userId'),
  setToken: (token: string, userId: string) => set(() => {
    setLocalStorage('token', token);
    setLocalStorage('userId', userId);
    return { token, userId };
  }),
  delToken: () => set(() => {
    removeLocalStorage('token');
    removeLocalStorage('userId');
    return { token: "", userId: "" };
  })
}));

export default useStore;
