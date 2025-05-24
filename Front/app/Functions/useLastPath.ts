import AsyncStorage from '@react-native-async-storage/async-storage';

const RETURN_PATH_KEY = 'return-from-collection';

export const setReturnPath = async (path: string) => {
  await AsyncStorage.setItem(RETURN_PATH_KEY, path);
};

export const getReturnPath = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(RETURN_PATH_KEY);
};

export const clearReturnPath = async () => {
  await AsyncStorage.removeItem(RETURN_PATH_KEY);
};



