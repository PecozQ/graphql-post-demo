export const typeDefs = `#graphql
     type Query {
        posts: [Post!]!
        me: User
        profile(userId: ID!): Profile
        getPublicPost: [Post!]!
        getPrivatePost: [Post!]!
        getAllPostForLoggedUser: [PostDetail!]!
     }

     type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(postId:ID!, post: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload! 
        postPublish(postId: ID!): PostPayload!
        postUnpublish(postId: ID!): PostPayload!
        signup(credentials: CredentialsInput, name: String!, bio: String!): AuthPayload!
        signin(credentials: CredentialsInput): AuthPayload!
        updatePrivatePostAccess(post: PostUserInput!): PostUserPayload!
        updateIsPublic(postId: ID!): PostPayload!
     }

     type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        isPublic: Boolean!
        user: User!
     }

     type User {
        id: ID!
        name: String!
        email: String!
        posts: [Post!]!
     }

     type Profile {
        id: ID!
        bio: String!
        user: User!
     }

     type UserError {
        message: String!
     }

     type PostPayload {
        post: Post
     }

     input PostInput {
        title: String
        content: String
     }
     
     type AuthPayload {
        token: String
     }

     input CredentialsInput {
        email: String!
        password: String!
     }

     input PostUserInput {
      postId: ID!
      userId: ID!
     }
     
     type PostUserPayload {
        message: String
     }

     type PostDetail {
      id: ID!
      title: String
      content: String
      isPublic: Boolean
      authorId: ID!
   }
`
