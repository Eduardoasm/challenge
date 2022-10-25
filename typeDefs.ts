import { gql } from "apollo-server-express"


const typeDefs = gql`

type User {
    id: ID
    username: String
    email: String
    password: String
}

type Options{
    page: String
    limit: String
}

type Query {
    getAllUsers(options: String): [User]
}

type Mutation{
    getUserLogin: [User]
}
`

module.exports = { typeDefs }

