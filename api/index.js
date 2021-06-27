const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Possession {
    id: ID!
    name: String!
    description: String
    price: Int
    images: [Image]
  }

  type Query {
    possessions: [Possession]
  }

  type Image {
    id: ID!
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
    images: [images[0]],
  },
  {
    id: 2,
    name: "Ikea Chair",
    description: "todo: write a description",
    price: 50,
    images: [images[1]],
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
