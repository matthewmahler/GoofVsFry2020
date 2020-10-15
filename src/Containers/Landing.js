import React from 'react';
import styled from 'styled-components';
import BackgroundImage from 'gatsby-background-image';
import Img from 'gatsby-image';
import { useStaticQuery, graphql, Link } from 'gatsby';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 93vh;
  width: 100vw;
  background-image: linear-gradient(to bottom, #040404, #04040400, #040404);
  background-size: cover;
  background-repeat: no-repeat;
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 60vh;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      h2 {
        font-size: 6rem;
        color: #eeeeee;
      }
      img {
        width: 90%;
      }
    }
  }
  a {
    margin-top: 2rem;
    border: 2px solid #eeeeee;
    border-radius: 1rem;
    background-color: #040404;
    font-size: 6rem;
    color: #eeeeee;
    padding: 4rem;
    :hover {
      border: 2px solid red;
      color: red;
      filter: drop-shadow(1.5);
      cursor: pointer;
    }
  }
`;
const Landing = () => {
  const data = useStaticQuery(query);

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
            <img
              src="https://fontmeme.com/permalink/201009/49f3a38b18958749c4dd576d87d9db4f.png"
              alt="super-smash-bros-font"
              border="0"
            />
            <Img
              fluid={data.allImageSharp.edges[2].node.fluid}
              fadeIn
              backgroundColor={`#292929`}
            />
          </div>
          <div>
            <img
              src="https://fontmeme.com/permalink/201009/71ffc2ded6db45d7d0d88ce296e5efc5.png"
              alt="super-smash-bros-font"
              border="0"
            />
            <Img
              fluid={data.allImageSharp.edges[0].node.fluid}
              fadeIn
              backgroundColor={`#292929`}
            />
          </div>
        </div>
        <Link
          to={`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.GATSBY_TWITCH_CLIENT_ID}&redirect_uri=https://www.makeamericagoofagain.com/VoteNow&response_type=token+id_token&scope=openid`}
        >
          VOTE NOW
        </Link>
      </Container>
    </BackgroundImage>
  );
};

export default Landing;

const query = graphql`
  query LandingQuery {
    backgroundImage: file(relativePath: { eq: "landing.jpg" }) {
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
    allImageSharp {
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
