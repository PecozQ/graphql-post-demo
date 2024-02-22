export interface SignupArgs {
    credentials: {
        email: string;
        password: string;
    }
    name: string;
    bio: string;
}

export interface SigninArgs {
    credentials: {
        email: string;
        password: string;
    }
}

export interface UserPayload {
    userErrors: {
        message: string
    }[];
    token: string | null;
}