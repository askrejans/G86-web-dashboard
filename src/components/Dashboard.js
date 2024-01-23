import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import GaugeComponent from 'react-gauge-component';
import ReactiveButton from 'reactive-button';
import mqtt from 'mqtt';
import throttle from 'lodash/throttle';

const Dashboard = () => {
  const [rpmValue, setRpmValue] = useState(0);
  const [spdValue, setSpdValue] = useState(0);
  const [o2pValue, setO2pValue] = useState(0);
  const [tpsValue, setTpsValue] = useState(0);
  const [ve1Value, setVe1Value] = useState(0);
  const [batValue, setBatValue] = useState(0);
  const [mapValue, setMapValue] = useState(0);
  const [matValue, setMatValue] = useState(0);
  const [cadValue, setCadValue] = useState(0);
  const [dwlValue, setDwlValue] = useState(0);
  const [aftValue, setAftValue] = useState(0);
  const [pw1Value, setPw1Value] = useState(0);
  const [advValue, setAdvValue] = useState(0);
  const [engButtonColor, setEngButtonColor] = useState('green');
  const [engButtonText, setEngButtonText] = useState('Running');
  const [wecButtonColor, setWecButtonColor] = useState('green');
  const [wecButtonText, setWecButtonText] = useState('0');

  // Separate throttled functions for each topic
  const throttledRpmHandler = throttle((message) => {
    setRpmValue(parseFloat(message.toString()));
  }, 10);

  const throttledSpdHandler = throttle((message) => {
    const speed = parseFloat(message.toString());
    const roundedSpeed = Math.round(speed * 2) / 2;
    setSpdValue(roundedSpeed >= 1 ? roundedSpeed : 0);
  }, 10);

  const throttledO2pHandler = throttle((message) => {
    setO2pValue(parseFloat(message.toString()));
  }, 10);

  const throttledTpsHandler = throttle((message) => {
    setTpsValue(parseFloat(message.toString()));
  }, 50);

  const throttledVe1Handler = throttle((message) => {
    setVe1Value(parseFloat(message.toString()));
  }, 10);

  const throttledBatHandler = throttle((message) => {
    setBatValue(parseFloat(message.toString()));
  }, 100);

  const throttledMapHandler = throttle((message) => {
    setMapValue(parseFloat(message.toString()));
  }, 10);

  const throttledMatHandler = throttle((message) => {
    setMatValue(parseFloat(message.toString()));
  }, 100);

  const throttledCadHandler = throttle((message) => {
    setCadValue(parseFloat(message.toString()));
  }, 100);

  const throttledDwlHandler = throttle((message) => {
    setDwlValue(parseFloat(message.toString()));
  }, 10);

  const throttledAftHandler = throttle((message) => {
    setAftValue(parseFloat(message.toString()));
  }, 10);

  const throttledPw1Handler = throttle((message) => {
    setPw1Value(parseFloat(message.toString()));
  }, 10);

  const throttledAdvHandler = throttle((message) => {
    setAdvValue(parseFloat(message.toString()));
  }, 10);

  const throttledWecHandler = throttle((message) => {
    const wecValue = parseFloat(message.toString());

    // Logic for determining text and color based on wecValue
    let text = '';
    let color = 'green';

    if (wecValue === 0) {
      text = 'Warmup enrichment: 0%';
    } else if (wecValue < 100) {
      text = `Warmup enrichment: ${wecValue}%`;
      color = 'yellow';
    } else {
      text = `Warmup enrichment: ${wecValue}%`;
      color = 'red';
    }

    setWecButtonText(text);
    setWecButtonColor(color);
  }, 100);

  const throttledEngHandler = throttle((message) => {
    const engStatus = parseFloat(message.toString());
    const { color, text } = getEngButtonConfig(engStatus);
    setEngButtonColor(color);
    setEngButtonText(text);
  }, 100);

  const throttledHandlers = {
    '/GOLF86/ECU/RPM': throttledRpmHandler,
    '/GOLF86/GPS/SPD': throttledSpdHandler,
    '/GOLF86/ECU/O2P': throttledO2pHandler,
    '/GOLF86/ECU/TPS': throttledTpsHandler,
    '/GOLF86/ECU/VE1': throttledVe1Handler,
    '/GOLF86/ECU/BAT': throttledBatHandler,
    '/GOLF86/ECU/MAP': throttledMapHandler,
    '/GOLF86/ECU/MAT': throttledMatHandler,
    '/GOLF86/ECU/CAD': throttledCadHandler,
    '/GOLF86/ECU/DWL': throttledDwlHandler,
    '/GOLF86/ECU/AFT': throttledAftHandler,
    '/GOLF86/ECU/PW1': throttledPw1Handler,
    '/GOLF86/ECU/ADV': throttledAdvHandler,
    '/GOLF86/ECU/WEC': throttledWecHandler,
    '/GOLF86/ECU/ENG': throttledEngHandler,
  };

  // Function to determine the button color and text based on the engine status
  const getEngButtonConfig = (status) => {
    switch (status) {
      case 0: // Running
        return { color: 'green', text: 'Running' };
      case 1: // Crank
      case 3: // Warmup
        return { color: 'yellow', text: 'Crank/Warmup' };
      case 2: // ASE
      case 5: // TPSACDEN
      case 7: // MAPACCDEN
        return { color: 'red', text: 'ASE/TPSACDEN/MAPACCDEN' };
      default:
        return { color: 'green', text: 'Unknown' };
    }
  };

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect('http://192.168.88.10:9001');

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to the topics where your gauge data is published
      client.subscribe('/GOLF86/ECU/RPM');
      client.subscribe('/GOLF86/GPS/SPD');
      client.subscribe('/GOLF86/ECU/O2P');
      client.subscribe('/GOLF86/ECU/TPS');
      client.subscribe('/GOLF86/ECU/VE1');
      client.subscribe('/GOLF86/ECU/BAT');
      client.subscribe('/GOLF86/ECU/MAP');
      client.subscribe('/GOLF86/ECU/MAT');
      client.subscribe('/GOLF86/ECU/CAD');
      client.subscribe('/GOLF86/ECU/DWL');
      client.subscribe('/GOLF86/ECU/AFT');
      client.subscribe('/GOLF86/ECU/PW1');
      client.subscribe('/GOLF86/ECU/ADV');
      client.subscribe('/GOLF86/ECU/WEC');
      client.subscribe('/GOLF86/ECU/ENG');
    });

    client.on('message', (topic, message) => {
      // Use the corresponding throttled message handler
      throttledHandlers[topic]?.(message);
    });

    return () => {
      // Disconnect from MQTT when the component unmounts
      client.end();
    };
  }, []); // Only run this effect once on component mount

  return (
    <Container>
    <Typography variant="h4" align="center" gutterBottom style={{ color: 'green', textShadow: '0 0 10px #00ff00' }}>
      Golf MK2 1986
    </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <GaugeComponent
            arc={{
              nbSubArcs: 150,
              colorArray: ['#5BE12C', '#F5CD19', '#EA4228'],
              width: 0.4,
              padding: 0.003
            }}
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [
                  { value: 20 },
                  { value: 40 },
                  { value: 60 },
                  { value: 80 },
                  { value: 100 },
                  { value: 120 },
                  { value: 140 },
                  { value: 160 },
                  { value: 180 },
                  { value: 200 },
                  { value: 220 },
                ],
              }
            }}
            value={spdValue}
            maxValue={240}
          />
          <Typography align="center" variant="subtitle2">
            Km/h
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <GaugeComponent
            arc={{
              nbSubArcs: 150,
              colorArray: ['#5BE12C', '#F5CD19', '#EA4228'],
              width: 0.4, // Increased width for bigger gauge
              padding: 0.003
            }}
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [
                  { value: 500 },
                  { value: 1000 },
                  { value: 1500 },
                  { value: 2000 },
                  { value: 3000 },
                  { value: 4000 },
                  { value: 5000 },
                  { value: 6000 },
                  { value: 7000 },
                  { value: 7500 },
                ],
              }
            }}
            value={rpmValue}
            maxValue={8000}
          />
          <Typography align="center" variant="subtitle2">
            RPM
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 12,
                  color: '#EA4228',
                  showTick: true,
                },
                {
                  limit: 13,
                  color: '#F5CD19',
                  showTick: true,
                },
                {
                  limit: 15,
                  color: '#5BE12C',
                  showTick: true,
                },
                {
                  limit: 16, color: '#F5CD19', showTick: true,
                },
                {
                  color: '#EA4228',
                }
              ]
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: value => value },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: value => value, fontSize: 10 },
                ticks: [
                  { value: 10 },
                  { value: 14.1 },
                  { value: 18 }
                ],
              }
            }}
            value={o2pValue}
            minValue={10}
            maxValue={18}
          />
          <Typography align="center" variant="subtitle2">
            O2 sensor
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 10, color: '#F5CD19', showTick: true,
                },
                {
                  limit: 80,
                  color: '#5BE12C',
                  showTick: true,
                },
                {
                  limit: 90, color: '#F5CD19', showTick: true,
                },
                {
                  color: '#EA4228',
                }
              ]
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: value => value },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: value => value, fontSize: 10 },
              }
            }}
            value={tpsValue}
            minValue={0}
            maxValue={100}
          />
          <Typography align="center" variant="subtitle2">
            Throttle Position
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 25,
                  color: '#F5CD19',
                  showTick: true,
                },
                {
                  limit: 150,
                  color: '#5BE12C',
                  showTick: true,
                },
                {
                  limit: 200, color: '#F5CD19', showTick: true,
                },
                {
                  color: '#EA4228',
                }
              ]
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: value => value },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: value => value, fontSize: 10 },
                ticks: [
                  { value: 50 },
                  { value: 100 },
                  { value: 150 },
                  { value: 200 }
                ],
              }
            }}
            value={ve1Value}
            minValue={0}
            maxValue={256}
          />
          <Typography align="center" variant="subtitle2">
            Volumetric Efficiency (%)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 11,
                  color: '#EA4228',
                  showTick: true,
                },
                {
                  limit: 12,
                  color: '#F5CD19',
                  showTick: true,
                },
                {
                  limit: 14,
                  color: '#5BE12C',
                  showTick: true,
                },
                {
                  limit: 15, color: '#F5CD19', showTick: true,
                },
                {
                  color: '#EA4228',
                }
              ]
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: value => value },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: value => value, fontSize: 10 },
              }
            }}
            value={batValue}
            minValue={8}
            maxValue={18}
          />
          <Typography align="center" variant="subtitle2">
            Battery (V))
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                { limit: 5000, color: '#F5CD19', showTick: true },
                { limit: 10000, color: '#5BE12C', showTick: true },
                { color: '#EA4228' },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value.toFixed(2) },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: (value) => value.toFixed(2), fontSize: 10 },
                ticks: [
                  { value: 5000 },
                  { value: 6000 },
                  { value: 7000 },
                  { value: 8000 },
                  { value: 9000 },
                  { value: 10000 },
                ]
              },
            }}
            value={mapValue}
            minValue={5000}
            maxValue={11000}
          />
          <Typography align="center" variant="subtitle2">
            Manifold air pressure
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                { limit: 0, color: '#F5CD19', showTick: true },
                { limit: 40, color: '#5BE12C', showTick: true },
                { color: '#EA4228' },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value.toFixed(2) },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: (value) => value.toFixed(2), fontSize: 10 },
                ticks: [
                  { value: -20 },
                  { value: -10 },
                  { value: 0 },
                  { value: 10 },
                  { value: 20 },
                  { value: 30 },
                  { value: 40 },
                  { value: 50 },
                ]
              },
            }}
            value={matValue}
            minValue={-30}
            maxValue={60}
          />
          <Typography align="center" variant="subtitle2">
            Manifold air temperature (C)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                { limit: 50, color: '#F5CD19', showTick: true },
                { limit: 110, color: '#5BE12C', showTick: true },
                { color: '#EA4228' },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value.toFixed(2) },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: (value) => value.toFixed(2), fontSize: 10 },
                ticks: [
                  { value: 15 },
                  { value: 30 },
                  { value: 50 },
                  { value: 70 },
                  { value: 90 },
                  { value: 130 },
                ],
              },
            }}
            value={cadValue}
            minValue={0}
            maxValue={150}
          />
          <Typography align="center" variant="subtitle2">
            Coolant temperature (C)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                { color: '#5BE12C' },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value.toFixed(2) },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: (value) => value.toFixed(2), fontSize: 10 },
              },
            }}
            value={dwlValue}
            minValue={0}
            maxValue={4}
          />
          <Typography align="center" variant="subtitle2">
            Dwell time (ms)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 12,
                  color: '#EA4228',
                  showTick: true,
                },
                {
                  limit: 13,
                  color: '#F5CD19',
                  showTick: true,
                },
                {
                  limit: 15,
                  color: '#5BE12C',
                  showTick: true,
                },
                {
                  limit: 16, color: '#F5CD19', showTick: true,
                },
                {
                  color: '#EA4228',
                }
              ]
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: value => value },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: value => value, fontSize: 10 },
                ticks: [
                  { value: 10 },
                  { value: 14.1 },
                  { value: 18 }
                ],
              }
            }}
            value={aftValue}
            minValue={10}
            maxValue={18}
          />
          <Typography align="center" variant="subtitle2">
            Required Air/Fuel ratio
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                { color: '#5BE12C' },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value.toFixed(2) },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: (value) => value.toFixed(2), fontSize: 10 },
              },
            }}
            value={pw1Value}
            minValue={0}
            maxValue={40000}
          />
          <Typography align="center" variant="subtitle2">
            Pulse width (us)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <GaugeComponent
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                { limit: 0, color: '#EA4228', showTick: true },
                { limit: 5, color: '#F5CD19', showTick: true },
                { limit: 20, color: '#5BE12C', showTick: true },
                { limit: 30, color: '#F5CD19', showTick: true },
                { color: '#EA4228' },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.80,
              width: 15,
              elastic: true,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value.toFixed(2) },
              tickLabels: {
                type: 'outer',
                valueConfig: { formatTextValue: (value) => value.toFixed(2), fontSize: 10 },
              },
            }}
            value={advValue}
            minValue={-10}
            maxValue={40}
          />
          <Typography align="center" variant="subtitle2">
            Ignition advance (deg)
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <div>
            <ReactiveButton
              shadow
              outline
              block="true"
              disabled="true"
              color={engButtonColor}
              idleText={engButtonText}
            />
          </div>
          <div>
            <ReactiveButton
              shadow
              outline
              block="true"
              disabled="true"
              color={wecButtonColor}
              idleText={wecButtonText}
            />
          </div>
        </Grid>

      </Grid>
    </Container>
  );
};

export default Dashboard;
