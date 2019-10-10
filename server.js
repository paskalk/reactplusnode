var app = require('express')();
const sql = require('mssql');
const Pgpool = require('pg').Pool
require('dotenv').config();

const port = process.env.PORT || 3000;

const pool = new sql.ConnectionPool({
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true 
    }
})

const pgpool = new Pgpool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: 5432,
  ssl: true
})

app.get('/', function(request, response){
    console.log("/ requested");
    response.sendFile(__dirname +'/index.html');
    // response.send("Hello World");
});


app.get('/main.js', function(request, response){
    response.sendFile(__dirname +'/main.js');
    // response.send("Hello World");
});

app.get('/getName', function(request, response){
    sql.connect(config)
    .then((conn) => 
        conn.query("SELECT * FROM measurements")
            .then((v) => console.log(v))
            .then(() => conn.close()))

});

app.get('/getMeasurementsMSSQL', function(request, response){
   
    var conn = pool;
    
    conn.connect().then(function () {
        console.log('connected');

        var req = new sql.Request(conn);
         req.query("SELECT top 5 * FROM measurements order by unix_timestamp desc").then(function (recordset) {
        //req.query("SELECT 1").then(function (recordset) {
            
            conn.close();
            
            response.header("Access-Control-Allow-Origin", "*");
            //console.log(recordset["recordsets"][0]);
            //return response.json({data: recordset["recordsets"]});
            return response.json(recordset.recordsets[0]);
        })
            .catch(function (err) {
                console.log(err);
                conn.close();
            });
    })
    .catch(function (err) {
        console.log(err);
    });

});

app.get('/getMeasurements', function(request, response){
   
    pgpool.query('SELECT * FROM measurements order by unix_timestamp desc fetch first 5 rows only', (error, results) => {
        if (error) {
          throw error
        }
        response.header("Access-Control-Allow-Origin", "*");
        return response.json(results.rows);
    })
   
});

app.get('*', function(request, response){
    response.sendFile(__dirname +'/index.html');
});

console.log(port + ': Port');
app.listen(port); 

