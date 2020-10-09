import React from 'react';
import styled from 'styled-components';
import BackgroundImage from 'gatsby-background-image';
import Img from 'gatsby-image'
import { StaticQuery, graphql } from 'gatsby';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 95vh;
  width: 100vw;
  background-image: linear-gradient(to bottom, #040404, #04040400, #040404);
  background-size: cover;
  background-repeat: no-repeat;
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 60vh;
    div{
      display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
      width: 100%;
      h2{
        font-size: 6rem;
        color: #eeeeee;
      }
      img{
        width: 100%;
      }
    }
  }
button{
  margin-top: 2rem;
  border-radius: 1rem;
  background-color: #292929;
  font-size: 6rem;
        color: #eeeeee;
}
`;
const Landing = () => {

  return (
    <StaticQuery
      query={query}
      render={(data) => {
        console.log(data);
        return (
          <BackgroundImage
            Tag="div"
            fluid={data.backgroundImage.childImageSharp.fluid}
            fadeIn
            backgroundColor={`#292929`}
            style={{ width: '100%' }}
          >
            <Container>
              <div>
                <div>
                  <a href="https://fontmeme.com/super-smash-bros-font/"><img src="https://fontmeme.com/permalink/201009/49f3a38b18958749c4dd576d87d9db4f.png" alt="super-smash-bros-font" border="0" /></a>
                  <Img
                    fluid={data.allImageSharp.edges[1].node.fluid}
                    fadeIn
                    backgroundColor={`#292929`}
                  />
                </div>
                <div>
                  <a href="https://fontmeme.com/super-smash-bros-font/"><img src="https://fontmeme.com/permalink/201009/71ffc2ded6db45d7d0d88ce296e5efc5.png" alt="super-smash-bros-font" border="0" /></a>
                  <Img
                    fluid={data.allImageSharp.edges[0].node.fluid}
                    fadeIn
                    backgroundColor={`#292929`}
                  />
                </div>
              </div>
              <button>VOTE NOW</button>
            </Container>
          </BackgroundImage>)
      }}
    />
  );
};

export default Landing;


const query = graphql`
  query LandingQuery {
    
  backgroundImage: file(relativePath: {eq: "landing.jpg"}) {
    childImageSharp {
      fluid {
        tracedSVG
        srcWebp
        srcSetWebp
        srcSet
        src
      }
    }
  }
  allImageSharp(limit: 2) {
    edges {
      node {
        fluid {
          tracedSVG
          srcWebp
          srcSetWebp
          srcSet
          src
          sizes
          presentationWidth
          presentationHeight
          originalName
          originalImg
          base64
          aspectRatio
        }
      }
    }
  }

  }
`;