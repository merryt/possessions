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
    images: [Image]
    location: Location
  }

  type Query {
    possessions: [Possession]
  }

  type Image {
    id: ID!
    description: String
    apearsIn: [Possession]!
  }
`;

const images = [
  {
    id: 3,
  },
  {
    id: 4,
  },
];

const possessions = [
  {
    id: 1,
    name: "Powerspec g**",
    description: "todo: write a description",
    price: 750,
    images: [images[0], images[1]],
    location: "APPARTMENT",
  },
  {
    id: 2,
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
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`server started at ${url}`);
});
