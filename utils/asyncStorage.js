import AsyncStorage from '@react-native-community/async-storage';
/**
 * Get Data from Store
 *
 * @param {string} key
 * @param {boolean} isString
 */
export async function GetStoreData(key, isString = true) {
  try {
    let data = await AsyncStorage.getItem(key);

    if (isString) {
      return data;
    }

    return JSON.parse(data);
  } catch (error) {
    console.log(error.message);
  }
  return false;
}

/**
 * Set data from store
 *
 * @param {string} key
 * @param {object} item
 */
export async function SetStoreData(key, item) {
  try {
    if (typeof item !== 'string') {
      item = JSON.stringify(item);
    }

    return await AsyncStorage.setItem(key, item);
  } catch (error) {
    console.log(error.message);
  }
}

export async function DeleteStoreData(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function GetKeys(keyPrefix) {
  const allKeys = await AsyncStorage.getAllKeys();
  return allKeys.filter(key => {
    return key.startsWith(keyPrefix);
  });
}

export async function GetMulti(keys) {
  const results = await AsyncStorage.multiGet(keys);
  return results.map(result => {
    return {
      [result[0]]: JSON.parse(result[1]),
    };
  });
}
