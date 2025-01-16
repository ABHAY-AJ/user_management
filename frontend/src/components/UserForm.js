import React, { useState } from 'react';
import './UserForm.css'; // Import the CSS file for styling

const UserForm = ({ onSubmit, initialData, isEdit }) => {
  const [username, setUsername] = useState(initialData?.username || '');
  const [age, setAge] = useState(initialData?.age || '');
  const [hobbies, setHobbies] = useState(initialData?.hobbies || []);
  const [error, setError] = useState('');

  const handleAddHobby = (hobby) => {
    setHobbies((prev) => [...prev, hobby]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !age) {
      setError('Username and Age are required!');
      return;
    }
    onSubmit({ username, age, hobbies });
  };

  return (
    <div className="user-form">
      <h2>{isEdit ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Hobbies:</label>
          <ul>
            {hobbies.map((hobby, index) => (
              <li key={index}>{hobby}</li>
            ))}
          </ul>
        </div>
        <button type="submit">{isEdit ? 'Update User' : 'Create User'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default UserForm;
