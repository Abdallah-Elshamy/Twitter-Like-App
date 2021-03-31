import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { searchBarValue } from "./TypesAndInterfaces";
import  {  logUser } from "./TypesAndInterfaces";

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchBarValue: {
          read() {
            return searchBarVar();
          }
        },
        logUser:{
          read() {
            return userVar ();
          }
        }
        //next

      }
    }
  }
});


export const searchBarVar: ReactiveVar<searchBarValue> = makeVar<searchBarValue>(
  { value: '' }
);
export const userVar: ReactiveVar< logUser > = makeVar< logUser >(
  { 
    user:undefined
    }
);