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
        authenticated: {
          read() {
            return authenticatedVal();
          }
        }
      }
    }
  }
});

export const searchBarVar: ReactiveVar<searchBarValue> = makeVar<searchBarValue>(
  { value: '' }
);

export const authenticatedVal: ReactiveVar<boolean> = makeVar<boolean>(
  (localStorage.getItem('token') === null) ? false : true
);
