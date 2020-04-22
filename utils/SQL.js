import SQLite from 'react-native-sqlite-storage';

const SQL = {
  errorCB: function(err) {
    console.log('SQL Error: ' + err);
  },

  successCB: function() {
    console.log('SQL executed successfully');
  },

  openCB: function() {
    console.log('Database OPENED');
  },

  initDB: function() {
    const dbName = 'covidSafe.db';
    const db = SQLite.openDatabase(
      {name: dbName, location: 'default'},
      this.openCB,
      this.errorCB,
    );
    return db;
  },

  closeDB: function(db) {
    db.close();
  },

  createTable: function(db, sqlStatement, args = []) {
    db.transaction(txn => {
      txn.executeSql(sqlStatement, args, this.successCB, this.errorCB);
    });
  },

  insert: function(db, sqlStatement, args = []) {
    db.transaction(txn => {
      txn.executeSql(sqlStatement, args, this.successCB, (err) => {
        console.log(err);
      });
    });
  },

  get: async (db, sqlStatement, args = []) => {
    return new Promise((resolve, reject) => {
      db.transaction(txn => {
        txn.executeSql(sqlStatement, args, (tx, results) => {
          const {rows} = results;
          let items = [];
          for (let i = 0; i < rows.length; i++) {
            items.push({
              ...rows.item(i),
            });
          }
          resolve(items);
        });
      });
    });
  },
};

export default SQL;
