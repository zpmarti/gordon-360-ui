import About from './views/About';
import OrientationAll from './views/Orientation';
import Home from './views/Home';
import Help from './views/Help';
import Profile from './views/Profile';

export default[
  {
    name: 'Home',
    path: '/',
    exact: true,
    component: Home,
  },
  {
    name: 'OrientationAll',
    path: '/orientation',
    component: OrientationAll,
  },
];
