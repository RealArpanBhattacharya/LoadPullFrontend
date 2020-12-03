import React, { Dispatch, SetStateAction, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Typography from '@material-ui/core/Typography/Typography';
import { Card, Grid, Input, makeStyles, Paper, Slider } from '@material-ui/core';
import { truncateSync } from 'fs';
import axios from 'axios'
import * as https from 'https';

const useStyles = makeStyles({
  root: {

    width: "40%",
    display: 'inline-block'
  },
  card: {

    width: "80%",
    display: 'inline-block'
  },
  paper: {
    width: "20%",
    textAlign: 'center',
    display: 'inline-block'

  },
  input: {
    width: 54,
  },

});



function App() {

  const classes = useStyles();
  const [coax, setCoax] = useState(0.1);
  const [freq, setFreq] = useState(4);
  const [gammaPoint, setGammaPoint] = useState(1);
  const [harmonicNumber, setHarmonicNumber] = useState(1);
  const [power, setPower] = useState(-26);
  const [a1r, set_a1r] = useState(0);
  const [a1i, set_a1i] = useState(0);
  const [a2r, set_a2r] = useState(0);
  const [a2i, set_a2i] = useState(0);
  const [b1r, set_b1r] = useState(0);
  const [b1i, set_b1i] = useState(0);
  const [b2r, set_b2r] = useState(0);
  const [b2i, set_b2i] = useState(0);


  enum FetchStatus {
    NotRequested,
    Loading,
    Fetched,
  };
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>(FetchStatus.NotRequested);

  const [response, setResponse] = useState();


  async function getData() {
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
          
    const _response = await instance.get('http://ec2-54-210-88-129.compute-1.amazonaws.com/getCurrentAndVoltageValues', {
      headers: { 'content-type': 'application/json', "Access-Control-Allow-Origin": "*" ,  "Access-Control-Allow-Headers": "Content-Type", 'Origin': 'https://https://main.d2nqlqeo8aar14.amplifyapp.com/'},
      params: {
        "Param1": coax,
        "Param2": freq,
        "Gamma Point": gammaPoint,
        "Harmonic Number": harmonicNumber,
        "Power": power,
        "A1 Real": a1r * Math.pow(10, -12),
        "A1 Imaginary": a1i * Math.pow(10, -12),
        "A2 Real": a2r * Math.pow(10, -12),
        "A2 Imaginary": a2i * Math.pow(10, -12),
        "B1 Real": b1r * Math.pow(10, -12),
        "B1 Imaginary": b1i * Math.pow(10, -12),
        "B2 Real": b2r * Math.pow(10, -12),
        "B2 Imaginary": b2i * Math.pow(10, -12),
      }
    });
    setResponse(_response.data);
  };


  function CustomSlider(entryName: string, min: number, max: number, step: number, setValue: Dispatch<SetStateAction<number>>, getValue: () => number, unit: string) {
    const classes = useStyles();

    const handleSliderChange = (event: any, newValue: number | number[]) => {
      setValue(newValue as any);
      getData();
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number.parseFloat(event.target.value));
      getData();
    };

    const handleBlur = () => {
      if (getValue() < min) {
        setValue(min);
      } else if (getValue() > max) {
        setValue(max);
      }
    };



    return <><Typography id="discrete-slider" gutterBottom>
    </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item xs>
          <b>{entryName}</b>

        </Grid>
        <Grid item xs>

          <Slider
            value={typeof getValue() === 'number' ? getValue() : 0}
            className={classes.root}
            color='secondary'
            valueLabelDisplay="auto"
            step={step}
            onChange={handleSliderChange}

            marks={true}
            min={min}
            max={max}
          />        </Grid>
        <Grid item xs>
          <Input
            className={classes.input}
            value={getValue()}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          /> {unit}
        </Grid>
      </Grid>
    </>


  }
  return (
    <Paper className="App">
      <p> Circuit Configuration </p>
      {CustomSlider("Coax.", 0, 0.2, 0.1, setCoax, () => coax, "GHz")}
      {CustomSlider("Frequency.", 0, 6, 2, setFreq, () => freq, "dB")}
      {CustomSlider("Gamma Point", 1, 70, 1, setGammaPoint, () => gammaPoint, "")}
      {CustomSlider("Harmonic Number", 1, 3, 1, setHarmonicNumber, () => harmonicNumber, "")}
      {CustomSlider("Power", -30, -10, 1, setPower, () => power, "")}
      <p> Positional Configuration </p>
      {CustomSlider("A1 Real", -10000, 10000, 500, set_a1r, () => a1r, "x 10⁻¹²")}
      {CustomSlider("A1 Imaginary", -10000, 10000, 500, set_a1i, () => a1i, "x 10⁻¹²")}
      {CustomSlider("A2 Real", -10000, 10000, 500, set_a2r, () => a2r, "x 10⁻¹²")}
      {CustomSlider("A2 Imaginary", -10000, 10000, 500, set_a2i, () => a2i, "x 10⁻¹²")}
      {CustomSlider("B1 Real", -10000, 10000, 500, set_b1r, () => b1r, "x 10⁻¹²")}
      {CustomSlider("B1 Imaginary", -10000, 10000, 500, set_b1i, () => b1i, "x 10⁻¹²")}
      {CustomSlider("B2 Real", -10000, 10000, 500, set_b2r, () => b2r, "x 10⁻¹²")}
      {CustomSlider("B2 Imaginary", -10000, 10000, 500, set_b2i, () => b2i, "x 10⁻¹²")}

      <p> </p>


      <Card style={{ width: 800 }} className={classes.card} color={"pink"} >

        {(response != undefined) &&
          <>

            <b> Predicted Current And Voltage Values </b>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item xs>
                <b>I1</b>

              </Grid>
              <Grid item xs>


                {(response as any)["I1"] ?? ""}
              </Grid>

              </Grid>
              <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item xs>
                <b>I2</b>

              </Grid>
              <Grid item xs>

                {(response as any)["I2"] ?? ""}
              </Grid>
              </Grid>

              <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
                            <Grid item xs>
                <b>V1</b>
              </Grid>
              <Grid item xs>

                -0.3
        </Grid>

        </Grid>
        <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item xs>
                <b>V2</b>

              </Grid>
              <Grid item xs>

                3        </Grid>


            </Grid>
          </>

        }
      </Card>

    </Paper >
  );
}

export default App;
