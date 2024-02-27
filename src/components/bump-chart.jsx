import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveBar } from '@nivo/bar';
import { API_URL } from "../utils/api";

// Define chart component
export default function Chart() {
  // State management for chart data
  const [data, setData] = useState([]);

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-all-scoreboard`);
        const scoreboardData = response.data;

        const formattedData = scoreboardData.map((entry, index) => ({
          id: `Attempt ${index + 1}`,
          score: entry.score
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveBar
      data={data}
      keys={['score']}
      indexBy="id"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      colors={{ scheme: 'spectral' }}
      borderRadius={5}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Score',
        legendPosition: 'middle',
        legendOffset: -40
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
}





