/*
  This test file checks that
    1. all strings(keys) in en.json and es.json are used in app's
      javascript files;
    2. all required keys are present in both en.json and es.json; and
    3. remove extra keys from en.json and es.json, output new files to
      en-new.json and es-new.json

  FOR en.json AND es.json:
    ALL KEYS SPECIFIED SHOULD USE ONLY [a-zA-Z0-9-_], AND
    DO NOT INCLUDE '.' IN KEYS.

  TESTS NEED TO BE RAN SEQUENTIALLY AND SYNCHRONOUSLY.
  2020/7/27, Yuan Wang
*/

const fs = require('fs');
const allFiles = getFiles('..');
const jsFiles = allFiles.filter(file => file.endsWith('.js')); // only examining js files for strings
const usedKeysMap = getUsedKeys(jsFiles);

let en = require("../locales/en.json");
const enKeys = getKeys(en, "", []);
const enKeysMap = createKeyMap(enKeys);

let es = require("../locales/es.json");
const esKeys = getKeys(es, "", []);
const esKeysMap = createKeyMap(esKeys);

/*
  Delete all unused keys in the given @keymap from the given @obj.
  All unused keys should be marked false in the @keymap.
  Return the @obj.
*/
function deleteAllKeys(keyMap, obj) {
  for (let key of keyMap.keys()) {
    if (!keyMap.get(key)) {
      // console.log(`Deleting ${key}`);
      obj = deleteKey(obj, key.split('.'));
    }
  }
  return obj;
}


/*
  Delete the given key from the object, return the object.
  If the key deleted results in an object without any property, the
  result object is deleted recursively.

  @keys: an array of keys, from outermost level to innermost level in order.
  @obj: the obj with/without the key to be deleted.
*/
function deleteKey(obj, keys) {
  if (obj.hasOwnProperty(keys[0])) {
    if (keys.length == 1) {
      delete obj[keys[0]];
    } else {
      obj[keys[0]] = deleteKey(obj[keys[0]], keys.slice(1));
      if (Object.keys(obj[keys[0]]).length == 0) {
        delete obj[keys[0]];
      }
    }
  }
  return obj;
}


/*
  Checks that all keys in @required are present in @actual.
  If any key is missing, log with @label
  Return true if all keys are present, false otherwise.
*/
function hasAllKeys(required, actual, label) {
  hasAll = true;
  for (let key of required.keys()) {
    if (actual.has(key)) {
      actual.set(key, true);
    } else {
      console.log(`${label} is missing key: ${key}`);
      hasAll = false;
    }
  }
  return hasAll;
}

/*
  Checks if all keys are used (marked true) in  @actual,
  Log with @label if any key is unused.
  Return true if all keys are used.
*/
function usedAllKeys(actual, label) {
  usedAll = true;
  for (let key of actual.keys()) {
    if (!actual.get(key)) {
      // console.log(`${label} has unused key: ${key}`);
      usedAll = false;
    }
  }
  return usedAll;
}

/*
   Create the map of required en keys from files
   String invokation should be in format:
     strings(['"]key_to_string['"])

   @files: array of path to files to be examined
*/
function getUsedKeys(files) {
  let usedKeyMap = new Map();
  for (let i = 0; i < files.length; i++) {
    let data = fs.readFileSync(files[i]);
    // console.log(`searching: ${files[i]}`);
    let script = data.toString();
    let pattern = /strings\(['"]([a-zA-Z0-9-_\.]+)['"]\)/g;
    let found;
    while ((found = pattern.exec(script)) !== null) {
      // console.log(found[1]);
      if (!usedKeyMap.has(found[1])) {
        usedKeyMap.set(found[1], false);
      }
    }
  }
  // console.log(arr);
  return usedKeyMap;
}


/*
  Get all the javascript files in the folder,
  ignoring those in the node_modules folder

  @dir: the root directory's relative path
*/
function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory() && files[i] != 'node_modules'){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}

/*
  Get all keys from en.json

  @obj: the json file
*/
function getKeys(obj, stack, array) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object') {
        getKeys(obj[property], stack + "." + property, array);
      } else {
        if (stack.length == 0) {
          array.push(property);
        } else {
          array.push(`${stack.slice(1)}.${property}`);
        }
      }
    }
  }
  return array;
}

/*
   Create map with keys from @array with false values
*/
function createKeyMap(array) {
  map = new Map();
  array.forEach((item) => {
    map.set(item, false);
  });
  return map;
}

/*
  This test will check if en.json has missing keys, if so, missing
  keys will be printed to the console.
*/
describe('En has no missing keys', () => {
  test('En_no_missing_keys', () => {
    const enHasAll = hasAllKeys(usedKeysMap, enKeysMap, 'en');
    expect(enHasAll).toBeTruthy();
  })
});

/*
  This test will check if en.json has extra keys, if so, extra keys
  will be deleted. If the new json has all keys and no extra keys,
  it will be write to ./locales/newEn.json. Original en.json will
  be unchanged.
*/
describe('En has no extra keys', () => {
  test('En_has_no_extra_keys', () => {
    let enUsedAll = usedAllKeys(enKeysMap, 'en');
    let enHasAll = true;
    if (!enUsedAll) {
      console.log('Extra keys in en.json, now deleting');
      let newEn = deleteAllKeys(enKeysMap, en);
      console.log('Check new en meets requirements');
      const newEnKeys = getKeys(newEn, "", []);
      const newEnKeysMap = createKeyMap(newEnKeys);
      enHasAll = hasAllKeys(usedKeysMap, newEnKeysMap, 'newEn');
      if (!enHasAll) {
        console.log('newEn.json has missing keys');
      }
      enUsedAll = usedAllKeys(newEnKeysMap, 'newEn');
      if (!enUsedAll) {
        console.log('newEn.json has extra keys');
      }
      if (enUsedAll && enHasAll) {
        console.log('newEn.json meets requirements, writing to file');
        fs.writeFileSync('./locales/newEn.json', JSON.stringify(newEn, null, 2));
      }
    }
    expect(enUsedAll && enHasAll).toBeTruthy();
  })
});

/*
  This test will check if es.json has missing keys, if so, missing
  keys will be printed to the console.
*/
describe('Es has no missing keys', () => {
  test('Es_no_missing_keys', () => {
    const esHasAll = hasAllKeys(usedKeysMap, esKeysMap, 'es');
    expect(esHasAll).toBeTruthy();
  })
});


/*
  This test will check if es.json has extra keys, if so, extra keys
  will be deleted. If the new json has all keys and no extra keys,
  it will be write to ./locales/newEn.json. Original en.json will
  be unchanged.
*/
describe("Es has no extra keys", () => {
  test('Es_has_no_extra_keys', () => {
    let esUsedAll = usedAllKeys(esKeysMap, 'es');
    let esHasAll = true;
    if (!esUsedAll) {
      console.log('Extra keys in es.json, now deleting');
      let newEs = deleteAllKeys(esKeysMap, es);
      console.log('Check new es meets requirements');
      const newEsKeys = getKeys(newEs, "", []);
      const newEsKeysMap = createKeyMap(newEsKeys);
      esHasAll = hasAllKeys(usedKeysMap, newEsKeysMap, 'newEs');
      if (!esHasAll) {
        console.log('newEs.json has missing keys');
      }
      esUsedAll = usedAllKeys(newEsKeysMap, 'newEs');
      if (!esUsedAll) {
        console.log('newEs.json has extra keys');
      }
      if (esUsedAll && esHasAll) {
        console.log('newEn.json meets requirements, writing to file');
        fs.writeFileSync('./locales/newEs.json', JSON.stringify(newEs, null, 2));
      }
    }
    expect(esUsedAll && esHasAll).toBeTruthy();
  })
})
