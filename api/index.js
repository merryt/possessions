const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
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
  }

  type Query {
    possessions: [Possession]
    possession(id: ID): Possession
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
    images: [images[0]],
    location: "APPARTMENT",
  },
  {
    id: "2",
    name: "Ikea Chair",
    description: "todo: write a description",
    price: 50,
    images: [images[1]],
    location: "APPARTMENT",
  },
];

const resolvers = {
  Query: {
    possessions: () => {
      return possessions;
    },
    possession: (obj, args, context, info) => {
      return (possession = possessions.find(
        (possession) => args.id === possession.id
      ));
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`server started at ${url}`);
  });
