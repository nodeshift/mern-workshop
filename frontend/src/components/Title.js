import React from 'react';
import './Title.css';

const Title = (props) => {
  return (
    <div className="Title">
      <h1 className="Name">
        {props.title} ({props.count})
      </h1>
    </div>
  );
};

export default Title;
