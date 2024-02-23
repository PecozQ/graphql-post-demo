import { authResolvers } from "./authResolvers";
import { postResolvers } from "./postResolvers";

export const Mutation = {
  ...postResolvers,
  ...authResolvers
}