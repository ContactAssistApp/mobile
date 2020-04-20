import SQLite from 'react-native-sqlite-storage';

function errorCB(err) {
  console.log("SQL Error: " + err);
}

function successCB() {
  console.log("SQL executed fine");
}

function openCB() {
  console.log("Database OPENED");
}

export function initDB() {
  const dbName = 'covidSafe.db';
  const db = SQLite.openDatabase(
    {name: dbName, location: 'default'},
    openCB,
    errorCB
  );
  //
  // db.transaction((tx) => {
  //   tx.executeSql('SELECT * FROM Employees a, Departments b WHERE a.department = b.department_id', [], (tx, results) => {
  //     console.log("Query completed");
  //
  //     // Get rows with Web SQL Database spec compliance.
  //
  //     var len = results.rows.length;
  //     for (let i = 0; i < len; i++) {
  //       let row = results.rows.item(i);
  //       console.log(`Employee name: ${row.name}, Dept Name: ${row.deptName}`);
  //     }
  //   });
  // });
}
