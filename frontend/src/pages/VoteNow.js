import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import BackgroundImage from 'gatsby-background-image';

import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { context } from '../Context/provider';

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
`;

const VoteNow = () => {
  const img = useStaticQuery(query);
  const [error, setError] = useState(null);

  const { setParams, params, hasVoted, data, setData } = useContext(context);

  const url = `https://id.twitch.tv/oauth2/userinfo`;
  async function fetchUrl() {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${params.access_token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setData(json);
        setError(null);
      } else {
        setError(json);
      }
    } catch (e) {
      setError(e);
    }
  }
  function isEmptyObject(obj) {
    return JSON.stringify(obj) === '{}';
  }
  useEffect(() => {
    function getSearchParameters() {
      var prmstr = window.location.hash.substr(1);
      return prmstr != null && prmstr !== ''
        ? transformToAssocArray(prmstr)
        : {};
    }

    function transformToAssocArray(prmstr) {
      var params = {};
      var prmarr = prmstr.split('&');
      for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split('=');
        params[tmparr[0]] = tmparr[1];
      }
      return params;
    }
    setParams(getSearchParameters());
  }, []);
  useEffect(() => {
    if (params !== null) {
      fetchUrl();
    }
  }, [params]);

  async function vote(userId, username, candidate) {
    const post = 'http://localhost:5000/api/votes';
    const data = {
      userId,
      username,
      voteDate: new Date().toISOString(),
      candidate,
      voteId: Math.floor(Math.random() * 100000),
    };
    const response = await fetch(post, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    console.log(await json);
  }
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
          <div className="vote">
            <button
              disabled={hasVoted}
              onClick={() => vote(data.sub, data.preferred_username, 'Goof')}
            >
              Vote Goof
            </button>
            <button
              disabled={hasVoted}
              onClick={() => vote(data.sub, data.preferred_username, 'Fry')}
            >
              Vote Fry
            </button>
          </div>

          {error && (
            <div>
              <h2>Something Went Wrong</h2>
              <h3>Error Message: "{error.message}"</h3>
              <p>
                Please message @EmoMatt#4019 on Discord and tell him he fucked
                something up :)
              </p>
            </div>
          )}
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
