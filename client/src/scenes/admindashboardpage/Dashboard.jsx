import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="dashboard-content">
            {transformedData && (
              <>
                <div className="chart-container bar-chart">
                  <h2 className="chart-title">Bar Chart for Post Counts</h2>
                  <Bar
                    data={{
                      labels: transformedData.posts.map(post => post.title),
                      datasets: [{
                        label: 'Post Counts',
                        data: transformedData.posts.map(post =>
                          transformedData.users.filter(user => user.id === post.userId).length
                        ),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
                <div className="chart-container pie-chart">
                  <h2 className="chart-title">Pie Chart for Likes & Comments</h2>
                  <Pie
                    data={{
                      labels: transformedData.posts.map(post => post.title),
                      datasets: [{
                        label: 'Likes & Comments',
                        data: transformedData.posts.map(post => post.likes + post.comments.length),
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(255, 159, 64, 0.6)'
                        ],
                        borderWidth: 1
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
