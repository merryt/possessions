require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@realmcluster.rmvdh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { userNewUrlParser: true }
);
const db = mongoose.connection;

var possessionSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
  location: String,
  postedDate: Date,
});

var imageSchema = new mongoose.Schema({
  description: String,
  url: String,
});

const Possession = mongoose.model("Possession", possessionSchema);
const Image = mongoose.model("Image", imageSchema);

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
    images: [Image]
    location: Location!
    postedDate: Date
  }

  type Query {
    possessions: [Possession]
    possession(id: ID): Possession
  }

  input ImageInput {
    description: String
    url: String
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
    addImage(image: ImageInput): [Image]
  }

  type Image {
    id: ID!
    description: String
    url: String!
  }
`;

const resolvers = {
  Query: {
    possessions: async () => {
      try {
        return await Possession.find();
      } catch (e) {
        console.log(e);
        return [];
      }
    },
    possession: async (_obj, args, _context, _info) => {
      try {
        return await Possession.findById(args.id);
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  },
  Possession: {
    images: async (obj, _args, _context, _info) => {
      if (!obj.images) {
        return [];
      }

      const filteredImages = await obj.images.map(async (image) => {
        return await Image.findById(image);
      });

      return filteredImages;
    },
  },

  Mutation: {
    addPossession: async (_obj, { possession }, _context, _info) => {
      try {
        images = [];
        for (image of possession.images) {
          createdImage = await Image.create(image);
          images.push(createdImage._id);
        }
        possession.images = images;

        await Possession.create(possession);
        return await Possession.find();
      } catch (e) {
        console.log(e);
        return [];
      }
      // create new id and date for possession getting added
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
