import React from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import BackgroundImage from 'gatsby-background-image';
import { useStaticQuery, graphql } from 'gatsby';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 95vh;
  width: 100vw;
  background-image: linear-gradient(to bottom, #040404, #040404cc, #040404);
  background-size: cover;
  background-repeat: no-repeat;
  color: #eeeeee;

  h1 {
    text-align: center;
    width: 100%;
    font-size: 6rem;
    color: #eeeeee;
    margin: 0 auto;
  }
  p {
    font-size: 3rem;
  }
`;

const HowToVote = () => {
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
          <h1>How To Vote</h1>
          <p>
            Step 1: Click the "Vote Now" link, or the Button on the Home Page
          </p>
          <p>Step 2: Log in With Your Twitch Account</p>
          <p>Step 3: Cast your Vote!</p>
        </Container>
      </BackgroundImage>
    </Layout>
  );
};

export default HowToVote;

const query = graphql`
  query HowTo {
    backgroundImage: file(relativePath: { eq: "howto.jpg" }) {
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
