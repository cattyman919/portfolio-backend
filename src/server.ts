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
    contributions: [String!]
    credits: [Person!]
  }

  type Person {
    id : Int!
    name: String!
    github: String
    linkedin: String
    projects: [Project!]
  }

  input CreateProjectInput{
    title: String!
    short_description: String!
    detailed_description: String!
    date: String!
    languages: [String!]
    github_repo: String
    website: String
    contributions: [String!]
  }

  input CreatePersonInput {
    name: String!
    github: String
    linkedin: String
  }

  type Mutation {
    createProject(
        project: CreateProjectInput!
    ): Project!

    createPerson(
        person: CreatePersonInput!
    ): Person!
  }
`;

const resolvers = {
  Query: {
    fetchProjects: async () => {
      const projects = await prisma.project.findMany({
        include: {
          credits: true,
        },
      });
      return projects;
    },
  },
  Mutation: {
    createProject: async (_: any, args: any) => {
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

    createPerson: async (_: any, args: any) => {
      const person = await prisma.person.create({
        data: {
          ...args.person
        },
      });
      return person;
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(url, "Server ready at port", 4000);
//export const graphqlHandler = startServerAndCreateLambdaHandler(
//  server,
//  handlers.createAPIGatewayProxyEventV2RequestHandler(),
//);
