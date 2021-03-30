//output from Mutation that added to db

export interface User {
    id : string ,
    name: String,
    email: String ,
    password: String,
    userName: String ,
    birthDate :String
  }
  
  // input to Mutation as input data
 export interface New_User {
    name: String,
    email: String ,
    password: String,
    userName: String ,
    birthDate :String
  }
