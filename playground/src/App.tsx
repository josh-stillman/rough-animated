/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useRef, useState } from 'react';

import './App.css';
import rough from '../../src/rough';
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
function App() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [width, setWidth] = useState(searchParams.get('width') ? parseInt(searchParams.get('width') as string) : 300);
  const [height, setHeight] = useState(searchParams.get('height') ? parseInt(searchParams.get('height') as string) : 300);
  const [fillColor, setFillColor] = useState(searchParams.get('fillColor') || '#0000FF');

  const [fillStyle, setFillStyle] = useState(searchParams.get('fillStyle') || 'hachure');
  const [hachureGap, setHachureGap] = useState(searchParams.get('hachureGap') ? parseInt(searchParams.get('hachureGap') as string) : 5);
  const [hachureAngle, setHachureAngle] = useState(searchParams.get('hachureAngle') ? parseInt(searchParams.get('hachureAngle') as string) : -41);
  const [fillWeight, setFillWeight] = useState(searchParams.get('fillWeight') ? parseInt(searchParams.get('fillWeight') as string) : 1);

  const [animate, setAnimate] = useState(searchParams.get('animate') ? searchParams.get('animate') === 'true' : true);
  const [animationDuration, setAnimationDuration] = useState(searchParams.get('duration') ? parseInt(searchParams.get('duration') as string) : 4000);
  const [fillDuration, setFillDuration] = useState(searchParams.get('fillDuration') ? parseFloat(searchParams.get('fillDuration') as string) : .7);

  useEffect(() => {
    resetShape();
  }, []);

  const resetShape = () => {
    if (!svgRef.current) {
      return;
    }

    const rc = rough.svg(svgRef.current!);
    svgRef.current!.replaceChildren(rc.rectangle(10, 10, width, height, { fill: fillColor, fillWeight, hachureGap, hachureAngle, animate, animationDuration, fillStyle, animationDurationFillPercentage: fillDuration }));
    svgRef.current!.appendChild(rc.circle(width * 1.7, height * .6, width, { fill: fillColor, fillWeight, hachureGap, hachureAngle, animate, animationDuration, fillStyle, animationDelay: animationDuration, animationDurationFillPercentage: fillDuration }));

    setSearchParams({
      animate: `${animate}`,
      animationDuration: `${animationDuration}`,
      fillDuration: `${fillDuration}`,
      fillStyle,
      fillColor,
      hachureGap: `${hachureGap}`,
      hachureAngle: `${hachureAngle}`,
      width: `${width}`,
      height: `${height}`,
    });
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
                label="Hachure Angle"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={hachureAngle}
                onChange={(e) => setHachureAngle(+e.target.value)}
              />

              <TextField
                id="outlined-number"
                label="Fill Weight"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={fillWeight}
                onChange={(e) => setFillWeight(+e.target.value)}
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
                value={fillDuration}
                onChange={(e) => setFillDuration(+e.target.value)}
              />
              <FormControlLabel control={
                <Checkbox
                  checked={animate}
                  onChange={(e) => setAnimate(e.target.checked)}
                />}
              label="animate" />

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
