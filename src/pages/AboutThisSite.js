import React from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import Img from 'gatsby-image';

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
    font-size: 10rem;
    color: #eeeeee;
    margin: 0 auto;
  }
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    height: 60vh;
    justify-items: center;
    align-items: center;

    div {
      margin: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 50%;

      p {
        font-size: 2rem;
      }
    }
  }
`;
const AboutThisSite = () => {
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
          <h1>{data.contentfulAbout.title}</h1>
          <div>
            <div>
              <Img
                fluid={data.contentfulAbout.photo.fluid}
                fadeIn
                backgroundColor={`#292929`}
                style={{ width: '100%', borderRadius: '1rem' }}
              />
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: data.contentfulAbout.bio.childMarkdownRemark.html,
              }}
            ></div>
          </div>
        </Container>
      </BackgroundImage>
    </Layout>
  );
};

export default AboutThisSite;

const query = graphql`
  query AboutQuery {
    contentfulAbout {
      title
      bio {
        childMarkdownRemark {
          html
        }
      }
      photo {
        fluid {
          srcWebp
          tracedSVG
          srcSetWebp
          srcSet
          src
          sizes
          base64
          aspectRatio
        }
      }
      socials
    }
    backgroundImage: file(relativePath: { eq: "about.jpg" }) {
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
