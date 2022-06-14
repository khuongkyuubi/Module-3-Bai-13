const mysql = require('mysql'); // or use import if you use TS
const util = require('util');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123456",
    database: "dbTest",
    charset: "utf8_general_ci"
});
// node native promisify
const query = util.promisify(connection.query).bind(connection);

(async () => {
    try {
        const result = await query('SELECT * FROM products');
        console.log(result);
    } catch (err) {
        console.log(err.message);
    }
    // try {
    //     const result = await query('DELETE FROM products WHERE name = "samsung";');
    //     console.log(result);
    // } catch (err) {
    //     console.log(err.message);
    // }
    // finally {
    //     connection.end();
    // }
})()