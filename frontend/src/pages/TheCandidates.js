import React from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 95vh;
  width: 100vw;
  background-image: linear-gradient(
    to bottom,
    #040404,
    #040404ee,
    #04040400,
    #040404ee,
    #040404
  );
  background-size: cover;
  background-repeat: no-repeat;
  h1 {
    text-align: center;
    width: 100%;
    font-size: 10rem;
    color: #eeeeee;
    margin: 0 auto;
  }
  div {
    display: grid;
    grid-template-columns: 5fr 1fr 5fr;
    width: 100%;
    height: 50vh;
    align-content: center;
    justify-content: center;

    h2 {
      text-align: center;
      width: 100%;
      font-size: 6rem;
      color: #eeeeee;
    }
    img {
      width: 100%;
      :hover {
        filter: drop-shadow(16px 16px 20px #eeeeee);
      }
    }
  }
  @media (max-width: 769px) {
    h1 {
      font-size: 10vw;
    }
    div {
      grid-template-columns: 1fr;
      h2 {
        font-size: 8vw;
        margin: 0 auto;
      }
    }
  }
`;
const TheCandidates = () => {
  const data = useStaticQuery(query);
  return (
    <Layout>
      <BackgroundImage
        Tag="div"
        fluid={data.backgroundImage.childImageSharp.fluid}
        fadeIn
        backgroundColor={`#292929`}
        style={{ width: '100%' }}
      >
        <Container>
          <h1>Learn More</h1>
          <div>
            <a href="/Goof">
              <img
                src="https://fontmeme.com/permalink/201009/49f3a38b18958749c4dd576d87d9db4f.png"
                alt="super-smash-bros-font"
                border="0"
              />
            </a>
            <h2>VS</h2>
            <a href="/Fry">
              <img
                src="https://fontmeme.com/permalink/201009/71ffc2ded6db45d7d0d88ce296e5efc5.png"
                alt="super-smash-bros-font"
                border="0"
              />
            </a>
          </div>
        </Container>
      </BackgroundImage>
    </Layout>
  );
};

export default TheCandidates;

const query = graphql`
  query CandidatesQuery {
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
  }
`;
