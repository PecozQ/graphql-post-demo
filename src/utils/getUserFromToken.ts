import JWT from "jsonwebtoken"

export const getUserFromToken = (token: string) => {
    try {
        return JWT.verify(token, "sdafskjasfkmbmjbsdhvjadvladjf") as {
            userId: number
        }
    } catch(err) {
        return null;
    }
}