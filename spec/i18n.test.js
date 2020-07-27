const fs = require('fs');
const allFiles = getFiles('..');
const jsFiles = allFiles.filter(file => file.endsWith('.js')); // only examining js files for strings
const usedKeysMap = getUsedKeys(jsFiles);


const en = require("../locales/en.json");
const enKeys = getKeys(en, "", []);
const enKeysMap = createKeyMap(enKeys);

const es = require("../locales/es.json");
const esKeys = getKeys(es, "", []);
const esKeysMap = createKeyMap(esKeys);


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
      console.log(`${label} has unused key: ${key}`);
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

// describe('get keys', () => {
//
//   test('pretest_getKeys', () => {
//     console.log(enKeysMap);
//     expect(true).toBeTruthy();
//   });
//
//   test('pretest_getUsedKeys', async () => {
//     console.log(usedKeysMap);
//     expect(usedKeysMap).toBeTruthy();
//   })
// });

describe('En has no missing keys', () => {
  test('En_no_missing_keys', () => {
    const enHasAll = hasAllKeys(usedKeysMap, enKeysMap, 'en');

    expect(enHasAll).toBeTruthy();
  })
});

describe('En has no extra keys', () => {
  test('En_has_no_extra_keys', () => {
    const enUsedAll = usedAllKeys(enKeysMap, 'en');

    expect(enUsedAll).toBeTruthy();
  })
});

describe('Es has no missing keys', () => {
  test('Es_no_missing_keys', () => {
    const esHasAll = hasAllKeys(usedKeysMap, esKeysMap, 'es');

    expect(esHasAll).toBeTruthy();
  })
});

describe("Es has no extra keys", () => {
  test('Es_has_no_extra_keys', () => {
    const esUsedAll = usedAllKeys(esKeysMap, 'es');

    expect(esUsedAll).toBeTruthy();
  })
})
