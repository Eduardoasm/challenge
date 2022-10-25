import mongoose from "mongoose"

const MONGO_URI = process.env.URI_MONGO

try {
 (async()=>{
    await mongoose.connect(MONGO_URI!) 
    console.log("Connect DB ok 👌");
}) ()
} catch (error) {
  console.log("Mongodb connection error:" + error);
}
 