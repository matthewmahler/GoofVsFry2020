const dotenv = require('dotenv');

dotenv.config();

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;
module.exports = {
  siteMetadata: {
    title: 'Goof Vs Fry 2020',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-transformer-remark',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: CONTENTFUL_SPACE_ID,
        accessToken: CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: ['Open Sans'],
      },
    },
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        credentials: {
          apiKey: 'AIzaSyA7OBd5J56752CbuZs80S3qHaoNz0Q45eM',
          authDomain: 'goofvsfry2020.firebaseapp.com',
          databaseURL: 'https://goofvsfry2020.firebaseio.com',
          projectId: 'goofvsfry2020',
          storageBucket: 'goofvsfry2020.appspot.com',
          messagingSenderId: '270926913639',
          appId: '1:270926913639:web:6286a3ae6b926dbe5b74c2',
        },
      },
    },
  ],
};
