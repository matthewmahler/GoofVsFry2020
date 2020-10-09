import React from 'react';
import Helmet from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import Nav from './Nav';

const GlobalStyle = createGlobalStyle`
html{
    overflow-y: scroll;
    overflow-x: hidden;
    font-size: 50%; 
    box-sizing: border-box;
    min-width: 100vw;
    min-height: 100vh;
    scrollbar-color: transparent transparent;
    scrollbar-width: none;
    ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

 
  body, main {
    margin:0;
    font-family: "Montserrat";
    
  }
  @media all and (max-width: 1200px) {
    width: 100%
    html{
      margin: 0;
    }
    
  }
}
`;

function Layout({ children }) {
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <>
          <GlobalStyle />
          <Helmet title={data.site.siteMetadata.title}>
            <html lang="en" />
          </Helmet>
          <Nav />
          <main>{children}</main>
        </>
      )}
    />
  );
}

export default Layout;
