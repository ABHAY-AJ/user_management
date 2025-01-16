import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import Sidebar from './components/Sidebar';
import UserForm from './components/UserForm';
import { fetchUsers, createUser, updateUser, deleteUser } from './api';
import './App.css';
import '@xyflow/react/dist/style.css';


const App = () => {
  const [users, setUsers] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  // Fetch users and initialize nodes
  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        const nodesData = data.map((user, index) => ({
          id: user.id,
          position: { x: 100 * index, y: 100 },
          data: { label: `${user.username}, Age: ${user.age}` },
        }));
        setNodes(nodesData);
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle connecting hobbies to users
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle dragging hobby onto a user node
  const handleDropHobby = (e, userId) => {
    e.preventDefault();
    const hobby = e.dataTransfer.getData('hobby'); // Get the dropped hobby

    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const updatedHobbies = [...user.hobbies, hobby]; // Add hobby to the user's hobbies
        return { ...user, hobbies: updatedHobbies };
      }
      return user;
    });
    setUsers(updatedUsers);
    // Update user on backend
    const userToUpdate = updatedUsers.find((user) => user.id === userId);
    updateUser(userId, userToUpdate);
  };

  // Handle user form submission
  const handleCreateUser = (userData) => {
    createUser(userData)
      .then((newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setShowUserForm(false);
      })
      .catch((error) => console.error('Error creating user:', error));
  };

  // Handle user edit form submission
  const handleEditUser = (userData) => {
    updateUser(selectedUser.id, userData)
      .then((updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === selectedUser.id ? updatedUser : user))
        );
        setShowUserForm(false);
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    deleteUser(userId)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar-container">
        <Sidebar onDropHobby={handleDropHobby} />
      </div>
  
      {/* Main container with React Flow and User Management */}
      <div className="main-container">
        <div className="reactflow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
  
        <div className="user-management">
          <button onClick={() => setShowUserForm(true)}>Create User</button>
          {showUserForm && (
            <UserForm
              onSubmit={handleCreateUser}
              initialData={selectedUser}
              isEdit={false}
            />
          )}
          {selectedUser && (
            <UserForm
              onSubmit={handleEditUser}
              initialData={selectedUser}
              isEdit={true}
            />
          )}
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onDragOver={(e) => e.preventDefault()} // Allow drop
              onDrop={(e) => handleDropHobby(e, user.id)} // Handle drop
            >
              <p>{user.username}</p>
              <ul>
                {user.hobbies.map((hobby, index) => (
                  <li key={index}>{hobby}</li>
                ))}
              </ul>
              <button onClick={() => setSelectedUser(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default App;
