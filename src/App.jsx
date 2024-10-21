import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [language, setLanguage] = useState('C');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", {
        language,
        question,
      });

      if (res.data.response) {
        setResponse(res.data.response);
        setHistory((prevHistory) => [
          ...prevHistory,
          { language, question, response: res.data.response },
        ]);
      }

      setQuestion('');
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred while generating the response.");
    }
  };

  // Function to fetch history from the server
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/history");
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Function to format the question and response
  const formatQuestionAndResponse = (question, response) => {
    return (
      <div className="formatted-response">
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#00796b' }}>
          Question:
        </div>
        <pre style={{ 
          color: 'black', 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px', 
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
        }}>
          {question}
        </pre>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#00796b' }}>
          Response:
        </div>
        <pre style={{ 
          color: 'black', 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px', 
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          overflowX: 'auto',
        }}>
          {response}
        </pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>CODEBOT 🤖</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="language">Programming Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
        </select>
        <br />
        <label htmlFor="question" className="question">Enter your Question:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br />
        <button type="submit">Generate With CodeBot 🤖</button>
      </form>

      {response && (
        <div className="response">
          <h2>CodeBot Response:</h2>
          {formatQuestionAndResponse(history[history.length - 1]?.question, response)}
        </div>
      )}

      <div className="history">
        <h2>History</h2>
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-item">
              {formatQuestionAndResponse(item.question, item.response)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
