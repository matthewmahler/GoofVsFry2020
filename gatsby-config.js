const dotenv = require('dotenv');

dotenv.config()

const { spaceId, accessToken } = process.env;
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
        spaceId,
        accessToken,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: ['Quicksand:400,700'],
      },
    },
  ],
};
