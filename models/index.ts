import mongoose from "mongoose"
import { Schema, model, models, Document } from "mongoose"
import bcrypt from "bcrypt"
import paginate from 'mongoose-paginate-v2';

export interface userModel extends Document{
    username: string;
    email: string;
    password: string;
    online: boolean;
    comparePassword: (password: string) => Promise<Boolean>
}

const userSchema = new Schema<userModel>(
    {
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        requires: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    online:{
        type: Boolean,
    },
}
)

userSchema.pre('save', async function(next){ // funcion para hashear la password, y no se identifique facilmente en la base de datos
    const user = this;
    if(!user.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash
})

userSchema.methods.comparePassword = async function(password: string) : Promise<boolean>{ //function para comparar la password 
    return await bcrypt.compare(password, this.password)
}

userSchema.plugin(paginate)



export default model<userModel, mongoose.PaginateModel<userModel>>("User", userSchema)