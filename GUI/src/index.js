import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Layout from './components/layout'
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#827717',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));


/**
 * Base App
 * @returns base application with routing and general layout
 */
const BaseApp = () => {
  const [repoState, setRepoState] = React.useState('your-repo')
  const [graphDBState, setGraphDBState] = React.useState('https://domain-name-of-your-graphDB-instance.com/repositories/')
  const [showTokenState, setShowTokenState] = React.useState(true)
  const [tokenState, setTokenState] = React.useState('')
  return (<React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Layout></Layout>
        <Routes>
        <Route path="/">
            <Route index element={<App graphDBState={graphDBState} repoState={repoState} tokenState={tokenState} setTokenState={setTokenState} showTokenState={showTokenState} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  </React.StrictMode>)
}
root.render(
  <BaseApp></BaseApp>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
