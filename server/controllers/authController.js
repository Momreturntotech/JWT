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