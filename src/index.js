import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import App from './App';
import reportWebVitals from './reportWebVitals';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;
    outline: transparent;
    position: relative;
  }
  button {
    background-color: transparent;
    border: transparent;
  }
  a {
      text-decoration: none;
    }
  body, html {
    width: 100vw;
    height: 100vh;
  }
`;
const theme = {
  primary: '#c8b6ff',
  lightPurple: '#b8c0ff',
  loghtBlue: '#bbd0ff',
  darkPurple: '#5d5f87',
  disabled: '#a5a7b4',
  white: 'white',
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    <GlobalStyle />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
