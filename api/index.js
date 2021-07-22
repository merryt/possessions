require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@realmcluster.rmvdh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { userNewUrlParser: true }
);
const db = mongoose.connection;

const typeDefs = gql`
  scalar Date

  enum Location {
    STORAGE_UNIT
    BORROWED
    APPARTMENT
  }

  type Possession {
    id: ID!
    name: String
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

  input ImageInput {
    id: ID!
    description: String
    # todo, probably going to want this to include an image
  }

  input PossessionInput {
    name: String!
    description: String
    price: Int!
    location: Location!
    postedDate: Date
    images: [ImageInput]
  }

  type Mutation {
    addPossession(possession: PossessionInput): [Possession]
  }

  type Image {
    id: ID!
    description: String
    # todo: figure out how to upload images
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
    addPossession: (_obj, { possession }, _context, _info) => {
      // create new id and date for possession getting added
      const newPossessionsList = [...possessions, possession];
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

db.on("error", console.error.bind(console), "connection error:");
db.once("open", function () {
  console.log("db is connected");

  server
    .listen({
      port: process.env.PORT || 4000,
    })
    .then(({ url }) => {
      console.log(`server started at ${url}`);
    });
});
