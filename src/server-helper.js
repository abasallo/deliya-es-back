import 'dotenv/config'

import { sequelize, initSequelize } from './orm/sequelize'

import { ApolloServer } from 'apollo-server'

import typeDefs from './graphql/schema'

import resolvers from './graphql/resolvers'

export const database = sequelize

export const model = initSequelize()

export const server = new ApolloServer({ typeDefs, resolvers, context: { model } })
