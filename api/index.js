require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server-express");

const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const express = require("express");
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require("graphql-upload");
const { finished } = require("stream/promises");

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
});

var imageSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  encoding: String,
});

const Possession = mongoose.model("Possession", possessionSchema);
const Image = mongoose.model("Image", imageSchema);

const typeDefs = gql`
  scalar Upload

  type Possession {
    id: ID!
    name: String
    description: String
    price: Int
    images: [Image]
  }

  type Query {
    possessions: [Possession]
    possession(id: ID): Possession
  }

  input ImageInput {
    filename: String
    mimetype: String
    encoding: String
  }

  input PossessionInput {
    name: String!
    description: String
    price: Int!
    images: [ImageInput]
  }

  type Mutation {
    addPossession(possession: PossessionInput): [Possession]
    addImage(image: Upload!): [Image]
  }

  type Image {
    id: ID!
    filename: String
    mimetype: String
    encoding: String
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
    addImage: async (_obj, { image }, _context, _info) => {
      try {
        const { createReadStream, filename, mimetype, encoding } =
          await image.file;
        console.log("================");
        console.log(image);
        console.log("================");
        console.log(createReadStream, filename, mimetype, encoding);

        const stream = createReadStream();

        // This is purely for demonstration purposes and will overwrite the
        // local-file-output.txt in the current working directory on EACH upload.
        const out = require("fs").createWriteStream(`uploads/${filename}`);
        // const out = require("fs").createWriteStream(`upload.jpg`);
        stream.pipe(out);
        await finished(out);

        return [{ filename, mimetype, encoding }];
      } catch (e) {
        console.log(e);
        return {};
      }
    },
  },
};

// pull out introspection true and playground true before real deploy
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });
  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
