import jwt from "jsonwebtoken";
const userAuth= async(res,req,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false,message:"Not Authorised, Login Again"})
    }
    try {
         const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        
    } catch (error) {
        es.json({success:false,message:error.message})
        
    }

}