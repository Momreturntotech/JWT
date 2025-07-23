import jwt from "jsonwebtoken";
const userAuth= async(req,res,next)=>{
    const {token} = req.cookies;
    console.log("this is with in Middel Ware",token)
    if(!token){
        return res.json({success:false,message:"Not Authorised, Login Again"})
    }
    try {
         const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
         console.log("this is after token Decode",tokenDecode.id)
          if (!req.body) req.body = {}
         if(tokenDecode.id){
            req.body.userId=tokenDecode.id
         }else{
            return res.json({success:false,message:"Not Authorised, Login Again"})
         }
         next();
        
    } catch (error) {
        console.log("this is catch error")
        res.json({success:false,message:error.message})
        
    }

}

export default userAuth;