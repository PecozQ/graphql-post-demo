import { IContext } from "../../prismaContext";
import validator, { isDataURI } from 'validator';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { ISignupArgs, IUserPayload, ISigninArgs } from "../../types/auth.type";
import { InputError } from "../../utils/customError";

export const authResolvers = {
    signup: async (_:any, 
        {credentials, name, bio}: ISignupArgs,
        {prisma}: IContext): Promise<IUserPayload> => {
            const {email, password} = credentials;
            const isEmail = validator.isEmail(email);
            if (!isEmail) {
                return {
                    userErrors: [{
                         message: "Invalid email"
                    }],
                    token: null
                };
            }
            console.log("this is exec")
            const isValidPassword = validator.isLength(password, {
                min: 5
            });
            if (!isValidPassword) {
                return {
                    userErrors: [{
                         message: "Invalid password"
                    }]                
                };
            }

            if (!name || !bio) {
                return {
                    userErrors: [{
                         message: "Invalid name or bio "
                    }]                
                }
            }
          
            const hashedPassword = await bcrypt.hash(password, 10);

           const user =  await prisma?.user.create({
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
    ): Promise<IUserPayload> => {
        const {email, password} = credentials;
        
        const user = await prisma?.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return {
                userErrors: [
                    {
                        message: "Invalid credentials"
                    }],
                    token: null
            }
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return {
                userErrors: [{message: "Invalid credentials"}],
                token: null
            }
        }

        return {
             userErrors: [],
             token: JWT.sign({userId: user.id}, process.env.JWT_SECRET_KEY as JWT.Secret, {
                expiresIn: 3600000,
             })
        }
    },
};