import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_PATH_KEY = 'last-real-path';

export const saveLastPath = async (path: string) => {
  await AsyncStorage.setItem(LAST_PATH_KEY, path);
};

export const getLastPath = async () => {
  return await AsyncStorage.getItem(LAST_PATH_KEY);
};

export const useSavePathOnNavigate = (pathname: string) => {
  useEffect(() => {
    // Don't store Collection as a real path
    if (!pathname.toLowerCase().includes('/collection')) {
      saveLastPath(pathname);
    }
  }, [pathname]);
};
