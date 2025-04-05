import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'https://beta.pokeapi.co/graphql/v1beta',
  documents: ['app/graphql/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './generated/': {
      preset: 'client',
      config: {
        skipTypename: true,
        dedupeFragments: true
      }
    }
  }
}
 
export default config