# Rough.js Animated

This is a fork of Rough.js adding animations.  This is a work in progress, and the end goal is to submit a PR to the rough.js repo merging this functionality.  It is not published to npm but can be consumed directly from GitHub.

See the underlying [rough.js documenation](https://github.com/rough-stuff/rough) for more.

## Playground

See the playground [here]().

## Installation

Simply add this github repo to your dependencies as follows, then run `npm i`:

```json
  "rough-animated": "josh-stillman/rough-animated"
```

## Animations Options

The following animations are added to the standard rough [config](https://github.com/rough-stuff/rough/wiki#options).

| Option        | Type          | Description
| ------------- | ------------- | ------------- |
| animate       | boolean       | Enables animations.
| animationDuration  | number  | Duration in ms.
| animationDurationFillPercentage  | number between 0 and 1  | Percentage of the duration to use for the fill.
| animationDelay | number | Number of ms to delay the start of the animation.  Useful for orchestrating multiple animated shapes
