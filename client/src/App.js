import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

import "./index.css";

const App = () => {
  const [artists, setArtists] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [editingArtist, setEditingArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchArtists();
    checkLoginStatus();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/suppliers");
      setArtists(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!isLoggedIn) {
      setErrorMessage("You need to login to perform this action.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
      fetchArtists();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    if (!isLoggedIn) {
      setErrorMessage("You need to login to perform this action.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/suppliers", {
        companyName,
        contactName,
        contactTitle,
      });
      fetchArtists();
      setCompanyName("");
      setContactName("");
      setContactTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    if (!isLoggedIn) {
      setErrorMessage("You need to login to perform this action.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/suppliers/${editingArtist.id}`,
        {
          companyName,
          contactName,
          contactTitle,
        }
      );
      fetchArtists();
      setCompanyName("");
      setContactName("");
      setContactTitle("");
      setEditingArtist(null);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const startEditing = (artist) => {
    if (!isLoggedIn) {
      setErrorMessage("You need to login to perform this action.");
      return;
    }

    setCompanyName(artist.companyName);
    setContactName(artist.contactName);
    setContactTitle(artist.contactTitle);
    setEditingArtist(artist);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    if (loginUsername === "gulsen" && loginPassword === "zalova") {
      setIsLoggedIn(true);
      setLoginUsername("");
      setLoginPassword("");
      setErrorMessage("");
      localStorage.setItem("isLoggedIn", "true");
    } else {
      setErrorMessage("Invalid login.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const checkLoginStatus = () => {
    const isLoggedInStorage = localStorage.getItem("isLoggedIn");
    if (isLoggedInStorage ===    "true") {
      setIsLoggedIn(true);
    }
  };

  return (
    <div>
      <h2>Artists Table</h2>
      {isLoggedIn ? (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button className="login-button" onClick={openModal}>
          Login
        </button>
      )}
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Contact Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td>{artist.companyName}</td>
              <td>{artist.contactName}</td>
              <td>{artist.contactTitle}</td>
              <td>
                <button
                  className="delete"
                  onClick={() => handleDelete(artist.id)}
                  disabled={!isLoggedIn}
                >
                  Delete
                </button>
                <button
                  className="edit"
                  onClick={() => startEditing(artist)}
                  disabled={!isLoggedIn}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>{editingArtist ? "Edit Artist" : "Add New Artist"}</h2>
        {isLoggedIn ? (
          <div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <label>Password:</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        )}
        <div className="add-artist-section">
          <h2>Add New Artist</h2>
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>
          <div>
            <label>Contact Name:</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>
          <div>
            <label>Contact Title:</label>
            <input
              type="text"
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
              disabled={!isLoggedIn}
            />
          </div>
          <button onClick={editingArtist ? handleEdit : handleAdd} disabled={!isLoggedIn}>
            {editingArtist ? "Update" : "Add"}
          </button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default App;

