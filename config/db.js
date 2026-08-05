require('dotenv').config();
//mysql
const mysql = require("mysql2")

//mongodb
const mongoose = require('mongoose')

// Creating connections
//mongodb
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => console.log(err))

//mysql
const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: 'headachedb',
    connectionLimit: 10
})

con.connect((err) => {
    if(err)
    {
        console.error('Mysql database failed to connect',err)
        //backup plan
    }else{
        console.log("Mysql Connected")
    }
})

//mysql databse functions
function logNewUser(Userid){
    con.query('INSERT INTO Users SET ?',{
        id: Userid,
        color_preference: 3 //default to system default
    }, (err) => {
        if(err){
            console.error('New User was failed to be logged', err);
            //add backup plan
        }
        else{
            console.log('New user has been logged');
        }
    })
}

module.exports = {logNewUser};
// con.query('select * from headachedb.headache', (err, res)=>{
//     return console.log(res)
// })

//finally works!