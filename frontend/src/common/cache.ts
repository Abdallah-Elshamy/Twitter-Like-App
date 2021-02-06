import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { searchBarValue } from "./TypesAndInterfaces";

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchBarValue: {
          read() {
            return searchBarVar();
          }
        },
        //next

      }
    }
  }
});

export const searchBarVar: ReactiveVar<searchBarValue> = makeVar<searchBarValue>(
  { value: '' }
);