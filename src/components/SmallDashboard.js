import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import GaugeComponent from 'react-gauge-component';
import mqtt from 'mqtt';
import throttle from 'lodash/throttle';

const SmallDashboard = () => {
  const [rpmValue, setRpmValue] = useState(0);
  const [spdValue, setSpdValue] = useState(0);

  // Separate throttled functions for each topic
  const throttledRpmHandler = throttle((message) => {
    setRpmValue(parseFloat(message.toString()));
  }, 10);

  const throttledSpdHandler = throttle((message) => {
    const speed = parseFloat(message.toString());
    const roundedSpeed = Math.round(speed * 2) / 2;
    setSpdValue(roundedSpeed >= 1 ? roundedSpeed : 0);
  }, 10);

  const throttledHandlers = {
    '/GOLF86/ECU/RPM': throttledRpmHandler,
    '/GOLF86/GPS/SPD': throttledSpdHandler,

  };

  useEffect(() => {
    // Connect to MQTT broker
    const client = mqtt.connect('http://192.168.88.10:9001');

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      // Subscribe to the topics where your gauge data is published
      client.subscribe('/GOLF86/ECU/RPM');
      client.subscribe('/GOLF86/GPS/SPD');
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
      </Grid>
    </Container>
  );
};

export default SmallDashboard;
