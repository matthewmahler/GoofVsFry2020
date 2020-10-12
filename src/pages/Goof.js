import React from 'react';
import styled from 'styled-components';
import BackgroundImage from 'gatsby-background-image';
import { useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/Layout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 95vh;
  width: 100vw;
  background-image: linear-gradient(to bottom, #040404, #040404dd, #040404);
  background-size: cover;
  background-repeat: no-repeat;
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 60vh;
    justify-items: center;
    color: #eeeeee;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 50%;
      h2 {
        font-size: 3rem;
      }
      p {
        font-size: 2rem;
      }
      li {
        font-size: 2rem;
      }
    }
  }
`;
const Goof = () => {
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
          <img
            src="https://fontmeme.com/permalink/201009/49f3a38b18958749c4dd576d87d9db4f.png"
            alt="super-smash-bros-font"
            border="0"
          />
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: data.contentfulCandidate.bio.childMarkdownRemark.html,
              }}
            ></div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  data.contentfulCandidate.platform.childMarkdownRemark.html,
              }}
            ></div>
          </div>
        </Container>
      </BackgroundImage>
    </Layout>
  );
};

export default Goof;

const query = graphql`
  query GoofQuery {
    contentfulCandidate(name: { eq: "GoofinAbout" }) {
      bio {
        childMarkdownRemark {
          html
        }
      }
      platform {
        childMarkdownRemark {
          html
        }
      }
    }
    backgroundImage: file(relativePath: { eq: "bg.jpg" }) {
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
