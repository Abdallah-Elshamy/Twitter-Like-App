import graphqlField from "graphql-fields";

export default {
    Query: {
        hello: (_: any, args: any, context: any, info: any) => {
            return {
                title: "post title",
                description: "description title",
            };
        },
    },
};
