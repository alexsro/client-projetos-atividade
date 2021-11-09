import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';

import Routes from './routes';
import Navbar from './components/NavBar';

const App: React.FC = () => (
  <Router>
    <Navbar />
    <Routes />
    <GlobalStyle />
  </Router>
);

export default App;
