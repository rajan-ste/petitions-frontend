import { create } from 'zustand';

interface TokenState {
    token: string;
    setToken: (token: string) => void;
    delToken: () => void;
}

const getLocalStorage = (key: string): string => window.localStorage.getItem(key) || "";
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key, value);
const removeLocalStorage = (key: string) => window.localStorage.removeItem(key);

const useStore = create<TokenState>((set) => ({
    token: getLocalStorage('token'),
    setToken: (token: string) => set(() => {
        setLocalStorage('token', token);
        return { token };
    }),
    delToken: () => set(() => {
        removeLocalStorage('token');
        return { token: "" };
    })
}));

export default useStore;
