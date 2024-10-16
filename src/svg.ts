import { Config, Options, OpSet, ResolvedOptions, Drawable, SVGNS } from './core';
import { RoughGenerator } from './generator';
import { Point } from './geometry';

export class RoughSVG {
  private gen: RoughGenerator;
  private svg: SVGSVGElement;

  constructor(svg: SVGSVGElement, config?: Config) {
    this.svg = svg;
    this.gen = new RoughGenerator(config);
  }

  draw(drawable: Drawable): SVGGElement {
    const sets = drawable.sets || [];
    const o = drawable.options || this.getDefaultOptions();
    const doc = this.svg.ownerDocument || window.document;
    const g = doc.createElementNS(SVGNS, 'g');
    const precision = drawable.options.fixedDecimalPlaceDigits;
    for (const drawing of sets) {
      let pathArray: (SVGPathElement | SVGDefsElement)[] = [];

      switch (drawing.type) {
        case 'path': {
          const myPaths = this.opsToPath(drawing, precision);
          for (const myPath of myPaths) {
            const pathEl = doc.createElementNS(SVGNS, 'path');
            pathEl.setAttribute('d', myPath);
            pathEl.setAttribute('stroke', o.stroke);
            pathEl.setAttribute('stroke-width', o.strokeWidth + '');
            pathEl.setAttribute('fill', 'none');
            if (o.strokeLineDash) {
              pathEl.setAttribute('stroke-dasharray', o.strokeLineDash.join(' ').trim());
            }
            if (o.strokeLineDashOffset) {
              pathEl.setAttribute('stroke-dashoffset', `${o.strokeLineDashOffset}`);
            }
            pathArray.push(pathEl);
          }

          if (o.animate) {
            const { animationDuration, animationDelay, animationDurationFillPercentage } = o;

            const animationSegmentDuration = animationDuration * (1 - animationDurationFillPercentage);

            pathArray = this.animatePaths({ input: pathArray, animationSegmentDuration: animationSegmentDuration, animationSegmentDelay: animationDelay, animationDurationFillPercentage });
          }

          break;
        }
        case 'fillPath': {
          const myFillPaths = this.opsToPath(drawing, precision);
          const pathArrayLengthBefore = pathArray.length;
          for (const myFillPath of myFillPaths) {

            if (o.animate) {
              const defsEl = doc.createElementNS(SVGNS, 'defs');

              const gradientEl = doc.createElementNS(SVGNS, 'linearGradient');
              gradientEl.id = 'fill-animation';
              gradientEl.setAttributeNS(null, 'x1', '0%');
              gradientEl.setAttributeNS(null, 'x2', '100%');
              gradientEl.setAttributeNS(null, 'y1', '100%');
              gradientEl.setAttributeNS(null, 'y2', '0%');

              // fill color
              const firstStopEl = doc.createElementNS(SVGNS, 'stop');
              firstStopEl.style.stopColor = o.fill || '';
              firstStopEl.setAttributeNS(null, 'offset', '0');

              // transparency
              const secondStopEl = doc.createElementNS(SVGNS, 'stop');
              secondStopEl.style.stopColor = 'rgba(255,255,255,0)';
              secondStopEl.setAttributeNS(null, 'offset', '0');

              // animation
              const animationEl = doc.createElementNS(SVGNS, 'animate');
              animationEl.setAttributeNS(null, 'attributeName', 'offset');
              animationEl.setAttributeNS(null, 'begin', '0s');
              animationEl.setAttributeNS(null, 'dur', '2s');
              animationEl.setAttributeNS(null, 'from', '0');
              animationEl.setAttributeNS(null, 'to', '1');

              firstStopEl.appendChild(animationEl);
              secondStopEl.appendChild(animationEl.cloneNode());



              gradientEl.appendChild(firstStopEl);
              gradientEl.appendChild(secondStopEl);
              defsEl.appendChild(gradientEl);

              console.log({gradientEl});

              pathArray.push(defsEl);
            }

            const pathEl = doc.createElementNS(SVGNS, 'path');
            pathEl.setAttribute('d', myFillPath);
            pathEl.setAttribute('stroke', 'none');
            pathEl.setAttribute('stroke-width', '0');
            // pathEl.setAttribute('fill', 'linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))');
            if (!o.animate) {
              pathEl.setAttribute('fill', o.fill || '');
            }

            if (o.animate) {
              pathEl.setAttribute('fill', 'url(#fill-animation)');
            }

            // fill becomes a linear gradient, transparent/white and the other is the fill.
            //
            if (drawable.shape === 'curve' || drawable.shape === 'polygon') {
              pathEl.setAttribute('fill-rule', 'evenodd');
            }
            pathArray.push(pathEl);
          }
          console.log('here in fill path');

          // const animate = true;
          // const animationDuration = 1500;
          // const totalLength = pathArray.reduce((acc, el) => acc + el.getTotalLength(), 0);

          // const animationGroupDelay = 0;

          if (o.animate) {

            // this.animatePaths({input: pathArray, animationDuration, animationGroupDelay});
            // let durationOffset = 0;

            // for (let i = pathArrayLengthBefore; i < pathArray.length; i++) {
            //   const path = pathArray[i];
            //   const length = path.getTotalLength();
            //   const duration = totalLength ? (animationDuration * (length / totalLength)) : 0;
            //   const delay = animationGroupDelay + durationOffset;
            //   const style = path.style;
            //   style.strokeDashoffset = `${length}`;
            //   style.strokeDasharray = `${length}`;
            //   style.animation = `rough-animated ${duration}ms ease-out ${delay}ms forwards`;
            //   durationOffset += duration;
            // }
          }
          break;
        }
        case 'fillSketch': {
          const fillSketchPaths = this.fillSketch(doc, drawing, o);
          fillSketchPaths.forEach((f) => pathArray.push(f));
          break;
        }
      }
      if (pathArray.length) {
        pathArray.forEach((p) => g.appendChild(p));
      }
    }
    return g;
  }

  private fillSketch(doc: Document, drawing: OpSet, o: ResolvedOptions): SVGPathElement[] {
    let fweight = o.fillWeight;
    if (fweight < 0) {
      fweight = o.strokeWidth / 2;
    }

    const fillSketchPaths = this.opsToPath(drawing, o.fixedDecimalPlaceDigits);

    let returnPaths: SVGPathElement[] = [];

    for (const myFillSketchPath of fillSketchPaths) {
      const path = doc.createElementNS(SVGNS, 'path');
      path.setAttribute('d', myFillSketchPath);
      path.setAttribute('stroke', o.fill || '');
      path.setAttribute('stroke-width', fweight + '');
      path.setAttribute('fill', 'none');

      // Animation needs control over these css properties
      if (!o.animate) {
        if (o.fillLineDash) {
          path.setAttribute('stroke-dasharray', o.fillLineDash.join(' ').trim());
        }
        if (o.fillLineDashOffset) {
          path.setAttribute('stroke-dashoffset', `${o.fillLineDashOffset}`);
        }
      }

      returnPaths.push(path);
    }

    if (o.animate) {
      const { animationDuration, animationDelay, animationDurationFillPercentage } = o;

      const animationSegmentDuration = animationDuration * animationDurationFillPercentage;
      const fillSketchDelay = animationDelay + (animationDuration * (1 - animationDurationFillPercentage));

      returnPaths = this.animatePaths({ input: returnPaths, animationSegmentDuration, animationSegmentDelay: fillSketchDelay, toggleDirection: true, useProportionalDuration: false });
    }

    return returnPaths;
  }

  animatePaths({ input, animationSegmentDuration, animationSegmentDelay, toggleDirection = false, useProportionalDuration = true }: { input: SVGPathElement[]; animationSegmentDuration: number; animationSegmentDelay: number; toggleDirection?: boolean; useProportionalDuration?: boolean; }): SVGPathElement[] {
    const animatedPaths = [...input];
    // TODO: need offset for fills

    const totalLength = animatedPaths.reduce((acc, el) => acc += el.getTotalLength(), 0);
    let durationOffset = 0;

    for (let i = 0; i < animatedPaths.length; i++) {
      const path = animatedPaths[i];

      // create dash to cover path
      const length = path.getTotalLength();
      path.style.strokeDashoffset = `${length * (toggleDirection && (i % 2 !== 0) ? -1 : 1)}`;
      path.style.strokeDasharray = `${length}`;

      // calculate duration of path animation
      const proportionalDuration = totalLength ? (animationSegmentDuration * (length / totalLength)) : 0;
      const equalDuration = animationSegmentDuration / animatedPaths.length;
      const duration = useProportionalDuration ? proportionalDuration : equalDuration;

      // caclulate path animation delay
      const delay = animationSegmentDelay + durationOffset;

      path.style.animation = `rough-animated ${duration}ms ease-out ${delay}ms forwards`;

      durationOffset += duration;
    }

    return animatedPaths;
  }

  get generator(): RoughGenerator {
    return this.gen;
  }

  getDefaultOptions(): ResolvedOptions {
    return this.gen.defaultOptions;
  }

  opsToPath(drawing: OpSet, fixedDecimalPlaceDigits?: number): string[] {
    return this.gen.opsToPath(drawing, fixedDecimalPlaceDigits);
  }

  line(x1: number, y1: number, x2: number, y2: number, options?: Options): SVGGElement {
    const d = this.gen.line(x1, y1, x2, y2, options);
    return this.draw(d);
  }

  rectangle(x: number, y: number, width: number, height: number, options?: Options): SVGGElement {
    const d = this.gen.rectangle(x, y, width, height, options);
    return this.draw(d);
  }

  ellipse(x: number, y: number, width: number, height: number, options?: Options): SVGGElement {
    const d = this.gen.ellipse(x, y, width, height, options);
    return this.draw(d);
  }

  circle(x: number, y: number, diameter: number, options?: Options): SVGGElement {
    const d = this.gen.circle(x, y, diameter, options);
    return this.draw(d);
  }

  linearPath(points: Point[], options?: Options): SVGGElement {
    const d = this.gen.linearPath(points, options);
    return this.draw(d);
  }

  polygon(points: Point[], options?: Options): SVGGElement {
    const d = this.gen.polygon(points, options);
    return this.draw(d);
  }

  arc(x: number, y: number, width: number, height: number, start: number, stop: number, closed: boolean = false, options?: Options): SVGGElement {
    const d = this.gen.arc(x, y, width, height, start, stop, closed, options);
    return this.draw(d);
  }

  curve(points: Point[] | Point[][], options?: Options): SVGGElement {
    const d = this.gen.curve(points, options);
    return this.draw(d);
  }

  path(d: string, options?: Options): SVGGElement {
    const drawing = this.gen.path(d, options);
    return this.draw(drawing);
  }
}
