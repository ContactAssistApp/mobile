'use strict';

import Realm from 'realm';

class Location extends Realm.Object {}
Location.schema = {
  name: 'Location',
  primaryKey: 'time',
  properties: {
    latitude: 'double',
    longitude: 'double',
    time: 'int',
    address: 'string',
    name: 'string',
    source: 'string',
    timespan: 'string',
  },
};

export default new Realm({schema: [Location.schema]});
