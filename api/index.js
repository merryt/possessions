const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const typeDefs = gql`
  scalar Date

  enum Location {
    STORAGE_UNIT
    BORROWED
    APPARTMENT
  }

  type Possession {
    id: ID!
    name: String!
    description: String
    price: Int
    images: [Image!]!
    location: Location!
    postedDate: Date
  }

  type Query {
    possessions: [Possession]
    possession(id: ID): Possession
  }

  type Mutation {
    addPossession(
      name: String!
      description: String
      price: Int
      location: Location!
      postedDate: Date
    ): [Possession]
  }

  type Image {
    id: ID!
    description: String
    # todo: figure out how to upload images
    apearsIn: [Possession]
  }
`;

const images = [
  {
    id: "3",
    description: "Image 3",
  },
  {
    id: "4",
    description: "Image 4",
  },
];

const possessions = [
  {
    id: "1",
    name: "Powerspec g**",
    description: "todo: write a description",
    price: 750,
    images: [{ id: "3" }, { id: "4" }],
    location: "APPARTMENT",
    postedDate: new Date("7-1-2021"),
  },
  {
    id: "2",
    name: "Ikea Chair",
    description: "todo: write a description",
    price: 50,
    images: [{ id: "3" }],
    location: "APPARTMENT",
    postedDate: new Date("7-2-2021"),
  },
];

const resolvers = {
  Query: {
    possessions: () => {
      return possessions;
    },
    possession: (_obj, args, _context, _info) => {
      return (possession = possessions.find(
        (possession) => args.id === possession.id
      ));
    },
  },
  Possession: {
    images: (obj, _args, _context, _info) => {
      const imageIds = obj.images.map((image) => image.id);
      const filteredImages = images.filter((image) => {
        return imageIds.includes(image.id);
      });

      return filteredImages;
    },
  },

  Mutation: {
    addPossession: (obj, args, context, info) => {
      console.log(args);
      const newPossessionsList = [...possessions, args];
      return newPossessionsList;
    },
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "It is a date",
    parseValue(value) {
      // value from the client
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};

// pull out introspection true and playground true before real deploy
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`server started at ${url}`);
  });
