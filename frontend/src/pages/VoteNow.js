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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // get global context
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

  //get todays date minus the timestamp
  const today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  // reusable fetch function
  async function fetchUrl(url, options, set) {
    const response = await fetch(url, options);
    const json = await response.json();
    set(json);
  }

  // effect to run on component mount
  // get the parameters from the url bar and set them to state
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

  // effect runs after params have been set
  // use the returned params to call the twitch user service
  // then set the returned user into to state
  useEffect(() => {
    if (params !== null) {
      const userURL = `https://id.twitch.tv/oauth2/userinfo`;
      const options = {
        headers: { Authorization: `Bearer ${params.access_token}` },
      };

      fetchUrl(userURL, options, setUser);
    }
  }, [params]);

  // effect runs once user is set
  // call the database for the user's viewer row in the Viewer table
  // set that viewer info to state
  useEffect(() => {
    if (user !== null) {
      const viewerURL = `${process.env.GATSBY_BACKEND_HOST}api/viewers/${user.preferred_username}`;
      fetchUrl(viewerURL, null, setViewer);
    }
  }, [user]);

  // effect runs once params, user and viewer start are all set
  // determine if the viewer is eligible for a vote that day
  useEffect(() => {
    if (params && user && viewer) {
      setLoading(false);

      const lastVoteDate = new Date(
        new Date(viewer.lastVoteDate).getFullYear(),
        new Date(viewer.lastVoteDate).getMonth(),
        new Date(viewer.lastVoteDate).getDate()
      );
      const lastWatchDate = new Date(
        new Date(viewer.lastWatchDate).getFullYear(),
        new Date(viewer.lastWatchDate).getMonth(),
        new Date(viewer.lastWatchDate).getDate()
      );
      // they have voted already today
      if (today.getTime() === lastVoteDate.getTime()) {
        setCanVote(false);
        setError(`User: ${viewer.username} has already voted today`);
        const votesURL = `${process.env.GATSBY_BACKEND_HOST}api/votes/${user.sub}`;
        fetchUrl(votesURL, null, setVotes);
      } else if (
        // they have voted before, but not today, but they didnt watch today
        today.getTime() !== lastVoteDate.getTime() &&
        today.getTime() !== lastWatchDate.getTime() &&
        lastVoteDate !== null
      ) {
        setError(
          `User: ${viewer.username} has voted previously, but did not watch the stream today`
        );
        setCanVote(false);
      } else if (
        // user has never voted
        lastVoteDate === null
      ) {
        console.log(`User: ${viewer.username} has never voted. ENJOY!`);
        setCanVote(true);
      } else {
        // catch all just let them vote and figure it out later
        setCanVote(true);
      }
    }
  }, [params, user, viewer]);

  // vote function
  async function vote(userId, username, candidate) {
    // if they are eligible to vote
    if (canVote) {
      const vote = `${process.env.GATSBY_BACKEND_HOST}api/votes`;
      const updateViewer = `${
        process.env.GATSBY_BACKEND_HOST
      }api/viewers/${user.preferred_username.toLowerCase()}`;

      // vote data
      const data = {
        userId,
        username,
        voteDate: today,
        candidate,
        voteId: Math.floor(Math.random() * 100000),
      };
      // updated viewer data
      const viewerData = {
        lastVoteDate: new Date().toISOString(),
        canVote: 'false',
      };
      // add a vote to the database
      const voteResponse = await fetch(vote, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      // update the viewer to rflect voting today
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
      // get the users new total votes
      const votesURL = `${process.env.GATSBY_BACKEND_HOST}api/votes/${user.sub}`;
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
