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
  h2 {
    text-align: center;
    font-size: 4rem;
    color: #eeeeee;
    margin: 0 auto;
    margin-top: 2rem;
    border-bottom: 2px solid #eeeeee;
  }
  p {
    font-size: 3rem;
    margin: 0 auto;
    width: 80%;
    text-align: center;
  }
  @media (max-width: 769px) {
    h1 {
      font-size: 8vw;
    }
    h2 {
      font-size: 4vw;
    }
    p {
      text-align: center;
      width: 90%;
      font-size: 2.5vw;
      margin: 0 auto;
    }
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
          <h2>First Time Voter?</h2>
          <p>
            Step 1: Click the "Vote Now" link, or the Button on the Home Page
          </p>
          <p>Step 2: Log in With Your Twitch Account</p>
          <p>Step 3: Cast your Vote!</p>
          <h2>Coming Back to Vote Again?</h2>
          <p>
            As long as you watched today's stream, you are eligible to vote
            again!
          </p>
          <p>
            If you did watch todays stream, but are unable to cast another vote,
            Please message @EmoMatt#4019 on Discord in the #bugs channel
          </p>
          <h2>Done Voting Today?</h2>
          <p>
            Go to the Results page to view the election results and the viewer
            vote leaderboard.
          </p>
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
