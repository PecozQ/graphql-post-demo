import JWT from "jsonwebtoken"

export const getUserFromToken = (token: string) => {
    try {
        return JWT.verify(token, process.env.JWT_SECRET_KEY as JWT.Secret) as {
            userId: number
        }
    } catch(err) {
        return null;
    }
}