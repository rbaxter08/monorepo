import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './github.schema.docs.graphql',
  documents: ['pages/**/*.tsx'],
  generates: {
    './types/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
