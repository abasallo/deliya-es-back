import { server, model } from './server-helper'

import constants from './modules/constants'

model
  .then(() => {
    console.log(constants.SERVER_INITIALIZATION_DATABASE_OK)
    server
      .listen({ port: process.env.PORT })
      .then(({ port }) => console.log(constants.SERVER_INITIALIZATION_OK + port))
      .catch(error => console.error(constants.SERVER_INITIALIZATION_KO + error))
  })
  .catch(error => console.error(constants.SERVER_INITIALIZATION_DATABASE_KO + error))
