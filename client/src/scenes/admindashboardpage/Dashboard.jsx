import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import Navbar from 'scenes/navbar';
import 'chart.js/auto';
import 'components/Dashboard.css'; 

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

  
  const totalPostsCount = transformedData.posts ? transformedData.posts.length : 0;
  const totalProjectsCount = transformedData.projects ? transformedData.projects.length : 0;
  const totalUsersCount = transformedData.users ? transformedData.users.length : 0;

  
  const totalLikes = transformedData.posts.reduce((acc, post) => acc + Object.keys(post.likes || {}).length, 0);
  const totalComments = transformedData.posts.reduce((acc, post) => acc + post.comments.length, 0);
  
  const totalBookmarks = transformedData.users.reduce((acc, user) => acc + (user.bookmarks ? user.bookmarks.length : 0), 0);

  
  const postsOverTimeData = transformedData.posts.reduce((acc, post) => {
    const createdAtDate = new Date(post.createdAt);
    const day = createdAtDate.toDateString(); 
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  
  const projectsOverTimeData = transformedData.projects.reduce((acc, project) => {
    const createdAtDate = new Date(project.createdAt);
    const day = createdAtDate.toDateString(); 
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  
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

  
  const sortedCombinedOverTimeData = Object.entries(combinedOverTimeData).sort(([dateA], [dateB]) => {
    const date1 = new Date(dateA);
    const date2 = new Date(dateB);
    return date1 - date2;
  });

  const combinedOverTimeLabels = sortedCombinedOverTimeData.map(([date]) => date);
  const postsPerDayValues = sortedCombinedOverTimeData.map(([, data]) => data.posts);
  const projectsPerDayValues = sortedCombinedOverTimeData.map(([, data]) => data.projects);

  
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

  
  const postsPerUser = transformedData.posts.reduce((acc, post) => {
    const userId = post.userId;
    if (!acc[userId]) {
      acc[userId] = { posts: 0, projects: 0 };
    }
    acc[userId].posts++;
    return acc;
  }, {});

  
  transformedData.projects.forEach(project => {
    const userId = project.userId;
    if (!postsPerUser[userId]) {
      postsPerUser[userId] = { posts: 0, projects: 0 };
    }
    postsPerUser[userId].projects++;
  });

 
  const combinedUserData = Object.entries(postsPerUser).map(([userId, counts]) => {
    const user = transformedData.users.find(user => user.id === userId);
    const userName = `${user.firstName} ${user.lastName}`;
    return { userName, ...counts };
  });

 
  const sortedUserData = combinedUserData.sort((a, b) => a.userName.localeCompare(b.userName));

  
  const userNames = sortedUserData.map(({ userName }) => userName);
  const postCounts = sortedUserData.map(({ posts }) => posts);
  const projectCounts = sortedUserData.map(({ projects }) => projects);

  
  const userData = {
    labels: userNames,
    datasets: [
      {
        label: 'Number of Posts',
        data: postCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        barPercentage: 1, 
        categoryPercentage: 0.3
      },
      {
        label: 'Number of Projects',
        data: projectCounts,
        backgroundColor: 'rgba(60, 179, 113, 0.2)',
        borderColor: 'rgba(60, 179, 113, 1)',
        borderWidth: 1,
        barPercentage: 1, 
        categoryPercentage: 0.3 
      }
    ]
  };

  
  const pieData = {
    labels: ['Total Likes', 'Total Comments', 'Total Bookmarks'],
    datasets: [{
      data: [totalLikes, totalComments, totalBookmarks],
      backgroundColor: [
        'rgba(232, 111, 0, 0.6)', 
        'rgba(173, 105, 219, 0.6)', 
        'rgba(255, 206, 86, 0.6)'   
      ],
      borderWidth: 1
    }]
  };

  
  const projectMembersCount = transformedData.projects.map(project => ({
    projectName: project.name,
    membersCount: project.members.length
  }));

  
  const projectNames = projectMembersCount.map(({ projectName }) => projectName);
  const membersCount = projectMembersCount.map(({ membersCount }) => membersCount);

  
  function generateRandomColor() {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
  }

  
  const doughnutData = {
    labels: projectNames,
    datasets: [{
      label: 'Members Count',
      data: membersCount,
      backgroundColor: projectNames.map(() => generateRandomColor()), 
      borderWidth: 1
    }]
  };

  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-content">
          <div className="chart-container bar-chart">
            <h2 className="chart-title">Bar Chart for Total Posts, Projects & Users</h2>
            <Bar
              data={{
                labels: ['Total Posts', 'Total Projects', 'Total Users'],
                datasets: [
                  {
                    label: 'Total Posts',
                    data: [totalPostsCount, 0, 0],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Total Projects',
                    data: [0, totalProjectsCount, 0], 
                    backgroundColor: 'rgba(60, 179, 113, 0.2)',
                    borderColor: 'rgba(60, 179, 113, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Total Users',
                    data: [0, 0, totalUsersCount], 
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
                    barPercentage: 0.5, 
                    categoryPercentage: 0.8 
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
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2) + '%';
                        return `${label}: ${percentage}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          <div className="chart-container line-chart">
            <h2 className="chart-title">Line Chart for Posts & Projects Over Time (Days)</h2>
            <Line
              data={lineChartData}
              options={{
                scales: {
                  y: {
                    beginAtZero: true
                  },
                },
                responsive: true,
                maintainAspectRatio: false
              }}
            />
          </div>
          <div className="chart-container bar-chart">
            <h2 className="chart-title">Number of Posts & Projects for Each User</h2>
            <Bar
              data={userData}
              options={{
                responsive: true,
                indexAxis: 'x', 
                maintainAspectRatio: false,
                scales: {
                  x: {
                    stacked: false,
                    barPercentage: 0.3, 
                    categoryPercentage: 0.6 
                  },
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
          <div className="chart-container doughnut-chart">
            <h2 className="chart-title">Doughnut Chart for Members Count per Project</h2>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
