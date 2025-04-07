import { ApolloServer } from "@apollo/server";
//import { startStandaloneServer } from "@apollo/server/standalone";
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { typeDefs } from "./typedef.js"
import { resolvers } from "./resolver.js"

//const myPlugin = {
//  // Fires whenever a GraphQL request is received from a client.
//  async requestDidStart(requestContext) {
//    console.log('Request started! Query:\n' + requestContext.request.query);
//    return {
//      // Fires whenever Apollo Server will parse a GraphQL
//      // request to create its associated document AST.
//      async parsingDidStart(requestContext) {
//        console.log('Parsing started!');
//      },
//
//      // Fires whenever Apollo Server will validate a
//      // request's document AST against your GraphQL schema.
//      async validationDidStart(requestContext) {
//        console.log('Validation started!');
//      },
//    };
//  },
//};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //plugins: [myPlugin],
});

//const { url } = await startStandaloneServer(server, {
//  listen: { port: 4000 }
//})

//console.log(url, "Server ready at port", 4000);

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
);
