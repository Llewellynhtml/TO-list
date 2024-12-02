import React from 'react';
import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <p className="home-para">
          Welcome to Checkmate, your ultimate companion for staying organized and on top of your tasks.
          Whether you’re managing daily chores, work projects, or personal goals, Checkmate provides an intuitive
          and efficient way to add, search, update, and delete tasks with ease. Prioritize your to-dos with customizable
          priority settings and never miss a deadline again. With Checkmate, conquer your day and achieve your goals, one task at a time.
        </p>
        <div className="home-buttons">
          <Link to="/login"><button className="home-button">Login</button></Link>
          <Link to="/registration"><button className="home-button">Registration</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;


