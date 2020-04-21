import resolvers from './resolvers'

test('Resolvers must be defined', async () => {
  expect(resolvers.Query).toBeDefined()
  expect(resolvers.Mutation).toBeDefined()
})
