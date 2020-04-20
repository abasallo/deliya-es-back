import resolvers from './resolvers'

test('Resolvers must be defined', () => {
  expect(resolvers.Query).toBeDefined()
  expect(resolvers.Mutation).toBeDefined()
})
