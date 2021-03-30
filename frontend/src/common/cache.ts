import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { isUndefined } from "util";
import { searchBarValue } from "./TypesAndInterfaces";
import  { User, logUser } from "./TypesAndInterfaces";

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