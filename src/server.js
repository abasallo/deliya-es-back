import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './modules/dotenv'

import './graphql/sequelize'

import { ApolloServer } from 'apollo-server'

import typeDefs from './graphql/schema'

import resolvers from './graphql/resolvers'

import { getAuthenticatedUserFromRequest } from './modules/jwt'

// TODO - Too much information on Authentication errors is returned, is OK in DEV, but should be 401 in PROD
new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ authenticatedUserEmail: getAuthenticatedUserFromRequest(req) }) })
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => console.log(`Server ready at ${url}`))
