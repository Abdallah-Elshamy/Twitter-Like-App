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
        },
        EditProfileImage: {
          read() {
            return EditProfileImageVal();
          }
        },
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

export const EditProfileImageVal: ReactiveVar<{ Image: object | false, ImageURL: string | false }> = makeVar<any>(
  {
    Image: false,
    ImageURL: false
  });

