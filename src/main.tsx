import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from '../src/services/store';

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <App />
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>
);
