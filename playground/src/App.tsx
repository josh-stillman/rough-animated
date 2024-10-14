/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useRef, useState } from 'react';

import './App.css';
import rough from '../../src/rough';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
function App() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [fillColor, setFillColor] = useState('#0000FF');

  const [fillStyle, setFillStyle] = useState('hachure');
  const [hachureGap, setHachureGap] = useState(5);

  const [animationDuration, setAnimationDuration] = useState(4000);
  const [animationDurationFillPercentage, setAnimationDurationFillPercentage] = useState(.7);

  useEffect(() => {
    resetShape();
  }, []);

  const resetShape = () => {
    if (!svgRef.current) {
      return;
    }


    const rc = rough.svg(svgRef.current!);
    svgRef.current!.replaceChildren(rc.rectangle(10, 10, width, height, { fill: fillColor, hachureGap, animate: true, animationDuration, fillStyle, animationDurationFillPercentage }));
    svgRef.current!.appendChild(rc.circle(width * 1.7, height * .6, width, { fill: fillColor, hachureGap, animate: true, animationDuration, fillStyle, animationDelay: animationDuration, animationDurationFillPercentage }));
  };

  return (
    <>
      <h1>Rough Animated Playground</h1>
      <div className="control-panel">
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <FormControl>
            <div>
              <InputLabel id="demo-simple-select-label">Fill Style</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fillStyle}
                label="Fill Style"
                onChange={(e) => setFillStyle(e.target.value)}
              >
                <MenuItem value={'hachure'}>Hachure</MenuItem>
                <MenuItem value={'solid'}>solid</MenuItem>
                <MenuItem value={'zigzag'}>zigzag</MenuItem>
                <MenuItem value={'cross-hatch'}>cross-hatch</MenuItem>
                <MenuItem value={'dots'}>dots</MenuItem>
                <MenuItem value={'dashed'}>dashed</MenuItem>
                <MenuItem value={'zigzag-line'}>zigzag-line</MenuItem>
              </Select>

              <TextField
                id="outlined-number"
                label="Hachure Gap"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={hachureGap}
                onChange={(e) => setHachureGap(+e.target.value)}
              />
              <TextField
                id="outlined-number"
                label="fill color"
                type="color"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
            </div>
            <div>

              <TextField
                id="outlined-number"
                label="width"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={width}
                onChange={(e) => setWidth(+e.target.value)}
              />
              <TextField
                id="outlined-number"
                label="height"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={height}
                onChange={(e) => setHeight(+e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="outlined-number"
                label="animation duration"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={animationDuration}
                onChange={(e) => setAnimationDuration(+e.target.value)}
              />
              <TextField
                id="outlined-number"
                label="fill duration percentage"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={animationDurationFillPercentage}
                onChange={(e) => setAnimationDurationFillPercentage(+e.target.value)}
              />
            </div>


            <Button onClick={resetShape} variant="outlined">Reset Shape</Button>
          </FormControl>
        </Box>
      </div>

      <svg ref={svgRef} width="100%" height="100%"/>
    </>
  );
}

export default App;
