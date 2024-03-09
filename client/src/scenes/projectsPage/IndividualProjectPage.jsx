import React from 'react';
import { useParams } from 'react-router-dom';

const IndividualProjectPage = () => {
  const { projectId } = useParams();

  return (
    <div>
      <h1>Individual Project Page</h1>
      <p>Project ID: {projectId}</p>
    </div>
  );
};

export default IndividualProjectPage;
