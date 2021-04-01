import React, { Fragment } from "react"
import { useQuery } from '@apollo/client';
import { Tweets } from "../TweetQuery";
import { parseJwt } from '../../common/decode';
import { InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import Feed from "./feed";


export interface TweetFilter {
  filter: string
}
var limit = 0 ;

const  Profilewallpage: React.FC<TweetFilter> = (props) => {
  var profile;
  var page = 2 ;


  if (localStorage.getItem('token') !== "LOGOUT") {
    profile = parseJwt(localStorage.getItem('token'))
  }

  // const cache = new InMemoryCache({
  //   typePolicies: {
  //     Query: {
  //       fields: {
  //         feed: {
  //           read(existing, {
  //             args: {
  //               // Default to returning the entire cached list,
  //               // if offset and limit are not provided.
  //               offset = 0,
  //               limit = existing?.length,
  //             } = {},
  //           }) {
  //             return existing && existing.slice(offset, offset + limit);
  //           },
  //           keyArgs: false,
  //           merge(existing = [], incoming) {
  //             return [...existing, ...incoming];
  //         },
  //       },
  //     },
  //   },
  // });

  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            read(existing) {
              // A read function should always return undefined if existing is
              // undefined. Returning undefined signals that the field is
              // missing from the cache, which instructs Apollo Client to
              // fetch its value from your GraphQL server.
              return existing && existing ;
            },
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            }
            },
        },
      },
    },
  });

  const { loading, data, fetchMore } = useQuery(Tweets,
    {
      variables: {
        userId: profile.id,
        filter: props.filter ,
        page : page
      }
    });

  if (loading) return <p>'Loading .. '</p>

  return (
    < Feed
      tweet = {data.tweets.tweets || []}
      onLoadMore = {() =>
        fetchMore({
          variables: {
            page : page + 1
    
          } , 
          updateQuery: (prev = [], { fetchMoreResult }) =>
           fetchMoreResult
          // updateQuery: (prev, { fetchMoreResult }) => {
          //   if (!fetchMoreResult) return prev;
          //   return Object.assign({}, prev, {
          //     tweet: [...prev , ...fetchMoreResult ]
          //   });
          // }

        })
      }  
    />
      
  );
}



//   return (

//     <Fragment>
//       {console.log(data.tweets.tweets)}
//       {

//         data.tweets.tweets.map((tweet: TweetData) => {
//           return <Tweet text={tweet.text}
//             repliesCount={tweet.repliesCount}
//             createdAt={tweet.createdAt}
//             isLiked={tweet.isLiked}
//             user={tweet.user}
//             likesCount={tweet.likesCount}
//             key={tweet.id} />
//         })}
//     </Fragment>
//   )
// }


export default Profilewallpage;