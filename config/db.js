require('dotenv').config();
//mysql
const mysql = require("mysql2")

//mongodb
const mongoose = require('mongoose')

//mongodb
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("DB Connected");
}).catch((err) => console.log(err))

//mysql
const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 10
})

con.connect((err) => {
    if(err)
    {
        console.log(err)
    }else{
        console.log("CONNECTION SUCCESSFUL!")
    }
})

// con.query('select * from headachedb.headache', (err, res)=>{
//     return console.log(res)
// })

//finally works!