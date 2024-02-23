export interface ISignupArgs {
    credentials: {
        email: string;
        password: string;
    }
    name: string;
    bio: string;
}

export interface ISigninArgs {
    credentials: {
        email: string;
        password: string;
    }
}

export interface IUserPayload {
    userErrors?: {
        message: string
    }[];
    token?: string | null;
}