import mysql from "mysql2";

const db=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database: "gestprofesseur",
    port:3306,
})
db.connect((err)=>{
    if(err){
        console.error("erreur de connexion a la base de donnee:", err.message)
    }
    else{
        console.log("Connecté à la base de données")
    }
})
export default db