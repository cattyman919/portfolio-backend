export const typeDefs = `#graphql
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
