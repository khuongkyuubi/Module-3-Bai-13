const http = require('http');
const url = require('url');
const mysql = require('mysql');
const qs = require('qs');
const { Buffer } = require('buffer');
const port = 4000;

// create connection to db server
const connection = mysql.createConnection({
    host : "localhost",
    user: "root",
    password : "mysql123456",
    database: "dbTest",
    charset : "utf8_general_ci"
});

connection.connect((err)=> {
    if(err) throw err.stack;
    console.log("connected to database!")
});

// create a http server
const server = http.createServer(async(req, res)=> {
    res.end("connect ok!");
    //mọi thao tác với database đều là bất đông bộ
    // các hàm đều trả về 1 promise nên có thể dùng await
    try {
        if(req.url === "/user" && req.method === "POST") {
            // chuyển buffer thành data sử dụng module Bufer
            const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk)
            }
            const data = Buffer.concat(buffers).toString();
            const userData = JSON.parse(data);
            const insertSql = `INSERT INTO customers(name, address) VALUES ('${userData.name}', '${userData.address}');`;
            connection.query(insertSql, (err, results, fields)=> {
                if(err) throw err;
                res.end("Insert Success!");
            })
        }

    } catch (err) {
        return res.end(err.message);
    }

})

server.listen(port, ()=> {
    console.log("you are listening on port", port, `http://localhost:${port}`);
});


