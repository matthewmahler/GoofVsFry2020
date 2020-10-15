import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import firebase from 'gatsby-plugin-firebase';
import { Link } from 'gatsby';
import { context } from '../Context/provider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 95vh;
  width: 100vw;
  background-image: linear-gradient(
    to bottom,
    #040404,
    #040404ee,
    #04040400,
    #040404ee,
    #040404
  );
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
      font-size: 3rem;
      color: red;
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
  const [loading, setLoading] = useState(true);
  const {
    votes,
    setParams,
    params,
    setVotes,
    setHasVoted,
    hasVoted,
    data,
    setData,
  } = useContext(context);

  const url = `https://id.twitch.tv/oauth2/userinfo`;
  async function fetchUrl() {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${params.access_token}` },
    });
    const json = await response.json();
    setData(json);
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
  useEffect(() => {
    firebase
      .database()
      .ref()
      .once('value')
      .then(async (snapshot) => {
        await setVotes(snapshot.val());
      });
  }, []);
  useEffect(() => {
    if (!isEmptyObject(data) && !isEmptyObject(votes)) {
      Object.values(votes).forEach((vote) => {
        if (vote.id === data.sub) {
          setHasVoted(true);
          return;
        }
      });
    }
  }, [votes, data]);
  useEffect(() => {
    if (
      !isEmptyObject(params) &&
      !isEmptyObject(data) &&
      !isEmptyObject(votes)
    ) {
      setLoading(false);
    }
  }, [params, data, votes]);

  async function vote(db, id, twitchName, vote) {
    //check iff the user has voted already
    if (!hasVoted) {
      await db.database().ref().push({
        id,
        twitchName,
        vote,
      });
      setHasVoted(true);
    }
  }
  return (
    <Layout>
      <Container>
        {!loading && (
          <>
            <h1>
              {data === null
                ? 'Authorizing'
                : `Logged In As: ${data.preferred_username}`}
            </h1>
            {hasVoted && (
              <div>
                <h2>You Have Voted</h2>
                <Link to="/Results">See Results</Link>
              </div>
            )}
            {!hasVoted && (
              <div className="vote">
                <button
                  disabled={hasVoted}
                  onClick={() =>
                    vote(firebase, data.sub, data.preferred_username, 'Goof')
                  }
                >
                  Vote Goof
                </button>
                <button
                  disabled={hasVoted}
                  onClick={() =>
                    vote(firebase, data.sub, data.preferred_username, 'Fry')
                  }
                >
                  Vote Fry
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default VoteNow;
