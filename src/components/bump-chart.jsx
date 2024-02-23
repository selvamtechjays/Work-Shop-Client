import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveBump } from '@nivo/bump';
import { API_URL } from "../utils/api";

//Define chart component
export default function Chart() {
  //state management for chart data
  const [data, setData] = useState([]);
// fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-all-scoreboard`);
        const scoreboardData = response.data;

        const formattedData = scoreboardData.map((entry, index) => ({
          id: `Attempt ${index + 1}`,
          data: [{ x: `Attempt ${index + 1}`, y: entry.score }] 
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  return (
    <ResponsiveBump
      data={data}
      colors={{ scheme: 'spectral' }}
      lineWidth={3}
      activeLineWidth={6}
      inactiveLineWidth={3}
      inactiveOpacity={0.15}
      pointSize={10}
      activePointSize={16}
      inactivePointSize={0}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={3}
      activePointBorderWidth={3}
      pointBorderColor={{ from: 'serie.color' }}
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: -36,
        truncateTickAt: 0
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 32,
        truncateTickAt: 0
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Score',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0
      }}
      margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
      axisRight={null}
    />
  );
}




