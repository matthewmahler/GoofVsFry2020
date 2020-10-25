import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/Layout';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
    font-size: 7em;
    color: #eeeeee;
    margin: 0 auto;
  }
  h2 {
    font-size: 5em;
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
    height: 90vh;
    width: 100vw;
    text,
    li {
      font-size: 2rem;
    }
    .leaderboard {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      h3,
      h4,
      h5,
      h6 {
        margin: 0 auto;
      }
      h3 {
        font-size: 3.5rem;
      }
      h4 {
        font-size: 3rem;
      }
      h5 {
        font-size: 2.5rem;
      }
      h6 {
        font-size: 2rem;
      }
    }
  }
  @media (max-width: 769px) {
    h1 {
      font-size: 10vw;
    }
    h2 {
      font-size: 6vw;
    }
    .charts {
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      .hide {
        display: none;
      }
      .recharts-responsive-container {
        margin: 1rem 0;
      }
      text,
      li {
        font-size: inherit;
      }
      .leaderboard {
        justify-content: flex-start;

        h3 {
          font-size: 4vw;
        }
        h4 {
          font-size: 3.5vw;
        }
        h5 {
          font-size: 3vw;
        }
        h6 {
          font-size: 2vw;
        }
      }
    }
  }
`;

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [lineChartData, setLineChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [leaderBoard, setLeaderBoard] = useState(null);

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

  const compileLeaderBoard = (arr) => {
    let mapping = {};
    let counter = 0;
    for (var i = 0; i < arr.length; i++) {
      if (!mapping[arr[i].username]) mapping[arr[i].username] = 0;
      mapping[arr[i].username] += 1;
    }
    let entries = Object.entries(mapping);
    let leaderBoard = [];
    entries.forEach((entry) => {
      return leaderBoard.push({
        username: entry[0],
        votes: entry[1],
      });
    });
    function compare(a, b) {
      if (a.votes > b.votes) {
        return -1;
      }
      if (a.votes < b.votes) {
        return 1;
      }
      // a must be equal to b
      return 0;
    }

    setLeaderBoard(leaderBoard.sort(compare));
  };

  useEffect(() => {
    const url = 'http://localhost:5000/api/votes';
    fetchUrl(url, null, setVotes);
  }, []);
  useEffect(() => {
    if (votes) {
      compilePieChartData();
      setCounts();
      compileLineChartData();
      compileLeaderBoard(votes);
    }
  }, [votes]);

  const data = [
    {
      GoofinAbout: goofCount.length,
      TheFryGuy: fryCount.length,
      votes: Math.ceil((goofCount.length + fryCount.length) / 1.9),
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
              <ResponsiveContainer height="90%" width="100%" className="hide">
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
            <ResponsiveContainer height="90%" width="100%" className="hide">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="5 5" />
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
                  strokeWidth={2}
                  activeDot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="GoofinAbout"
                  stroke={colors[0]}
                  activeDot={{ r: 3 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer height="90%" width="100%">
              <BarChart data={data}>
                <YAxis dataKey="votes" />
                <XAxis dataKey="none" />
                <Bar dataKey="GoofinAbout" fill={colors[0]} label />
                <Bar dataKey="TheFryGuy" fill={colors[1]} label />
              </BarChart>
            </ResponsiveContainer>
            <div className="leaderboard">
              <h3>Leaderboard</h3>
              <h4>
                1st - {leaderBoard[0].username} - {leaderBoard[0].votes} votes
              </h4>
              <h5>
                2nd - {leaderBoard[1].username} - {leaderBoard[1].votes} votes
              </h5>
              <h6>
                3rd - {leaderBoard[2].username} - {leaderBoard[2].votes} votes
              </h6>
              <h6>
                4th - {leaderBoard[3].username} - {leaderBoard[3].votes} votes
              </h6>
              <h6>
                5th - {leaderBoard[4].username} - {leaderBoard[4].votes} votes
              </h6>
              <h6>
                6th - {leaderBoard[5].username} - {leaderBoard[5].votes} votes
              </h6>
              <h6>
                7th - {leaderBoard[6].username} - {leaderBoard[6].votes} votes
              </h6>
              <h6>
                8th - {leaderBoard[7].username} - {leaderBoard[7].votes} votes
              </h6>
              <h6>
                9th - {leaderBoard[8].username} - {leaderBoard[8].votes} votes
              </h6>
              <h6>
                10th - {leaderBoard[9].username} - {leaderBoard[9].votes} votes
              </h6>
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Results;
