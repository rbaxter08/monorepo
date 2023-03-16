/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query GetPRInfo($owner: String!, $name: String!) {\n    repository(owner: $owner, name: $name) {\n      pullRequests(\n        first: 100\n        states: MERGED\n        orderBy: { field: UPDATED_AT, direction: DESC }\n      ) {\n        nodes {\n          number\n          author {\n            login\n          }\n          mergedAt\n          createdAt\n          timelineItems(first: 100) {\n            edges {\n              node {\n                ... on ReviewRequestedEvent {\n                  actor {\n                    login\n                  }\n                }\n              }\n            }\n          }\n          additions\n          deletions\n          changedFiles\n          reviewThreads(first: 50) {\n            totalCount\n            nodes {\n              comments(first: 10) {\n                nodes {\n                  author {\n                    login\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetPrInfoDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPRInfo($owner: String!, $name: String!) {\n    repository(owner: $owner, name: $name) {\n      pullRequests(\n        first: 100\n        states: MERGED\n        orderBy: { field: UPDATED_AT, direction: DESC }\n      ) {\n        nodes {\n          number\n          author {\n            login\n          }\n          mergedAt\n          createdAt\n          timelineItems(first: 100) {\n            edges {\n              node {\n                ... on ReviewRequestedEvent {\n                  actor {\n                    login\n                  }\n                }\n              }\n            }\n          }\n          additions\n          deletions\n          changedFiles\n          reviewThreads(first: 50) {\n            totalCount\n            nodes {\n              comments(first: 10) {\n                nodes {\n                  author {\n                    login\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPRInfo($owner: String!, $name: String!) {\n    repository(owner: $owner, name: $name) {\n      pullRequests(\n        first: 100\n        states: MERGED\n        orderBy: { field: UPDATED_AT, direction: DESC }\n      ) {\n        nodes {\n          number\n          author {\n            login\n          }\n          mergedAt\n          createdAt\n          timelineItems(first: 100) {\n            edges {\n              node {\n                ... on ReviewRequestedEvent {\n                  actor {\n                    login\n                  }\n                }\n              }\n            }\n          }\n          additions\n          deletions\n          changedFiles\n          reviewThreads(first: 50) {\n            totalCount\n            nodes {\n              comments(first: 10) {\n                nodes {\n                  author {\n                    login\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
**/
export function gql(source: string): unknown;

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;