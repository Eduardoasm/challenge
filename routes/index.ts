require("dotenv").config()
import { Router } from "express"
const router = Router()
import User from "../models/index"
import jwt from "jsonwebtoken"
import { serialize } from 'cookie'
import { verify } from "jsonwebtoken"


router.post("/register", async (req, res )=> {
    try {
        const { email, password, username } = req.body
        if(!email || !password || !username){
            return res.status(404).json({msg: "body required"})
        }
        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            return res.status(404).json({msg: "email is not valid"})
        }
        let user = await User.findOne({ email })
        if(user){
            return res.status(404).json({msg: `${email} already exists`})
        }
        user = new User({ email, password, username })
        await user.save()
        return res.status(200).json({succes: true, user})
    } catch (error) {
        console.log(error)
        return res.status(400).json({succes: false, error: 'falla del servidor'})
    }
})

router.post("/login", async (req, res)=> {
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(404).json({msg: "body required"})
        }

        let user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({msg: "no hay email creado"})
        }
        const logUser = await user.comparePassword(password)
        if(logUser){
        const refreshToken = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET!, {
            expiresIn: 86400})
            const serialized = serialize('myTokenName', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400,
                path: "/"
            })

            res.setHeader('Set-Cookie', serialized)

            return res.status(200).json({succes: true, token: refreshToken})
   
        }
        return res.status(400).json({succes: false, error: 'la contraseña no coincide'})
        
    } catch (error) {
            console.log("error de try", error)
    }
})


router.post("/logout", (req, res) => {
    
    const { myTokenName } = req.cookies
    
    try {
        if(!myTokenName){
           return res.status(404).json("no hay token")
        }
    
        const clearCookie = serialize('myTokenName', "0", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: "/"
        })
    
        res.setHeader('Set-Cookie', clearCookie)

        res.status(200).json({msg: "logout succesfully"})
    }
     catch (error) {
        console.log(error)
        res.status(401).json({msg: "no token"})
    }
})


router.get("/userLogin", async (req, res)=>{
    
    try {
    const { myTokenName } = req.cookies

    interface idUser{
        id: string
    }

    const user = verify(myTokenName, process.env.JWT_SECRET!) as idUser


        const userFind = await User.findById(user.id, {
            password: 0
        })

        return res.status(200).json({msg:"succes", userFind})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg:"no user logged in"})
    }
})


interface paginate{
    page: number;
    limit: number
}

router.get("/allUsers", async (req, res) => {

    console.log(req.body)

    const { options = { 
        page: 1,
        limit: 1
    }}  = req?.body

    

    try {
        const allUsers = await User.paginate({}, options)

        return res.status(200).json({msg:"succes", allUsers})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: "no find users"})
    }

})

export default router