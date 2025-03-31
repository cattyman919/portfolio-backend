import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
//import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const typeDefs = `#graphql
  type Query {
    fetchProjects: [Project]
  }

  type Project {
    id : Int!
    title: String!
    short_description: String!
    detailed_description: String!
    date: String!
    languages: [String!]
    github_repo: String
    website: String
    contributions: [Credit_Person!]
  }

  type Credit_Person {
    id : Int!
    name: String!
    github: String
    linkedin: String
    projects: [Project!]
  }

  # Input types for Project creation
  input CreateProjectInput{
    title: String!
    short_description: String!
    detailed_description: String!
    date: String!
    languages: [String!]
    github_repo: String
    website: String
  }

  # Input types for CreditPerson creation
  input CreateCreditPersonInput {
    name: String!
    github: String
    linkedin: String
  }

  type Mutation {
    createProject(
        project: CreateProjectInput!
    ): Project!

    createCreditPerson(
        credit_person: CreateCreditPersonInput!
    ): Credit_Person!
  }
`;

const resolvers = {
  Query: {
    fetchProjects: async () => {
      const projects = await prisma.project.findMany({
        include: {
          contributions: true,
        },
      });
      return projects;
    },
  },
  Mutation: {
    createProject: async (_: any, args:any) => {
      // Convert date string to Date object
      const dateObj = new Date(args.project.date);
      
      const project = await prisma.project.create({
        data: {
          date: dateObj,
          ...args.project,
        },
      });
      return project;
    },
    
    createCreditPerson: async (_:any, args:any) => {
      const credit_person = await prisma.credit_Person.create({
        data: {
          ...args.credit_person
        },
      });
      return credit_person;
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const {url} = await startStandaloneServer(server,{
  listen: {port: 4000}
})

console.log(url , "Server ready at port", 4000);
//export const graphqlHandler = startServerAndCreateLambdaHandler(
//  server,
//  handlers.createAPIGatewayProxyEventV2RequestHandler(),
//);
