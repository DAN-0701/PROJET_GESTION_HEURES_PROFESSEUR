//importation des routes
import express from'express'
import db from './db.js'
import cors from "cors"
import session from "express-session";
import loginuser from "./routes/loginroute.js";
import authroute from "./routes/authroute.js";
import createadminroute from "./routes/crudadminroute.js";
import crudrhroute from "./routes/crudrhroute.js";
import matieresroute from "./routes/matieresroute.js";
import heuresroute from "./routes/heuresroute.js";
import crudrouteprof from "./routes/crudrouteprof.js";
import theureroute from "./routes/theureroute.js";
import anneeroute from "./routes/anneeroute.js";
import referentiel from "./routes/referentielroute.js";
import affectationroute from "./routes/affectationroute.js";
import journallogroute from "./routes/journallogroute.js";
import statistiqueroute from "./routes/statistiqueroute.js";
import heuredepasseroute from "./routes/heuredepasseroute.js";
import genpayementroute from "./routes/genpayementroute.js";
import professeurroute from "./routes/professeurroute.js";
import updatepassroute from "./routes/changepassroute.js";
import deconnexionroute from "./routes/deconnexionroute.js";
import parametrageroute from "./routes/parametrageroute.js";
import backuproute from "./routes/backuproute.js";
//declaration de variable

const app=express()

//midleware pre route
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));



app.use(express.json())

app.use(session({
  secret: "SECRET_SESSION",
  resave: false,
  saveUninitialized: false,
  cookie: {                 // a chercher
    httpOnly: true,
    secure: false,        
    sameSite: "lax"      
  }

}));

// utilisation des routes importes


app.use((req, res, next) => {
  console.log("➡️ Requête reçue :", req.method, req.url);
  next();
});

app.use("/api",loginuser)
app.use("/api",authroute)
app.use("/api",createadminroute)
app.use("/api",crudrhroute)
app.use("/api",matieresroute)
app.use("/api",heuresroute)
app.use("/api",crudrouteprof)
app.use("/api",theureroute)
app.use("/api",anneeroute)
app.use("/api",referentiel)
app.use("/api",affectationroute)
app.use("/api",journallogroute)
app.use("/api",statistiqueroute)
app.use("/api",heuredepasseroute)
app.use("/api",genpayementroute)
app.use("/api",professeurroute)
app.use("/api",updatepassroute)
app.use('/api',deconnexionroute)
app.use('/api',parametrageroute)
app.use('/api',backuproute)
app.listen(3000, () => {
  console.log('✅ Serveur lancé sur http://localhost:3000');
});
