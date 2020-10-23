import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Line,
  CartesianGrid,
  LineChart,
} from 'recharts';
import { context } from '../Context/provider';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 95vh;
  width: 100vw;
  background-color: #040404;
  color: #eee;
  h1,
  h2 {
    text-align: center;
    width: 100%;
    font-size: 6em;
    color: #eeeeee;
    margin: 0 auto;
  }
  .legend {
    min-width: 50%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .goof {
      color: #ff5a50;
    }
    .fry {
      color: #5768ff;
    }
  }
  .charts {
    box-sizing: border-box;
    padding: 10rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-content: flex-start;
    min-height: 95vh;
    width: 100vw;
    text,
    li {
      font-size: 2rem;
    }
  }
`;

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  const {
    votes,
    setVotes,
    setGoofCount,
    setFryCount,
    goofCount,
    fryCount,
  } = useContext(context);
  const setCounts = async () => {
    let tempGoof = [];
    let tempFry = [];
    await Object.values(votes).forEach((vote) => {
      if (vote.candidate === 'Goof') {
        tempGoof.push(vote);
      } else if (vote.candidate === 'Fry') {
        tempFry.push(vote);
      }
    });

    setGoofCount(tempGoof);
    setFryCount(tempFry);
  };

  async function fetchUrl(url, options, set) {
    const response = await fetch(url, options);
    const json = await response.json();

    set(json);
  }

  useEffect(() => {
    const url = 'http://localhost:5000/api/votes';
    fetchUrl(url, null, setVotes);
  }, []);
  useEffect(() => {
    if (votes) {
      compilePieChartData();
      setCounts();
      compileLineChartData();
    }
  }, [votes]);

  const data = [
    {
      GoofinAbout: goofCount.length,
      TheFryGuy: fryCount.length,
      votes: Math.ceil((goofCount.length + fryCount.length) / 100) * 50,
    },
  ];

  useEffect(() => {
    if (votes && goofCount && fryCount) {
      compilePieChartData();
    }
  }, [votes, goofCount, fryCount]);
  // loop through all vote and get unique dates
  // for each unique date set the count for each candidate
  // concat them all together

  const compilePieChartData = async () => {
    setPieChartData([
      {
        name: 'GoofinAbout',
        value: Math.round((goofCount.length / votes.length) * 100),
      },
      {
        name: 'TheFryGuy',
        value: Math.round((fryCount.length / votes.length) * 100),
      },
    ]);
    setLoading(false);
  };

  const compileLineChartData = async () => {
    let tempArr = [];
    let tempGoof = [];
    let tempFry = [];

    votes
      .map((vote) =>
        new Date(
          new Date(vote.voteDate).getFullYear(),
          new Date(vote.voteDate).getMonth(),
          new Date(vote.voteDate).getDate()
        ).toISOString()
      )
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()
      .forEach((e) => {
        const date = new Date(
          new Date(e).getFullYear(),
          new Date(e).getMonth(),
          new Date(e).getDate()
        );

        votes.forEach((vote) => {
          const voteDate = new Date(
            new Date(vote.voteDate).getFullYear(),
            new Date(vote.voteDate).getMonth(),
            new Date(vote.voteDate).getDate()
          );

          if (date.getTime() === voteDate.getTime()) {
            if (vote.candidate === 'Goof') {
              tempGoof++;
            } else if (vote.candidate === 'Fry') {
              tempFry++;
            } else {
              return;
            }
          }
        });
        tempArr.push({
          date: date.toISOString(),
          GoofinAbout: tempGoof,
          TheFryGuy: tempFry,
        });
      });
    setLineChartData(tempArr);
  };

  const colors = ['#FF5A50', '#5768FF'];
  return (
    <Layout>
      <Container>
        <h1>Results</h1>
        <div className="legend">
          <h2 className="goof">GOOFINABOUT</h2>
          <h2 className="fry">THEFRYGUY</h2>
        </div>

        {!loading && (
          <div className="charts">
            {pieChartData && (
              <ResponsiveContainer minHeight="40%" width="100%">
                <PieChart>
                  <Pie dataKey="value" data={pieChartData} label>
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}

            <ResponsiveContainer minHeight="40%" width="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="10 10" />
                <XAxis
                  tickFormatter={(date) => date.substring(5, 10)}
                  dataKey="date"
                  domain={['auto', 'auto']}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="TheFryGuy"
                  stroke={colors[1]}
                  activeDot={{ r: 8 }}
                  strokeWidth={5}
                />
                <Line
                  type="monotone"
                  dataKey="GoofinAbout"
                  stroke={colors[0]}
                  activeDot={{ r: 8 }}
                  strokeWidth={5}
                />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer minHeight="40%" width="100%">
              <BarChart data={data}>
                <YAxis dataKey="votes" />
                <XAxis dataKey="none" />

                <Bar dataKey="GoofinAbout" fill={colors[0]} label />
                <Bar dataKey="TheFryGuy" fill={colors[1]} label />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Results;
