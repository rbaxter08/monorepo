const { GraphQLClient } = require('graphql-request');
const {
  differenceInMilliseconds,
  isAfter,
  isBefore,
  subYears,
  formatRelative,
} = require('date-fns');
const fs = require('fs');

const endpoint = 'https://api.github.com/graphql';
const API_KEY = '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';

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${API_KEY}`,
  },
});

const query = `
query ($owner: String!, $name: String!, $cursor: String) {
  rateLimit {
    limit
    cost
    remaining
    resetAt
  }
  repository(owner:$owner, name:$name) {
    pullRequests(first:100, after:$cursor, states:MERGED, orderBy: {field: UPDATED_AT, direction: DESC}) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        author {
          login
        }
        number
        additions
        deletions
        createdAt
        mergedAt
        reviewThreads(first:100) {
          totalCount
          nodes {
            comments(first: 10) {
              nodes {
                author {
                  login
                }
              }
            }
          }
          edges {
            node {
              comments(first: 1) {
                edges {
                  node {
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

const TODAY = new Date();
const ONE_YEAR_AGO = subYears(TODAY, 1);
console.log('relative', formatRelative(ONE_YEAR_AGO, TODAY));
const allReviewAuthors = {};

async function runQuery(cursor = null) {
  console.log('fetching...');
  const variables = {
    owner: 'shore-group',
    name: 'h1',
    cursor: cursor,
  };

  const result = await client.request(query, variables);
  console.log(JSON.stringify(result.rateLimit));
  const data = result.repository.pullRequests.nodes;
  let oldestPr = undefined;

  for (const pr of data) {
    const mergedAt = new Date(pr.mergedAt);
    const createdAt = new Date(pr.createdAt);

    const reviewCommentCreatedAt =
      pr.reviewThreads?.edges[0]?.node.comments.edges[0]?.node.createdAt;

    const commentAtDate = new Date(reviewCommentCreatedAt);
    const timeUntilMerged = differenceInMilliseconds(mergedAt, createdAt);
    const timeUntilReviewed = reviewCommentCreatedAt
      ? differenceInMilliseconds(commentAtDate, createdAt)
      : '';
    const timeFromReviewToMerge = reviewCommentCreatedAt
      ? differenceInMilliseconds(mergedAt, commentAtDate)
      : '';

    if (oldestPr === undefined) {
      oldestPr = mergedAt;
    }

    if (isBefore(oldestPr, mergedAt)) {
      oldestPr = mergedAt;
    }

    const nonAuthorThreads = pr.reviewThreads.nodes?.filter(
      (thread) => thread?.comments.nodes[0]?.author?.login !== pr.author?.login
    );

    const reviewers = nonAuthorThreads?.map(
      (thread) => thread?.comments.nodes[0]?.author?.login
    );

    reviewers.forEach((reviewer) => {
      if (!allReviewAuthors[reviewer]) {
        allReviewAuthors[reviewer] = 0;
      }
      allReviewAuthors[reviewer] += 1;
    });

    const row = [
      pr.author?.login,
      pr.number,
      pr.additions,
      pr.deletions,
      timeUntilMerged,
      timeUntilReviewed,
      timeFromReviewToMerge,
      pr.reviewThreads.totalCount,
      nonAuthorThreads.length,
    ];

    fs.appendFileSync('pull_requests.csv', row.join(',') + '\n');
  }

  if (
    result.repository.pullRequests.pageInfo.hasNextPage &&
    isAfter(oldestPr, ONE_YEAR_AGO)
  ) {
    return runQuery(result.repository.pullRequests.pageInfo.endCursor);
  }
}

async function run() {
  await runQuery();
  console.log(JSON.stringify(allReviewAuthors, null, 2));
}

run();
