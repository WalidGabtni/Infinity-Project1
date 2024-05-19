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

// Calculate posts over time for line chart (grouped by day)
const postsOverTimeData = transformedData.posts.reduce((acc, post) => {
  const createdAtDate = new Date(post.createdAt);
  const day = createdAtDate.toDateString(); // Extracting the day portion of the date
  acc[day] = (acc[day] || 0) + 1;
  return acc;
}, {});

// Calculate projects over time for line chart (grouped by day)
const projectsOverTimeData = transformedData.projects.reduce((acc, project) => {
  const createdAtDate = new Date(project.createdAt);
  const day = createdAtDate.toDateString(); // Extracting the day portion of the date
  acc[day] = (acc[day] || 0) + 1;
  return acc;
}, {});

// Combine posts and projects data for line chart
const combinedOverTimeData = {};
Object.entries(postsOverTimeData).forEach(([date, postCount]) => {
  combinedOverTimeData[date] = { posts: postCount, projects: 0 };
});
Object.entries(projectsOverTimeData).forEach(([date, projectCount]) => {
  if (combinedOverTimeData[date]) {
    combinedOverTimeData[date].projects = projectCount;
  } else {
    combinedOverTimeData[date] = { posts: 0, projects: projectCount };
  }
});

// Sort the combined data by date
const sortedCombinedOverTimeData = Object.entries(combinedOverTimeData).sort(([dateA], [dateB]) => {
  const date1 = new Date(dateA);
  const date2 = new Date(dateB);
  return date1 - date2;
});

const combinedOverTimeLabels = sortedCombinedOverTimeData.map(([date]) => date);
const postsPerDayValues = sortedCombinedOverTimeData.map(([, data]) => data.posts);
const projectsPerDayValues = sortedCombinedOverTimeData.map(([, data]) => data.projects);

// Line chart data
const lineChartData = {
  labels: combinedOverTimeLabels,
  datasets: [
    {
      label: 'Posts Per Day',
      data: postsPerDayValues,
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false
    },
    {
      label: 'Projects Per Day',
      data: projectsPerDayValues,
      borderColor: 'rgba(60, 179, 113, 1)',
      borderWidth: 1,
      fill: false
    }
  ]
};

// Calculate number of posts for each user
const postsPerUser = transformedData.posts.reduce((acc, post) => {
  const userId = post.userId;
  if (!acc[userId]) {
    acc[userId] = 0;
  }
  acc[userId]++;
  return acc;
}, {});

// Map user IDs to first name and last name
const postsPerUserWithNames = Object.entries(postsPerUser).map(([userId, postCount]) => {
  const user = transformedData.users.find(user => user.id === userId);
  const userName = `${user.firstName} ${user.lastName}`;
  return { userName, postCount };
});

// Sort the data by number of posts
const sortedPostsPerUser = postsPerUserWithNames.sort((a, b) => b.postCount - a.postCount);

// Extract user names and post counts
const userNames = sortedPostsPerUser.map(({ userName }) => userName);
const postCounts = sortedPostsPerUser.map(({ postCount }) => postCount);

// Bar chart data for posts per user
const postsPerUserData = {
  labels: userNames,
  datasets: [{
    label: 'Number of Posts',
    data: postCounts,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }]
};



  // Pie chart data
  const pieData = {
    labels: ['Total Likes', 'Total Comments', 'Total Bookmarks'],
    datasets: [{
      data: [totalLikes, totalComments, totalBookmarks],
      backgroundColor: [
        'rgba(232, 111, 0, 0.6)', // Red for likes
        'rgba(173, 105, 219, 0.6)', 
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
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Total Projects',
                    data: [0, totalProjectsCount, 0], // Add 0 for total posts and users count
                    backgroundColor: 'rgba(60, 179, 113, 0.2)',
                    borderColor: 'rgba(60, 179, 113, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Total Users',
                    data: [0, 0, totalUsersCount], // Add 0 for total posts and projects count
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', 
                    borderColor: 'rgba(54, 162, 235, 1)',
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
            <h2 className="chart-title">Line Chart for Posts & Porjects Over Time (Days)</h2>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
                <div className="chart-container bar-chart">
                  <h2 className="chart-title">Number of Posts for Each User</h2>
                  <Bar
                    data={postsPerUserData}
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
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;
