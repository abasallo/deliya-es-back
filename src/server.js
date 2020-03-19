import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './modules/dotenv'

import './graphql/sequelize'

import { ApolloServer } from 'apollo-server'

import typeDefs from './graphql/schema'

import resolvers from './graphql/resolvers'

import { getAuthenticatedUserFromRequest } from './modules/jwt'

new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ authenticatedUserEmail: getAuthenticatedUserFromRequest(req) })
})
  .listen({ port: process.env.PORT })
  .then(({ url }) => console.log(`Server ready at ${url}`))
  .catch(error => console.error(`Server startup error: ${error}`))
