# React Dashboard for Speeduino/GPS Testing

This project serves as a quick and dirty web dashboard in React.js for testing Speeduino/GPS gauges using data from MQTT. It is specifically designed to work with [gps-to-mqtt](https://github.com/askrejans/gps-to-mqtt) and [speeduino-to-mqtt](https://github.com/askrejans/speeduino-to-mqtt) projects.

![image](https://github.com/askrejans/G86-web-dashboard/assets/1042303/9137768f-0491-4753-9233-0c2638458a28)


### How It Works

- **Data Sources:**
  - [gps-to-mqtt](https://github.com/askrejans/gps-to-mqtt): Provides GPS data over MQTT.
  - [speeduino-to-mqtt](https://github.com/askrejans/speeduino-to-mqtt): Sends Speeduino gauge data over MQTT.

- **Testing Setup:**
  - This React dashboard allows you to visualize and test Speeduino and GPS gauges simultaneously by fetching and displaying data from the mentioned MQTT sources.

- **Usage:**
  - To set up the testing environment, follow the instructions provided in the documentation of [gps-to-mqtt](https://github.com/askrejans/gps-to-mqtt) and [speeduino-to-mqtt](https://github.com/askrejans/speeduino-to-mqtt).

This project utilizes [Create React App](https://github.com/facebook/create-react-app) for quick and easy bootstrapping of React applications.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm start`

Launches the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when changes are made, and lint errors can be viewed in the console.

### `npm test`

Starts the test runner in interactive watch mode. Refer to the [running tests](https://facebook.github.io/create-react-app/docs/running-tests) documentation for more details.

### `npm run build`

Builds the app for production to the `build` folder. It optimizes the build for the best performance, including minifying and hashing filenames. The resulting app is ready for deployment. Learn more about [deployment](https://facebook.github.io/create-react-app/docs/deployment).

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you're unsatisfied with the build tool and configuration choices, you can eject at any time. This copies all configuration files and transitive dependencies (webpack, Babel, ESLint, etc.) into your project, giving you full control. Keep in mind that once ejected, you're on your own.




