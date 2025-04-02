import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
//import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const typeDefs = `#graphql
  type Query {
    fetchProjects: [Project]
    project(id: Int!): Project
  }

  type Project @cacheControl(maxAge: 600) {
    id : Int!
    title: String!
    image: String!
    short_description: String!
    detailed_description: String!
    date: String!
    languages: [String!]
    github_repo: String
    website: String
    contributions: [String!]
    credits: [Person!]
  }

  type Person @cacheControl(maxAge: 600) {
    id : Int!
    name: String!
    github: String
    linkedin: String
    projects: [Project!]
  }

  input CreateProjectInput{
    title: String!
    short_description: String!
    image: String!
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

    createManyProject(
        many_project: [CreateProjectInput!]
    ): [Project!]

    updateProjectImage(
        id: Int!
        image: String!
    ): Project!

    createPerson(
        person: CreatePersonInput!
    ): Person!

    createManyPerson(
        many_person: [CreatePersonInput!]
    ): [Person!]
  }

  enum CacheControlScope {
      PUBLIC
      PRIVATE
  }
    
  directive @cacheControl(
      maxAge: Int
      scope: CacheControlScope
      inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
`;

const resolvers = {
  Query: {
    fetchProjects: async () => {
      const projects = await prisma.project.findMany({
        omit: {
          detailed_description: true,
          contributions: true,
        }
      });
      return projects;
    },

    project: async (_: any, args: { id: number }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: args.id
        },
        include: {
          credits: true,
        }
      },
      )
      return project
    }
  },

  Mutation: {
    createProject: async (_: any, args: any) => {
      const project = await prisma.project.create({
        data: {
          ...args.project,
        },
      });
      return project;
    },

    createManyProject: async (_: any, args: any) => {
      const manyProject = await prisma.project.createManyAndReturn({
        data: args.manyProject
      });

      return manyProject;
    },

    updateProjectImage: async (_: any, args: { id: number, image: string }) => {
      const project = await prisma.project.update({
        where: {
          id: args.id,
        },
        data: {
          image: args.image,
        }
      })
      return project
    },

    createPerson: async (_: any, args: any) => {
      const person = await prisma.person.create({
        data: args.person
      });
      return person;
    },

    createManyPerson: async (_: any, args: any) => {
      const manyPerson = await prisma.person.createManyAndReturn({
        data: args.many_person
      });
      return manyPerson;
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
