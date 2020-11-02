import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import BackgroundImage from 'gatsby-background-image';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { context } from '../Context/provider';
import { useWindowSize } from '../hooks/useWindowSize';
import moment from 'moment';

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
  const [message, setMessage] = useState(null);
  const [chairPosition, setChairPosition] = useState({ x: 0, y: 0 });
  const [isBetween, setIsBetween] = useState(false);
  let [width, height] = useWindowSize();
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
  const today = moment().format('YYYY-MM-DD');

  // reusable fetch function
  async function fetchUrl(url, options, set) {
    const response = await fetch(url, options);
    const json = await response.json();
    set(json);
  }
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    setIsBetween(moment(today).isBetween('2020-11-03', '2020-11-17'));
    setMessage(
      isBetween
        ? 'Voting is now open until 11/17/2020, may the best chair... I mean candidate win :D'
        : 'This is the test voting phase, the real election begins 11/03/2020'
    );
    setChairPosition({ x: getRandomInt(0, width), y: getRandomInt(0, height) });
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
      const lastVoteDate = viewer.lastVoteDate;
      const lastWatchDate = viewer.lastWatchDate;

      if (!isBetween) {
        // they have voted already today
        if (today === lastVoteDate) {
          console.log(`User: ${viewer.username} has already voted today`);
          console.log({ today, lastVoteDate });
          setCanVote(false);
          setError(`User: ${viewer.username} has already voted today`);
          const votesURL = `${process.env.GATSBY_BACKEND_HOST}api/votes/${user.sub}`;
          fetchUrl(votesURL, null, setVotes);
        } else if (
          // they have voted before, but not today, but they didnt watch today
          today !== lastVoteDate &&
          today !== lastWatchDate &&
          lastVoteDate !== null
        ) {
          console.log(
            `User: ${viewer.username} has voted previously, but did not watch the stream today`
          );
          console.log({ today, lastVoteDate, lastWatchDate });
          setError(
            `User: ${viewer.username} has voted previously, but did not watch the stream today`
          );
          setCanVote(false);
        } else if (today !== lastVoteDate && today === lastWatchDate) {
          console.log(`User: ${viewer.username} has never voted. ENJOY!`);
          setError(
            `User: ${viewer.username} has watched today! Enjoy your vote!`
          );
          setCanVote(true);
        } else if (
          // user has never voted
          lastVoteDate === null
        ) {
          console.log(`User: ${viewer.username} has never voted. ENJOY!`);
          setError(`User: ${viewer.username} has never voted. ENJOY!`);
          setCanVote(true);
        } else {
          console.log('IDK WHAT HAPPENED');
          console.log({ today, lastVoteDate, lastWatchDate });
          setError('IDK WHAT HAPPENED');
          setCanVote(false);
        }
      }
    } else {
      setError('Voting is closed, please vist the results page');
    }
  }, [params, user, viewer]);

  // vote function
  async function vote(userId, username, candidate, isChair, e) {
    // if they are eligible to vote
    if (canVote || isChair) {
      setCanVote(false);

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
        lastVoteDate: today,
      };
      setLoading(true);
      // add a vote to the database
      await fetchUrl(
        vote,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
        console.log
      );
      // update the viewer to rflect voting today
      await fetchUrl(
        updateViewer,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(viewerData),
        },
        console.log
      );
      // get the users new total votes
      const votesURL = `${process.env.GATSBY_BACKEND_HOST}api/votes/${user.sub}`;
      await fetchUrl(votesURL, null, setVotes);
      setLoading(false);

      setError(`Thank You ${viewer.username} for voting!`);
      setChairPosition({
        x: getRandomInt(0, width),
        y: getRandomInt(0, height),
      });
    }
    e.stopPropagation();
    e.preventDefault();
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
              {message && <h3>{message}</h3>}
              {votes && <h3>You have voted {votes.length} times so far!</h3>}
              <div className="vote">
                <button
                  disabled={!canVote}
                  onClick={(e) =>
                    vote(user.sub, user.preferred_username, 'Goof', false, e)
                  }
                >
                  Vote Goof
                </button>
                <button
                  disabled={!canVote}
                  onClick={(e) =>
                    vote(user.sub, user.preferred_username, 'Fry', false, e)
                  }
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
          <FontAwesomeIcon
            icon={faChair}
            onClick={(e) =>
              vote(user.sub, user.preferred_username, 'Chair', true, e)
            }
            style={{
              position: 'fixed',
              top: chairPosition.y,
              left: chairPosition.x,
              fontSize: '2px',
            }}
          />
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
