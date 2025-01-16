import React, { useState } from 'react';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = ({ onDropHobby }) => {
  const [hobbies] = useState([
    'Reading', 'Gaming', 'Music', 'Sports', 'Traveling', 'Photography',
  ]);

  const handleDragStart = (e, hobby) => {
    e.dataTransfer.setData('hobby', hobby);
  };

  return (
    <div className="sidebar">
      <h3>Available Hobbies</h3>
      <ul>
        {hobbies.map((hobby) => (
          <li
            key={hobby}
            draggable
            onDragStart={(e) => handleDragStart(e, hobby)}
          >
            {hobby}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
