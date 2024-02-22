import { authResolvers } from "./auth";
import { postResolvers } from "./post";
import { profileResolver } from "./Profile";
import { userResolver } from "./User";
import { userPostResolver } from "./userPost";




export const Mutation = {
  ...postResolvers,
  ...authResolvers,  
  // ...profileResolver,
  // ...userResolver,
  // ...userPostResolver
}