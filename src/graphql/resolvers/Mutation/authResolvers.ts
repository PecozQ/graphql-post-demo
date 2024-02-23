import { IContext } from "../../../utils/database/prisma/prismaContext";
import validator, { isDataURI } from 'validator';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { ISignupArgs, IUserPayload, ISigninArgs } from "../../../types/auth.type";
// import { InputError } from "../../../utils/error/customError";

export const authResolvers = {
    signup: async (_:any, 
        {credentials, name, bio}: ISignupArgs,
        {prisma}: IContext): Promise<IUserPayload | Error> => {
            const {email, password} = credentials;
            const isEmail = validator.isEmail(email);
            if (!isEmail) {
                // return new Error("Invalid Email")
            }
            const isValidPassword = validator.isLength(password, {min: 5});
            if (!isValidPassword) {
                // return new Error("Invalid password");
            }

            if (!name || !bio) {
                // return new Error("Invalid name or bio")
            }
            let user;
          
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                user =  await prisma?.user.create({
                    data: {
                        email,
                        name,
                        password: hashedPassword
                    }
                });
                await prisma?.profile.create({
                    data: {
                        bio,
                        userId: Number(user?.id)
                    }
                })
            } catch(error) {
                return new Error("Error on user creation in DB")
            }
            const token = await JWT.sign({
                userId: user?.id
            }, process.env.JWT_SECRET_KEY as JWT.Secret,{
                expiresIn: 3600000 })

            return {
                token
            }
           
    },
    signin: async(
        _: any,
        {credentials}: ISigninArgs,
        {prisma}: IContext
    ): Promise<IUserPayload | Error>=> {
        const {email, password} = credentials;
        let user;
        try {
            user = await prisma?.user.findUnique({
                where: {
                    email
                }
            });
        } catch (error) {
           return new Error("Error on user retrieval from DB");
        }
        
        if (!user) {
            return new Error("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return new Error("Invalid credentials");
        }
        return {
             token: JWT.sign({userId: user.id}, process.env.JWT_SECRET_KEY as JWT.Secret, {
                expiresIn: 3600000,
             })
        }
    },
    
};