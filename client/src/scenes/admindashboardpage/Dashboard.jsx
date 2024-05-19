import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Navbar from 'scenes/navbar';
import 'chart.js/auto';
import 'components/Dashboard.css'; // Make sure to create this file for custom styles

const Dashboard = () => {
  const [transformedData, setTransformedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/transformed-data');
        if (!response.ok) {
          throw new Error('Failed to fetch transformed data');
        }
        const data = await response.json();
        setTransformedData(data);
      } catch (error) {
        console.error('Error fetching transformed data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if transformedData is null or undefined
  if (!transformedData) {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <h1 className="dashboard-title">Dashboard</h1>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // Calculate total counts
  const totalPostsCount = transformedData.posts ? transformedData.posts.length : 0;
  const totalProjectsCount = transformedData.projects ? transformedData.projects.length : 0;
  const totalUsersCount = transformedData.users ? transformedData.users.length : 0;

  // Calculate total likes and comments
  const totalLikes = transformedData.posts.reduce((acc, post) => acc + Object.keys(post.likes || {}).length, 0);
  const totalComments = transformedData.posts.reduce((acc, post) => acc + post.comments.length, 0);
  // Calculate total bookmarks
  const totalBookmarks = transformedData.users.reduce((acc, user) => acc + (user.bookmarks ? user.bookmarks.length : 0), 0);

  // Calculate posts over time for line chart (grouped by minutes)
  const postsOverTimeData = transformedData.posts.reduce((acc, post) => {
    const createdAtDate = new Date(post.createdAt);
    const minute = createdAtDate.getMinutes();
    acc[minute] = (acc[minute] || 0) + 1;
    return acc;
  }, {});

  const postsOverTimeLabels = Object.keys(postsOverTimeData);
  const postsPerMinuteValues = Object.values(postsOverTimeData);

  // Line chart data
  const lineChartData = {
    labels: postsOverTimeLabels,
    datasets: [{
      label: 'Posts Per Minute',
      data: postsPerMinuteValues,
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false
    }]
  };

  // Pie chart data
  const pieData = {
    labels: ['Total Likes', 'Total Comments', 'Total Bookmarks'],
    datasets: [{
      data: [totalLikes, totalComments, totalBookmarks],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)', // Red for likes
        'rgba(54, 162, 235, 0.6)',  // Blue for comments
        'rgba(255, 206, 86, 0.6)'   // Yellow for bookmarks
      ],
      borderWidth: 1
    }]
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-content">
          <div className="chart-container bar-chart">
            <h2 className="chart-title">Bar Chart for Post Counts</h2>
            <Bar
              data={{
                labels: ['Total Posts', 'Total Projects', 'Total Users'],
                datasets: [
                  {
                    label: 'Total Posts',
                    data: [totalPostsCount, 0, 0], // Add 0 for total projects and users count
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Total Projects',
                    data: [0, totalProjectsCount, 0], // Add 0 for total posts and users count
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Total Users',
                    data: [0, 0, totalUsersCount], // Add 0 for total posts and projects count
                    backgroundColor: 'rgba(75, 192, 75, 0.2)', 
                    borderColor: 'rgba(75, 192, 75, 1)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: true,
                    barPercentage: 0.5, // Adjust the width of the bars
                    categoryPercentage: 0.8 // Adjust the spacing between the bars
                  },
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
          <div className="chart-container pie-chart">
            <h2 className="chart-title">Pie Chart for Likes, Comments & Bookmarks</h2>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
          <div className="chart-container line-chart">
            <h2 className="chart-title">Line Chart for Posts Over Time (Minutes)</h2>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
