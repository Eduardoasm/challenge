require("dotenv").config()
import express from "express"
import "./database/connectdb"
import router from "./routes/index"
import morgan from "morgan"
import cors from "cors"
const cookieParser = require("cookie-parser");
import { ApolloServer } from "apollo-server-express"
const { typeDefs } = require("./typeDefs")
const { resolvers } = require("./resolvers")


const app = express()

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());


app.use(router)

async function serverOn() {

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })
    
    await apolloServer.start();
     
    apolloServer.applyMiddleware({app})
     
    app.use("*", (req, res) => { res.status(400).send("not found")})

    app.listen(3000,() => {
        console.log("server on PORT 3000")
    })
}

serverOn()


  module.exports = app;