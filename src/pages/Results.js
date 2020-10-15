import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import firebase from 'gatsby-plugin-firebase';
import { BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 95vh;
  width: 100vw;
  background-color: #040404;
  h1,
  h2 {
    text-align: center;
    width: 100%;
    font-size: 6em;
    color: #eeeeee;
    margin: 0 auto;
  }
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    color: #eeeeee;
    text,
    li {
      font-size: 3rem;
    }
  }
`;

const Results = () => {
  const [votes, setVotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goofCount, setGoofCount] = useState(0);
  const [fryCount, setFryCount] = useState(0);

  const setCounts = async () => {
    let tempGoof = [];
    let tempFry = [];
    await Object.values(votes).forEach((vote) => {
      if (vote.vote === 'Goof') {
        tempGoof.push(vote);
      } else if (vote.vote === 'Fry') {
        tempFry.push(vote);
      }
    });
    setGoofCount(tempGoof.length);
    setFryCount(tempFry.length);
  };
  useEffect(() => {
    firebase
      .database()
      .ref()
      .once('value')
      .then(async (snapshot) => {
        await setVotes(snapshot.val());
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (votes) {
      setCounts();
    }
  }, [votes]);

  const data = [
    {
      name: 'Election Results 2020',
      GoofinAbout: goofCount,
      TheFryGuy: fryCount,
      votes: goofCount > fryCount ? goofCount : fryCount,
    },
  ];

  return (
    <Layout>
      <Container>
        <h1>Results</h1>
        {!loading && (
          <div>
            <BarChart
              width={1200}
              height={800}
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis dataKey="votes" />
              <Legend iconSize={30} />
              <Bar dataKey="GoofinAbout" fill="red" label />
              <Bar dataKey="TheFryGuy" fill="blue" label />
            </BarChart>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Results;
