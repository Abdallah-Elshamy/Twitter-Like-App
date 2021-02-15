
import {  gql} from '@apollo/client';

export const LoggedUser= gql`
      query logged_user {
        user(id:1){  
            userName
            name
            imageURL
            bio
            coverImageURL
            createdAt   
            tweets {
              totalCount
            }     
        }
}`