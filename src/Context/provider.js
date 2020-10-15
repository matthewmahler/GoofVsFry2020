import React, { useState, createContext } from 'react';

export const context = createContext();

const Provider = (props) => {
  const [votes, setVotes] = useState(null);
  const [goofCount, setGoofCount] = useState(0);
  const [fryCount, setFryCount] = useState(0);
  const [params, setParams] = useState(null);
  const [data, setData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const store = {
    votes,
    goofCount,
    fryCount,
    params,
    data,
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
    setData: (d) => {
      setData(d);
    },
    setHasVoted: (d) => {
      setHasVoted(d);
    },
  };
  return <context.Provider value={store}>{props.children}</context.Provider>;
};

export default ({ element }) => <Provider>{element}</Provider>;
