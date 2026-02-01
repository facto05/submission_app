/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Error boundary for unhandled exceptions
if (!__DEV__) {
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Unhandled Exception:', error);
  });
}
