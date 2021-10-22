const path = require ('path');

const express = require ('express');
const mongoose = require ('mongoose');
const multer = require ('multer');
const {v4: uuidv4} = require ('uuid');
const {graphqlHTTP} = require ('express-graphql');

const app = express ();

const auth = require ('./middlewares/is-auth');
const graphqlSchema = require ('./graphql/schema');
const graphqlResolver = require ('./graphql/resolves');

const PORT = 8080;
const MONGODB_URI =
  'mongodb+srv://marshall:SEIBuTEBNqrSFeE3@cluster0.xz9dy.mongodb.net/feed?retryWrites=true&w=majority';

const fileStorage = multer.diskStorage ({
  destination: (req, file, cb) => {
    cb (null, 'images');
  },
  filename: (req, file, cb) => {
    cb (null, uuidv4 ());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb (null, true);
  } else {
    cb (null, false);
  }
};

// Parsing json data
app.use (express.json ());

// Multer
app.use (
  multer ({storage: fileStorage, fileFilter: fileFilter}).single ('image')
);

// Static folder
app.use ('/images', express.static (path.join (__dirname, 'images')));

// Allow connection
app.use ((req, res, next) => {
  res.setHeader ('Access-Control-Allow-Origin', '*');
  res.setHeader (
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader ('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus (200);
  }
  next ();
});

app.use (auth);

app.put ('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error ('Not authenticated');
  }
  if (!req.file) {
    res.status (200).json ({message: 'No image provided!'});
  }
  const path = req.file.path.replace ('\\', '/');
  return res.status (201).json ({message: 'File stored!', file: path});
});

// graphql
app.use (
  '/graphql',
  graphqlHTTP ({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn: err => {
      if (!err.originalError) {
        return {
          message: err.message,
          locations: err.locations,
          stack: err.stack ? err.stack.split ('\n') : [],
          path: err.path,
        };
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occured';
      const code = err.originalError.statusCode || 500;
      return {
        message: message,
        data: data,
        statusCode: code,
      };
    },
  })
);

// Error handling
app.use ((error, req, res, next) => {
  console.log (error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status (status).json ({message: message, data: data});
});

mongoose
  .connect (MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then (() => {
    app.listen (PORT, error => {
      if (error) {
        console.log (error);
      } else {
        console.log ('Server is listening on PORT', PORT);
      }
    });
  })
  .catch (err => {
    console.log (err);
  });
