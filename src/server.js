import { server, model } from './server-helper'

model
  .then(() => {
    console.log('Database initialized')
    server
      .listen({ port: process.env.BACKEND_PORT })
      .then(({ port }) => console.log(`Server ready at ${port}`))
      .catch(error => console.error(`Server startup error: ${error}`))
  })
  .catch(error => console.error(`Unable to initialize database: ${error}`))
