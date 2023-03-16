import { gql, useQuery } from '@apollo/client';
import { differenceInMilliseconds, intervalToDuration } from 'date-fns';
import { sum, sumBy } from 'lodash';
import {
  GetPrInfoQuery,
  GetPrInfoQueryVariables,
} from '../types/__generated__/graphql';

const GET_PR_QUERY = gql`
  query GetPRInfo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      pullRequests(
        first: 100
        states: MERGED
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          number
          author {
            login
          }
          mergedAt
          createdAt
          timelineItems(first: 100) {
            edges {
              node {
                ... on ReviewRequestedEvent {
                  actor {
                    login
                  }
                }
              }
            }
          }
          additions
          deletions
          changedFiles
          reviewThreads(first: 50) {
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
          }
        }
      }
    }
  }
`;

function median(values: number[]) {
  if (values.length === 0) throw new Error('No inputs');

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

export default function Home() {
  const { data, loading } = useQuery<GetPrInfoQuery, GetPrInfoQueryVariables>(
    GET_PR_QUERY,
    {
      variables: {
        owner: 'shore-group',
        name: 'h1',
      },
    }
  );

  if (!data || !data.repository) return null;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  console.log(data.repository.pullRequests.nodes);
  const mergedPRs = data.repository.pullRequests.nodes
    .filter((pr) => new Date(pr?.mergedAt) >= thirtyDaysAgo)
    .map((pr) => {
      if (!pr) return {};
      const nonAuthorThreads = pr.reviewThreads.nodes?.filter(
        (thread) =>
          thread?.comments.nodes[0]?.author?.login !== pr.author?.login
      );
      return {
        id: pr.number,
        author: pr.author.login,
        url: `https://github.com/shore-group/h1/pull/${pr.number}`,
        timeToMerge: differenceInMilliseconds(
          new Date(pr.mergedAt),
          new Date(pr.createdAt)
        ),
        reviewComments: nonAuthorThreads?.length,
        commentAuthors: nonAuthorThreads?.map(
          (thread) => thread?.comments.nodes[0]?.author?.login
        ),
        size: pr.additions + pr.deletions,
      };
    });

  console.log('merged', mergedPRs);

  const averageTime =
    sumBy(mergedPRs, (pr) => pr.timeToMerge) / mergedPRs.length;
  const averageComments =
    sumBy(mergedPRs, (pr) => pr.reviewComments) / mergedPRs.length;
  const averageSize = sumBy(mergedPRs, (pr) => pr.size) / mergedPRs.length;
  const lessThan500 = mergedPRs.reduce((accum, pr) => {
    if (pr.size < 500) {
      return accum + 1;
    }
    return accum;
  }, 0);

  const noComments = mergedPRs.reduce((accum, pr) => {
    if (pr.reviewComments === 0) {
      return accum + 1;
    }
    return accum;
  }, 0);

  const moreThan1000 = mergedPRs.reduce((accum, pr) => {
    if (pr.size > 1000) {
      return accum + 1;
    }
    return accum;
  }, 0);

  console.log(
    'averageTime',
    intervalToDuration({
      start: 0,
      end: averageTime,
    })
  );
  console.log(
    'mediean size',
    intervalToDuration({
      start: 0,
      end: median(mergedPRs.map((pr) => pr.timeToMerge)),
    })
  );
  console.log(
    'no comments',
    noComments,
    ((noComments / mergedPRs.length) * 100).toFixed(2)
  );
  console.log('averageComments', averageComments);
  console.log('averageSize', averageSize);
  console.log('mediean size', median(mergedPRs.map((pr) => pr.size)));
  console.log(
    'less than 500',
    lessThan500,
    ((lessThan500 / mergedPRs.length) * 100).toFixed(2)
  );
  console.log(
    'greater than 1000',
    moreThan1000,
    ((moreThan1000 / mergedPRs.length) * 100).toFixed(2)
  );
  const array = [];
  mergedPRs.forEach((pr) => {
    array.push(...pr.commentAuthors);
  });

  navigator.clipboard.writeText(array);

  // const { prsByAuthor, filesByPr } = useMemo(() => {
  //   if (!data || !data.repository) return { prsByAuthor: {}, filesByPr: {} };

  //   const prsByAuthor = groupBy(
  //     data.repository.pullRequests.nodes ?? [],
  //     (prNode) => prNode?.author?.login ?? 'no_author'
  //   );

  //   const filesByPr: Record<string, number> = {};
  //   data.repository.pullRequests.nodes?.forEach((pr) => {
  //     pr?.files?.edges?.forEach((file) => {
  //       if (file?.node?.path) {
  //         if (filesByPr[file.node.path] === undefined) {
  //           filesByPr[file.node.path] = 0;
  //         }
  //         filesByPr[file.node.path] += 1;
  //       }
  //     });
  //   });

  //   return {
  //     prsByAuthor,
  //     filesByPr,
  //   };
  // }, [data]);

  // return (
  //   <div className="grid grid-cols-2 gap-2 h-2/3">
  //     <div className="overflow-y-scroll border p-8 border-r-4">
  //       <p>🔥 Hot Files 🔥</p>
  //       <div className="grid grid-cols-4 gap-2">
  //         <p className="col-span-3">Path</p>
  //         <p># of PRs</p>
  //         {Object.entries(filesByPr)
  //           .sort(([_, aCount], [__, bCount]) => bCount - aCount)
  //           .map(([path, count]) => {
  //             return (
  //               <>
  //                 <p className="col-span-3">{path}</p>
  //                 <p>{count}</p>
  //               </>
  //             );
  //           })}
  //       </div>
  //     </div>
  //     <div className="grid grid-cols-5 gap-4 border p-8 border-r-4 overflow-y-scroll">
  //       <span>Author</span>
  //       <span># PRs</span>
  //       <span>Avg # Files </span>
  //       <span>Avg Additions</span>
  //       <span>Avg Deletions</span>
  //       {Object.entries(prsByAuthor).map(([key, value], index) => {
  //         const totalAdditions = reduce(
  //           value,
  //           (sum, pr) => sum + (pr?.additions ?? 0),
  //           0
  //         );
  //         const totalDeletions = reduce(
  //           value,
  //           (sum, pr) => sum + (pr?.deletions ?? 0),
  //           0
  //         );
  //         const totalFiles = reduce(
  //           value,
  //           (sum, pr) => sum + (pr?.files?.edges?.length ?? 0),
  //           0
  //         );
  //         const prCount = value.length;
  //         return (
  //           <>
  //             <span>{key}</span>
  //             <span> {prCount}</span>
  //             <span> {(totalFiles / prCount).toFixed(2)}</span>
  //             <span> {(totalAdditions / prCount).toFixed(2)}</span>
  //             <span> {(totalDeletions / prCount).toFixed(2)}</span>
  //           </>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
}
