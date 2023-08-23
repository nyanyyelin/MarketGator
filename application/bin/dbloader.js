"use strict";
const mysql = require("mysql2/promise");

function displayWarningMessage(warning) {
  switch (warning.Code) {
    case 1007:
      console.log(`Skipping Database Creation --> ${warning.Message}`);
      break;
    case 1050:
      console.log(`Skipping Table Creation --> ${warning.Message}`);
      break;
  }
}

async function getConnection() {
  return await mysql.createConnection({
    host: "34.211.120.29",
    //TODO make sure to change to the user you want to use
user: 'csc648',
    //TODO make sure to change to the correct password for your user.
password: 'password1!'
  });
}

async function makeDatabase(connection) {
  //TODO make sure to change yourdbnamehere
  const [result, _] = await connection.query(
    "CREATE DATABASE IF NOT EXISTS csc648db;"
  );
  if (result && result.warningStatus > 0) {
    const [warningResult, _] = await connection.query("SHOW WARNINGS");
    displayWarningMessage(warningResult[0]);
  } else {
    console.log("Created Database!");
  }
}


(async function main() {
  let connection = null;
  try {
    console.log("creating connection");
    connection = await getConnection(); 
    await makeDatabase(connection); // make DB
    console.log("connection created");
    //TODO make sure to change yourdbnamehere
    await connection.query("USE csc648db"); // set new DB to the current DB
    connection.close();
    return;
  } catch (error) {
    console.error(error);
    if (connection != null) {
      connection.close();
    }
  }
})();