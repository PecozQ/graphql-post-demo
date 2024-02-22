import { MyContext } from "../../prismaContext";
import validator, { isDataURI } from 'validator';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

interface SignupArgs {
    credentials: {
        email: string;
        password: string;
    }
    name: string;
    bio: string;
}

interface SigninArgs {
    credentials: {
        email: string;
        password: string;
    }
}


interface UserPayload {
    userErrors: {
        message: string
    }[];
    token: string | null;
}
export const authResolvers = {
    signup: async (_:any, 
        {credentials, name, bio}: SignupArgs,
        {prisma}: MyContext): Promise<UserPayload> => {
            const {email, password} = credentials
            const isEmail = validator.isEmail(email)
            if (!isEmail) {
                return {
                    userErrors: [{
                         message: "Invalid email"
                    }],
                    token : null
                }
            }
            const isValidPassword = validator.isLength(password, {
                min: 5
            });
            if (!isValidPassword) {
                return {
                    userErrors: [{
                         message: "Invalid password"
                    }],
                    token : null
                }
            }

            if (!name || !bio) {
                return {
                    userErrors: [{
                         message: "Invalid name or bio "
                    }],
                    token : null
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
            }, "sdafskjasfkmbmjbsdhvjadvladjf",{
                expiresIn: 3600000 })


            return {
                userErrors: [],
                token
            }
           
    },
    signin: async(
        _: any,
        {credentials}: SigninArgs,
        {prisma}: MyContext
    ): Promise<UserPayload> => {
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
             token: JWT.sign({userId: user.id}, "sdafskjasfkmbmjbsdhvjadvladjf", {
                expiresIn: 3600000,
             })
        }
    },
};