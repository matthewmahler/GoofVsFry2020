import React from 'react';
import Layout from '../components/Layout';
import BackgroundImage from 'gatsby-background-image';
import styled from 'styled-components';
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
  h1 {
    text-align: center;
    width: 100%;
    font-size: 6rem;
    color: #eeeeee;
    margin: 0 auto;
  }
  h3 {
    text-align: center;
    width: 100%;
    font-size: 3rem;
    color: red;
    margin: 0 auto;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    h2,
    a {
      text-align: center;
      width: 100%;
      font-size: 4rem;
      color: red;
      margin: 0 auto;
    }
    h3 {
      text-align: center;
      width: 100%;
      font-size: 3rem;
      color: red;
      margin: 0 auto;
    }
    p {
      text-align: center;
      width: 100%;
      font-size: 2.5rem;
      color: #eee;
      margin: 0 auto;
    }
  }
  .vote {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    height: 50vh;
    width: 100%;
    button {
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
      :disabled {
        filter: grayscale(1.5);
        cursor: default;
      }
    }
  }
  @media (max-width: 769px) {
    h1 {
      font-size: 8vw;
    }
    div {
      h2,
      a {
        font-size: 5vw;
      }
      h3 {
        text-align: center;
        width: 100%;
        font-size: 4vw;
        color: red;
        margin: 0 auto;
      }
      p {
        font-size: 3vw;
      }
    }
    .vote {
      button {
        font-size: 6vw;
        padding: 2rem;
      }
    }
  }
`;

const VoteNow = () => {
  const img = useStaticQuery(query);

  return (
    <Layout>
      <BackgroundImage
        Tag="div"
        fluid={img.backgroundImage.childImageSharp.fluid}
        fadeIn
        backgroundColor={`#292929`}
        style={{ width: '100%' }}
      >
        <Container>
          <h1>THE ELECTION HAS ENDED</h1>
        </Container>
      </BackgroundImage>
    </Layout>
  );
};

export default VoteNow;

const query = graphql`
  query VoteQuery {
    backgroundImage: file(relativePath: { eq: "vote.jpg" }) {
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
