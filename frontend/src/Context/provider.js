import React, { useState, createContext } from 'react';

export const context = createContext();

const Provider = (props) => {
  const [allVotes, setAllVotes] = useState({});
  const [goofCount, setGoofCount] = useState(0);
  const [fryCount, setFryCount] = useState(0);
  const [params, setParams] = useState(null);
  const [user, setUser] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [votes, setVotes] = useState(null);
  const store = {
    votes,
    allVotes,
    viewer,
    goofCount,
    fryCount,
    params,
    user,
    hasVoted,
    setVotes: (d) => {
      setVotes(d);
    },
    setGoofCount: (d) => {
      setGoofCount(d);
    },
    setFryCount: (d) => {
      setFryCount(d);
    },
    setParams: (d) => {
      setParams(d);
    },
    setUser: (d) => {
      setUser(d);
    },
    setHasVoted: (d) => {
      setHasVoted(d);
    },
    setAllVotes: (d) => {
      setAllVotes(d);
    },
    setViewer: (d) => {
      setViewer(d);
    },
  };
  return <context.Provider value={store}>{props.children}</context.Provider>;
};

export default ({ element }) => <Provider>{element}</Provider>;
