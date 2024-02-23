import { IContext } from "../../../utils/database/prisma/prismaContext";
import validator, { isDataURI } from 'validator';
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { ISignupArgs, IUserPayload, ISigninArgs } from "../../../types/auth.type";
import { BaseError } from "../../../utils/error/base.error";
import { ErrorCodes } from "../../../types/error.type";
// import { InputError } from "../../../utils/error/customError";

export const authResolvers = {
    /**
     * This function is used to create a user on sign up
     * 
     * @param {ISignupArgs["credentials"]}  credentials
     * @param {string} name 
     * @param {string} bio
     * @returns {Promise<IUserPayload | Error>} return Access Token on signup
     */
    signup: async (_:any, 
        {credentials, name, bio}: ISignupArgs,
        {prisma}: IContext): Promise<IUserPayload> => {
            const {email, password} = credentials;
            const isEmail = validator.isEmail(email);
            if (!isEmail) {
                throw new BaseError("Invalid Email Address", ErrorCodes.INPUT_ERROR);
            }
            const isValidPassword = validator.isLength(password, {min: 5});
            if (!isValidPassword) {
                throw new BaseError("Invalid Password", ErrorCodes.INPUT_ERROR);
            }

            if (!name || !bio) {
                throw new BaseError("Invalid name or bio", ErrorCodes.INPUT_ERROR)
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
                throw new BaseError("Error on user creation in DB", ErrorCodes.DB_ERROR)
            }
            const token = await JWT.sign({
                userId: user?.id
            }, process.env.JWT_SECRET_KEY as JWT.Secret,{
                expiresIn: 3600000 })

            return {
                token
            }
           
    },
    /**
     * This function is used to login 
     * 
     * @param {ISigninArgs} credentials
     * @returns {Promise<IUserPayload | Error>} return Access Token on signin
     */
    signin: async(
        _: any,
        {credentials}: ISigninArgs,
        {prisma}: IContext
    ): Promise<IUserPayload>=> {
        const {email, password} = credentials;
        let user;
        try {
            user = await prisma?.user.findUnique({
                where: {
                    email
                }
            });
        } catch (error) {
           throw new BaseError("Error on user retrieval from DB", ErrorCodes.DB_ERROR);
        }
        
        if (!user) {
            throw new BaseError("User not found", ErrorCodes.INVALID_CREDENTIALS);
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new BaseError("Please check username and password", ErrorCodes.INVALID_CREDENTIALS);
        }
        return {
             token: JWT.sign({userId: user.id}, process.env.JWT_SECRET_KEY as JWT.Secret, {
                expiresIn: 3600000,
             })
        }
    },

};