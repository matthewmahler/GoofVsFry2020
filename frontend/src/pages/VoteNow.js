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
`;

const VoteNow = () => {
  const img = useStaticQuery(query);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    setParams,
    params,
    canVote,
    setUser,
    user,
    votes,
    viewer,
    setVotes,
    setViewer,
    setCanVote,
  } = useContext(context);

  const today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  async function fetchUrl(url, options, set) {
    const response = await fetch(url, options);
    const json = await response.json();

    set(json);
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
      const userURL = `https://id.twitch.tv/oauth2/userinfo`;
      const options = {
        headers: { Authorization: `Bearer ${params.access_token}` },
      };

      fetchUrl(userURL, options, setUser);
    }
  }, [params]);

  useEffect(() => {
    if (user !== null) {
      const viewerURL = `http://localhost:5000/api/viewers/${user.preferred_username}`;
      fetchUrl(viewerURL, null, setViewer);
    }
  }, [user]);

  useEffect(() => {
    if (params && user && viewer) {
      setLoading(false);

      const lastVoteDate = new Date(
        new Date(viewer.lastVoteDate).getFullYear(),
        new Date(viewer.lastVoteDate).getMonth(),
        new Date(viewer.lastVoteDate).getDate()
      );
      if (today.getTime() === lastVoteDate.getTime()) {
        setCanVote(false);
        setError(`User: ${viewer.username} cannot vote at this time`);
        const votesURL = `http://localhost:5000/api/votes/${user.sub}`;
        fetchUrl(votesURL, null, setVotes);
      } else if (lastVoteDate === null) {
        setCanVote(true);
      } else {
        setCanVote(true);
      }
    }
  }, [params, user, viewer]);
  async function vote(userId, username, candidate) {
    if (canVote) {
      const vote = 'http://localhost:5000/api/votes';
      const updateViewer = `http://localhost:5000/api/viewers/${user.preferred_username.toLowerCase()}`;
      const data = {
        userId,
        username,
        voteDate: today,
        candidate,
        voteId: Math.floor(Math.random() * 100000),
      };
      const viewerData = {
        lastVoteDate: new Date().toISOString(),
        canVote: 'false',
      };
      const voteResponse = await fetch(vote, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const viewerResponse = await fetch(updateViewer, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewerData),
      });
      const json = await voteResponse.json();
      const json2 = await viewerResponse.json();
      setCanVote(false);
      const votesURL = `http://localhost:5000/api/votes/${user.sub}`;
      fetchUrl(votesURL, null, setVotes);
      console.log(await json);
      console.log(await json2);
    }
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
          {!loading && (
            <>
              {votes && <h3>You have voted {votes.length} times so far!</h3>}

              <div className="vote">
                <button
                  disabled={!canVote}
                  onClick={() =>
                    vote(user.sub, user.preferred_username, 'Goof')
                  }
                >
                  Vote Goof
                </button>
                <button
                  disabled={!canVote}
                  onClick={() => vote(user.sub, user.preferred_username, 'Fry')}
                >
                  Vote Fry
                </button>
              </div>
              {error && (
                <div>
                  <h2>{error}</h2>

                  <p>
                    Please message @EmoMatt#4019 on Discord in the #bugs channel
                    if you think this is a mistake
                  </p>
                </div>
              )}
            </>
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
