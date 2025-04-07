import { PrismaClient } from "@prisma/client";
import { dateScalar } from "./scalar.js";

const prisma = new PrismaClient();
export const resolvers = {
  Date: dateScalar,
  Query: {
    fetchProjects: async () => {
      const projects = await prisma.project.findMany({
        omit: {
          detailed_description: true,
          contributions: true,
        },
        orderBy:
        {
          date: "desc"
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
}
