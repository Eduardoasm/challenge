require("dotenv").config()
import { Router } from "express"


const resolvers: any = {


    Query: {
        getAllUsers: (_:any, args: any) => {
            console.log("soy args", args)
            const { options } = args
            return {}
        }
},

}

module.exports= { resolvers }