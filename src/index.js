import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import registerServiceWorker from './register-service-worker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
