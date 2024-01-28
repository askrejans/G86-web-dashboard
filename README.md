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


### `npm run build`

Builds the app for production to the `build` folder. It optimizes the build for the best performance, including minifying and hashing filenames. The resulting app is ready for deployment. Learn more about [deployment](https://facebook.github.io/create-react-app/docs/deployment).


## Pre-Built Packages

There are also pre build packages, that combines three individual components: [Speeduino-to-MQTT](https://github.com/askrejans/speeduino-to-mqtt), [GPS-to-MQTT](https://github.com/askrejans/gps-to-mqtt), and [G86 Web Dashboard](https://github.com/askrejans/G86-web-dashboard) in one system with predefined services.

You can quickly get started by using pre-built packages available for both x64 and Raspberry Pi 4 (ARM) architectures:

- **DEB Packages for x64:** [Download here](https://akelaops.com/repo/deb/pool/main/amd64/g86-car-telemetry_1.0.deb)
- **DEB Packages for Raspberry Pi 4 (ARM):** [Download here](https://akelaops.com/repo/deb/pool/main/aarch64/g86-car-telemetry_1.0.deb)
- **RPM Packages for x64:** [Download here](https://akelaops.com/repo/rpm/x86_64/g86-car-telemetry-1.0-1.x86_64.rpm)
- **RPM Packages for Raspberry Pi 4 (ARM):** [Download here](https://akelaops.com/repo/rpm/aarch64/g86-car-telemetry-1.0-1.aarch64.rpm)

### Package Installation Details

- All packages install the three services in the directory `/opt/g86-car-telemetry` (or `/usr/opt/g86-car-telemetry`).
- Configuration files for GPS and ECU processors can be found under `/etc/g86-car-telemetry` (or `/usr/etc/g86-car-telemetry`).
- Web project configurations are located in `/var/www/g86-car-telemetry/config` (or `/usr/var/www/g86-car-telemetry/config`).
- Ensure to add relevant configurations for MQTT server, TTY ports, and any extra settings.

### Installed Services

The packages automatically install and manage the following services:

- `g86-car-telemetry-gps`
- `g86-car-telemetry-speeduino`
- `g86-car-telemetry-web`

### Compatibility and Testing

These packages have been tested on both Raspberry Pi 4 (ARM) with DEB packages and x86 systems with RPM packages. However, please note that this project is a work in progress, and more tests are needed, especially with real ECUs. Exercise caution when using, and stay tuned for updates as development continues to enhance and stabilize the functionality.

Feel free to reach out if you have any questions or encounter issues. Happy telemetry monitoring! 📊🛠️


