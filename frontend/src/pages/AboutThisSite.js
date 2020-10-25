import React from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import Img from 'gatsby-image';
import {
  faSpotify,
  faGithub,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 60vh;
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
  @media (max-width: 769px) {
    h1 {
      font-size: 8vw;
    }
    div {
      grid-template-columns: 1fr;

      div {
        width: 100%;

        p {
          width: 80%;
          font-size: 3vw;
        }
      }
    }
  }
`;
const SocialLinksList = styled.ul`
  margin: 24px 0;
  padding: 0;
  font-size: 30px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.8);
  color: #eee;
  li {
    display: inline-block;
    margin: 0 15px;
    padding: 0;
    a {
      color: #eee;
    }
  }
  li a:hover {
    color: #39b1ff;
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
            <div
              dangerouslySetInnerHTML={{
                __html: data.contentfulAbout.bio.childMarkdownRemark.html,
              }}
            ></div>
          </div>
          <SocialLinksList className="social">
            <li>
              <a href="https://open.spotify.com/artist/4TWQJppHQYlY4FlzuvEDUc?si=ua9v2DLsRQ-S1fekDCsUvA">
                <FontAwesomeIcon icon={faSpotify} />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/matthew-mahler-09003a163/">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </li>

            <li>
              <a href="https://www.instagram.com/matthewmahler/">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
            <li>
              <a href="https://github.com/matthewmahler">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </li>
          </SocialLinksList>
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
