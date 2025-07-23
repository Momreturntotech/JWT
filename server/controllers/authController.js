import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register= async(req,res)=>{
    console.log("it is insid this")
    const {name,email,password}=req.body
    console.log(name,email,password)
    if(!name || !email || !password){
        return res.json({success:false,message:'missing details'})
    }
    try {
        const existingUser= await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"User ALready Exists"})
        }
        const hashedPassword= await bcrypt.hash(password,10)

        const user=new userModel({name,email,password:hashedPassword})
        await user.save();
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7*24*60*60*1000
        })
        //Sending Welcome Email

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to GReatStack",
            text:`Welcome to GreatStack website Your account has been created with the email id ${email}`

        }
        await transporter.sendMail(mailOptions  )

         return  res.json({success:true});
        
    } catch (error) {
        return res.json({success:false,message:error.message})
        
    }
}

 export const login =async(req,res)=>{
    console.log("this is inside login ")
        const {email,password}= req.body;
        if(!email||!password){
           return res.json({success:false,message:"Email or Password is missing"})
        }
        try {
            const user = await userModel.findOne({email});
            if(!user){
               return res.json({success:false,message:'Invalid email'}) 
            }
            const IsMatch = await bcrypt.compare(password,user.password) ;
            if(!IsMatch){
                 return res.json({success:false,message:'Invalid password'})
           }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7*24*60*60*1000
        })

        return  res.json({success:true});
            
        } catch (error) {
            res.json({success:false,message:error.message})
        }

    }


export const logout =async(req,res)=>{    
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            
        })
        return  res.json({success:true,message:"Logged OUt"});
    } catch (error) {
        res.json({success:false,message:error.message})
        }
    
}


//send verification mail to the user
export const sendVerifyOtp = async(req,res)=>{
    console.log("This is inside verify opt")
    try {
        const {userId}=req.body;
        const user = await userModel.findById(userId);

        //Checking whether the account is already verified 
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account already Verified"})
        }

        const otp=String(Math.floor(1000000 + Math.random() * 900000));

        user.verifyOtp= otp;
        user.verifyOtpExpiresAt=Date.now() + 24 * 60 * 60 * 1000
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Account Verification Otp",
            text:`Your Otp is ${otp} Verify your acoount using this otp}`

        }
        await transporter.sendMail(mailOptions  )

         return  res.json({success:true});


        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

}


export const verifyEmail=async(req,res)=>{
    const   {userId,otp} = req.body;
    if(!userId || !otp) {
        return res.json({success:false,message:'Missing Details'})
    }
    try {
        const user =  await  userModel.findById(userId)
        if(!user){
            return res.json({success:false,message:"user Not Found"})
        }
        if(user.verifyOtp==='' || user.verifyOtp !== otp){
             return res.json({success:false,message:"Invalid Otp"})
           
        }
        if(user.verifyOtpExpiresAt < Date.now()){
            return res.json({success:false,message:"Otp Expired"})
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiresAt=0;

        await user.save();
        return res.json({success:true,message:"Email Verified successfully"})
        
    } catch (error) {

        res.json({success:false,message:error.message})
        
    }


}