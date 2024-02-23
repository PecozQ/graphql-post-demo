import { Query } from "./Query/Query";
import { Mutation } from "./Mutation/Mutation";
import { profileResolver } from "./Mutation/profileResolvers";
import { userResolver } from "./Mutation/userResolvers";
import { postUserResolver } from "./Mutation/postUserResolvers";


export const resolvers = {
    Query,
    Mutation,
    Profile: profileResolver,
    Post: postUserResolver,
    User: userResolver

}