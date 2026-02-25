/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// --- GLOBAL ERROR HANDLING ---

// 1. Handle Unhandled JS Exceptions
if (global.ErrorUtils) {
    const originalHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error('--- REACT NATIVE FATAL ERROR ---');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        console.error('Is Fatal:', isFatal);
        console.error('--------------------------------');

        // Let the original handler show the RedBox/LogBox in dev
        if (originalHandler) {
            originalHandler(error, isFatal);
        }
    });
}

// 2. Handle Unhandled Promise Rejections
const promise = require('promise/setimmediate/rejection-tracking');
promise.enable({
    allRejections: true,
    onUnhandled: (id, error) => {
        console.error('--- UNHANDLED PROMISE REJECTION ---');
        console.error('ID:', id);
        console.error('Error:', error);
        console.error('-----------------------------------');
    },
    onHandled: (id) => {
        // console.log(`Promise rejection handled: ${id}`);
    },
});

// 3. Network Debugging Visibility (Optional enhancement)
// global.XMLHttpRequest = global.originalXMLHttpRequest ? global.originalXMLHttpRequest : global.XMLHttpRequest;

AppRegistry.registerComponent(appName, () => App);
