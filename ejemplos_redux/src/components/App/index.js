import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { configureStore } from '../../store';
import TrafficLights from '../TrafficLights';
import AddTrafficLight from '../AddTrafficLight';
import LogoutButton from '../LogoutButton';
import SayHBButton from '../SayHBButton';
import ChangeAllTrafficLights from '../ChangeAllTrafficLights';
import LoginForm from '../LoginForm';
import PetOwners from '../PetOwners';


const { store, persistor } = configureStore();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LogoutButton />
      <SayHBButton />
      <TrafficLights />
      <AddTrafficLight />
      <ChangeAllTrafficLights />
      <LoginForm />
      <PetOwners />
    </PersistGate>
  </Provider>
);


export default App;
