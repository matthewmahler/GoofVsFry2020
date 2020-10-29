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
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
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
  const [showChair, setShowChair] = useState(false);
  const [chairCount, setChairCount] = useState(0);

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
    let tempChair = [];
    Object.values(votes).forEach((vote) => {
      if (vote.candidate === 'Goof') {
        tempGoof.push(vote);
      } else if (vote.candidate === 'Fry') {
        tempFry.push(vote);
      } else if (vote.candidate === 'Chair') {
        tempChair.push(vote);
      }
    });

    setGoofCount(tempGoof);
    setFryCount(tempFry);
    setChairCount(tempChair);
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
    const url = `${process.env.GATSBY_BACKEND_HOST}api/votes`;
    fetchUrl(url, null, setVotes);
  }, []);
  useEffect(() => {
    if (votes) {
      compilePieChartData();
      setCounts();
      compileLineChartData();
      compileLeaderBoard(votes);
    }
  }, [votes, showChair]);

  const data = [
    {
      GoofinAbout: goofCount.length,
      TheFryGuy: fryCount.length,
      Chair: chairCount.length,
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
    const divider = votes.length - chairCount.length;

    const withChair = [
      {
        name: 'GoofinAbout',
        value: Math.round((goofCount.length / votes.length) * 100),
      },
      {
        name: 'TheFryGuy',
        value: Math.round((fryCount.length / votes.length) * 100),
      },
      {
        name: 'Chair',
        value: Math.round((chairCount.length / votes.length) * 100),
      },
    ];
    const withoutChair = [
      {
        name: 'GoofinAbout',
        value: Math.round((goofCount.length / divider) * 100),
      },
      {
        name: 'TheFryGuy',
        value: Math.round((fryCount.length / divider) * 100),
      },
    ];

    setPieChartData(showChair ? withChair : withoutChair);
    setLoading(false);
  };

  const compileLineChartData = async () => {
    let tempArr = [];
    let tempGoof = [];
    let tempFry = [];
    let tempChair = [];
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
            } else if (vote.candidate === 'Chair') {
              tempChair++;
            } else {
              return;
            }
          }
        });
        tempArr.push({
          date: date.toISOString(),
          GoofinAbout: tempGoof,
          TheFryGuy: tempFry,
          Chair: tempChair,
        });
      });
    setLineChartData(tempArr);
  };

  const colors = ['#FF5A50', '#5768FF', '#91f573'];
  return (
    <Layout>
      <Container>
        <h1>Results</h1>
        <div className="legend">
          <h2 className="goof">GOOFINABOUT</h2>
          <FontAwesomeIcon
            icon={faChair}
            color={showChair ? colors[2] : 'black'}
            onClick={() => setShowChair(!showChair)}
            size={showChair ? '6x' : '1px'}
          />
          <h2 className="fry">THEFRYGUY</h2>
        </div>

        {!loading && votes.length > 0 ? (
          <div className="charts">
            {pieChartData && (
              <ResponsiveContainer height="90%" width="100%" className="hide">
                <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    dataKey="value"
                    nameKey="name"
                    data={pieChartData}
                    label="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <ResponsiveContainer height="90%" width="100%" className="hide">
              <LineChart
                data={lineChartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
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
                {showChair ? (
                  <Line
                    type="monotone"
                    dataKey="Chair"
                    stroke={colors[2]}
                    activeDot={{ r: 3 }}
                    strokeWidth={2}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer height="90%" width="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <YAxis />
                <XAxis dataKey="none" />
                <Tooltip wrapperStyle={{ backgroundColor: '#040404' }} />

                <Bar
                  dataKey="GoofinAbout"
                  fill={colors[0]}
                  label="GoofinAbout"
                />
                <Bar dataKey="TheFryGuy" fill={colors[1]} label="TheFryGuy" />
                {showChair ? (
                  <Bar dataKey="Chair" fill={colors[2]} label />
                ) : null}
              </BarChart>
            </ResponsiveContainer>
            <div className="leaderboard">
              <h3>Leaderboard</h3>
              {leaderBoard.map((u, key) => {
                if (key === 0) {
                  return (
                    <h4>
                      1st - {u.username} - {u.votes} votes
                    </h4>
                  );
                } else if (key === 1) {
                  return (
                    <h5>
                      2nd - {u.username} - {u.votes} votes
                    </h5>
                  );
                } else if (key > 9) {
                  return;
                } else {
                  return (
                    <h6>
                      {key === 2 ? '3rd' : `${key + 1}th`} - {u.username} -{' '}
                      {u.votes} votes
                    </h6>
                  );
                }
              })}
            </div>
          </div>
        ) : (
          <h3>No Results Yet</h3>
        )}
      </Container>
    </Layout>
  );
};

export default Results;
