## getting-started/introduction

Legend-Motion is a declarative animations library for React Native, to make it easy to transition between styles without needing to manage animations.

```jsx
<Motion.View
  initial={{ y: -50 }}
  animate={{ x: value * 100, y: 0 }}
  whileHover={{ scale: 1.2 }}
  whileTap={{ y: 20 }}
  transition={{ type: "spring" }}
/>
```

## Highlights

- ✨ Supports react-native and react-native-web
- ✨ API similar to Framer Motion for easy mixing of React Native with React
- ✨ Supports animating SVG and linear gradient
- ✨ Supports transformOrigin
- ✨ whileHover and whileTap for easy animations on touch
- ✨ AnimatePresence for exit animations
- ✨ 0 dependencies using the built-in Animated
- ✨ Built for maximum performance
- ✨ Strongly typed with TypeScript

## Quick Start

Legend-Motion can be installed in React Native or React Native Web.

### Installation

```npm
npm install @legendapp/motion
```

### Importing

```js
import { Motion } from "@legendapp/motion"
```

### Usage

Then set values on the `animate` prop to animate as the value changes.

```jsx
<Motion.View
    animate={{
        x: value * 100,
        opacity: value ? 1 : 0.2,
        scale: value ? 1 : 0.5
    }}
/>
<MotionSvg.Svg>
    <MotionSvg.Polygon
        animateProps={{ points: value === 1 ?
            "120,10 190,160 70,190 23,184" :
            "100,50 140,160 50,130 23,84"
        }}
    />
</MotionSvg.Svg>
<MotionLinearGradient
    animateProps={{
        colors: value ?
            ["#F81FEC", "#59B0F8"] :
            ["blue", "yellow"]
    }}
/>
```

See the [Overview page](../../usage/overview) for a more detailed usage guide.

## Motivation

**Easy to use**: We love the API of Framer-Motion in our web apps and wanted to build our React Native animations with the same ease.

**Interoperable with React**: At [Legend](https://legendapp.com) and [Bravely](https://bravely.io) our web apps mix React.js with components from our React Native apps using react-native-web, and we wanted them to work the same way.

**High performance**: Performance is extremely important to us so we designed for maximum performance with as little overhead as possible, using 0 dependences and minimal code. This library is tree shakeable and comes in at a total of 3kb gzipped if you use every feature.

**Svg and Gradients**: The [Bravely](https://bravely.io) app makes heavy use of gradient and svg animations, so we wanted to make that easy for our developers and yours.

## How it works

To keep the code small and and performance high, we tried to design this as simply as possible.

When a prop passed into `animate` changes, the `Motion` component starts an `Animated.spring` or `Animated.timing` animation with the new prop. If the prop is a string or array, it needs to be interpolated, so it bounces the value of an `AnimatedInterpolation` between 0 and 1, interpolating between the previous prop and the new prop.

For SVG animations, `legend-animations` provides Motion wrappers around all of the `react-native-svg` components, which itself supports passing Animated values into its props.

Linear Gradient animations were inspired by [react-native-animated-linear-gradient](https://github.com/heineiuo/react-native-animated-linear-gradient) (see it for a great description of how it works) and Legend-Motion additionally includes support for multiple color stops and animating `start` and `end`.

## Alternatives

### Moti

[Moti](https://moti.fyi) may be better for you, depending on your needs. It has a similar goal and has some other advanced features like variants, delays, and sequences. But it is larger, depends on Reanimated 2, has a different API, and does not include svg or gradient animations.


## index

Legend-Motion is a declarative animations library for React Native, to make it easy to transition between styles without needing to manage animations.

<div className="flex gap-x-4 items-center">
    <div className="flex-1">
```jsx
<Motion.View
    initial={{ y: -50 }}
    animate={{ x: value * 100, y: 0 }}
    whileHover={{ scale: 1.2 }}
    whileTap={{ y: 20 }}
    transition={{ type: "spring" }}
/>
```
    </div>
    <Editor
        code={`<IntroComponent />`}
        hideCode
    />
</div>

## Highlights

- ✨ Supports react-native and react-native-web
- ✨ API similar to Framer Motion for easy mixing of React Native with React
- ✨ Supports animating SVG and linear gradient
- ✨ Supports transformOrigin
- ✨ whileHover and whileTap for easy animations on touch
- ✨ AnimatePresence for exit animations
- ✨ 0 dependencies using the built-in Animated
- ✨ Built for maximum performance
- ✨ Strongly typed with TypeScript

## Quick Start

Legend-Motion can be installed in React Native or React Native Web.

### Installation

```npm
npm install @legendapp/motion
```

### Usage

Then set values on the `animate` prop to animate as the value changes.

<div className="md:flex gap-x-3 items-center">

<div className="flex-1">

```jsx
import { Motion } from "@legendapp/motion"

<Motion.View
    animate={{
        x: value * 100,
        opacity: value ? 1 : 0.2,
        scale: value ? 1 : 0.5
    }}
/>
```

</div>

<Editor
  code={`<IntroUsageComponent />`}
  hideCode
/>

</div>

See the [Overview page](./usage/overview) for a more detailed usage guide.

## Motivation

**Easy to use**: We love the API of Framer-Motion in our web apps and wanted to build our React Native animations with the same ease.

**Interoperable with React**: At [Legend](https://legendapp.com) and [Bravely](https://bravely.io) our web apps mix React.js with components from our React Native apps using react-native-web, and we wanted them to work the same way.

**High performance**: Performance is extremely important to us so we designed for maximum performance with as little overhead as possible, using 0 dependences and minimal code. This library is tree shakeable and comes in at a total of 3kb gzipped if you use every feature.

**Svg and Gradients**: The [Bravely](https://bravely.io) app makes heavy use of gradient and svg animations, so we wanted to make that easy for our developers and yours.

## How it works

To keep the code small and and performance high, we tried to design this as simply as possible.

When a prop passed into `animate` changes, the `Motion` component starts an `Animated.spring` or `Animated.timing` animation with the new prop. If the prop is a string or array, it needs to be interpolated, so it bounces the value of an `AnimatedInterpolation` between 0 and 1, interpolating between the previous prop and the new prop.

For SVG animations, `legend-animations` provides Motion wrappers around all of the `react-native-svg` components, which itself supports passing Animated values into its props.

Linear Gradient animations were inspired by [react-native-animated-linear-gradient](https://github.com/heineiuo/react-native-animated-linear-gradient) (see it for a great description of how it works) and Legend-Motion additionally includes support for multiple color stops and animating `start` and `end`.

## Alternatives

### Moti

[Moti](https://moti.fyi) may be better for you, depending on your needs. It has a similar goal and has some other advanced features like variants, delays, and sequences. But it is larger, depends on Reanimated 2, has a different API, and does not include svg or gradient animations.


## resources/caveats

## Cannot mix native and non-native animations

React Native does not support mixing native and non-native animations, so Legend-Motion cannot either. The following properties animate with `useNativeDriver` and you cannot mix them with any other properties.

- opacity
- x
- y
- scale
- scaleX
- scaleY
- skewX
- skewY
- perspective
- rotate
- rotateY
- rotateZ
- matrix

If you do need to mix properties together we suggest making them separate components.

## Transform Origin percentages do not work on SVG

The transformOrigin depends on onLayout from the animated component, which doesn't really apply to drawing SVG elements. So you'll need to specific transformOrigin in pixels.


## resources/next-js

There are a few extra steps to get Legend-Motion working on Next.js.

First, Legend-Motion and its dependencies need to be added to the transpile list.


```npm
npm install next-transpile-modules
```

Then wrap your export in `next.config.js` with `withTM`. This is the full config needed to setup Legend-Motion including Linear Gradient and SVG features. You can remove those lines if you don't need them.

```js
const withTM = require("next-transpile-modules")([
  "@legendapp/motion",
  // Only required for MotionLinearGradient:
  "react-native-linear-gradient",
  // Only required for MotionSvg:
  "react-native-svg",
]);

module.exports = withTM({
  webpack(cfg) {
    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      "react-native$": "react-native-web",
      // Only required for MotionLinearGradient:
      "react-native-linear-gradient": "react-native-web-linear-gradient",
    };
    // Only required for MotionSvg:
    cfg.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...cfg.resolve.extensions,
    ];

    return cfg;
  },
});
```

**_Note_**: The reason for these changes is that `react-native-svg` needs `.web.js` to be added to the resolve extensions, and Linear Gradient requires aliasing `react-native-linear-gradient` to `react-native-web-linear-gradient`.


## resources/typescript

Legend-Motion tries to be as strongly typed as possible, with the `animate` prop autocompleting the available styles of the component, `animateProps` autocompleting the component's props, and the `transition` prop autocompleting only the properties that are animated.

If types are not working please ensure that you've installed both `@types/react` and `@types/react-dom`.

```npm
npm install @types/react @types/react-native
```


## usage/animate-presence

`AnimatePresence` lets you use the `exit` prop to animate components when they unmount.

React Native does not have a built-in way to defer unmounting, so `AnimatePresence` holds onto removed components until their exit animation is finished.

Any children of `AnimatePresence` that have an `exit` prop will animate before being removed.

## Usage

<Editor
  code={`
<ExampleAnim width={320} noValue time={1800}>
  {(value) => (
    <View style={{ width: '100%', height: 120, justifyContent: 'center' }}>
      <AnimatePresence>
        {value ? (
          <MotionStyled.View
            key="A"
            style={{
              width: 160,
              height: 90,
              borderRadius: 16,
              backgroundColor: '#59B0F8',
            }}
            initial={{ opacity: 0.1, x: 0 }}
            animate={{ opacity: 1, x: 100 }}
            exit={{ opacity: 0.2, x: 0 }}
            transition={{
              default: {
                type: 'spring',
              },
              opacity: {
                type: 'timing',
              },
            }}
          />
        ) : null}
      </AnimatePresence>
    </View>
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={360}
/>

```jsx
<AnimatePresence>
  {value ? (
    <MotionStyled.View
      key="A"
      initial={{ opacity: 0.1, x: 0 }}
      animate={{ opacity: 1, x: 100 }}
      exit={{ opacity: 0.2, x: 0 }}
      transition={{
        default: {
          type: "spring",
        },
        opacity: {
          type: "timing",
        },
      }}
    />
  ) : null}
</AnimatePresence>
```


`key` is a required prop on children of `AnimatePresence`. This is needed to make sure it is operating on the same elements.

Note that this example has an exit animation going to opacity 0.2 so you can see when it actually gets removed.


## usage/animate-props

Legend-Motion allows you to animate props, which passes an `Animated.Value` into the prop. It's not necessary for the basic React Native components, but it's useful for Legend-Motion's SVG and LinearGradient components or for creating custom components.

See this SVG example that animates the `fill` prop:

<Editor
  code={`
<ExampleAnim width={240} noValue time={1400}>
  {(value) => (
    <MotionSvg.Svg height="200" width="200">
      <MotionSvg.Rect
        stroke="#555"
        strokeWidth="1"
        x="0"
        y="10"
        width="150"
        height="150"
        animateProps={{
          fill: value ? '#F81FEC' : '#59B0F8',
        }}
        transition={{
          type: 'tween',
          duration: 500,
        }}
      />
    </MotionSvg.Svg>
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={280}
/>

```jsx
<MotionSvg.Svg height="200" width="200">
  <MotionSvg.Rect
    stroke="#555"
    strokeWidth="1"
    x="0"
    y="10"
    width="150"
    height="150"
    animateProps={{
      fill: value ? "#F81FEC" : "#59B0F8",
    }}
    transition={{
      type: "tween",
      duration: 500,
    }}
  />
</MotionSvg.Svg>
```


## usage/configuration

## Timing

React Native's Animated does timing in milliseconds while Framer Motion does timing in seconds. Legend-Motion supports both options so you can use the timing configuration that matches the rest of your codebase.

```js
import { configureMotion } from "@legendapp/motion";

configureMotion({ timing: "s" });
```


## usage/custom-components

While Legend-Motion providers animated wrappers around built-in components, you may want to create animated versions of custom components.

`createMotionComponent` is the function that adds the `animate` and `transition` properties and creates the animation logic. You can use it to convert your own components to Motion components.

As an example:

```js
import { createMotionComponent } from "@legendapp/motion";
import { Animated } from "react-native";

const AnimatedView = createMotionComponent(Animated.View);
```


## usage/linear-gradient

To use Linear Gradients you'll also need to install a `linear-gradient` library. There are different libraries for React Native vs. Expo, so choose the right import for your platform:

## Installation

### React Native

```npm
npm install react-native-linear-gradient
```

then import

```js
import { MotionLinearGradient } from "@legendapp/motion/linear-gradient";
```

### Expo

```npm
npm install expo-linear-gradient
```

then import

```js
import { MotionLinearGradient } from "@legendapp/motion/linear-gradient-expo";
```

### React Native Web

```npm
npm install react-native-web-linear-gradient
```

Alias the package in your webpack config:

```js
resolve: {
    alias: {
        'react-native': 'react-native-web',
        ...
        'react-native-linear-gradient': 'react-native-web-linear-gradient',
    }
}
```

then import

```js
import { MotionLinearGradient } from "@legendapp/motion/linear-gradient";
```

## Usage

`MotionLinearGradient` has `colors`, `start`, and `end` props that you can animate.

<Editor
  code={`
<ExampleAnim width={220} noValue>
  {(value) => (
    <MotionLinearGradient
      animateProps={{
        colors: [value ? '#F81FEC' : 'blue', value ? '#59B0F8' : 'yellow'],
        start: { x: 0, y: 0 },
        end: { x: value ? 1 : 0, y: 1 },
      }}
    />
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={260}
/>

```jsx
<MotionLinearGradient
  animateProps={{
    colors: [value ? "#F81FEC" : "blue", value ? "#59B0F8" : "yellow"],
    start: { x: 0, y: 0 },
    end: { x: value ? 1 : 0, y: 1 },
  }}
/>
```


## usage/overview

Legend-Motion provides a set of components wrapping React Native Views.

```js
import { Motion } from "@legendapp/motion"
```

This page includes live examples running through React Native Web.

## Simple animations

We can simply set values on the `animate` prop.

<Editor
  code={`
<ExampleAnim width={200}>
  {(value) => (
    <Motion.View
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#59B0F8',
        borderRadius: 8,
      }}
      animate={{
        x: value * 100,
      }}
    />
  )}
</ExampleAnim>
  `}
  hideCode
/>

```jsx
<Motion.View
  animate={{
    x: value * 100,
  }}
/>
```

When any value in `animate` changes, it will automatically animate to the new values.

## Transitions

Animations use a tween of `300ms` by default, which you can change with the `transition` prop. The easiest way to do that is to set a `Transition` on all animations.

<Editor
  code={`
<ExampleAnim width={220}>
  {(value) => (
    <Motion.View
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#59B0F8',
        borderRadius: 8,
      }}
      animate={{
        x: value * 100,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 400,
      }}
    />
  )}
</ExampleAnim>
  `}
  hideCode
/>

```jsx
<Motion.View
  animate={{
    x: value * 100,
  }}
  transition={{
    type: "spring",
    damping: 20,
    stiffness: 400,
  }}
/>
```

You can customize the animations even further by settings a `Transition` for each animated property. The `default` Transition will apply to all animated properties unless they have a specified transition.

<Editor
  code={`
<ExampleAnim width={220}>
  {(value) => (
    <Motion.View
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#59B0F8',
        borderRadius: 8,
      }}
      animate={{
        x: value * 100,
        opacity: value ? 1 : 0.2,
        scale: value ? 1 : 0.5,
      }}
      transition={{
        default: {
          type: 'spring',
          damping: 20,
          stiffness: 300,
        },
        x: {
          type: 'spring',
          damping: 20,
          stiffness: 1000,
        },
        opacity: {
          type: 'tween',
          duration: 1000,
        },
      }}
    />
  )}
</ExampleAnim>
  `}
  hideCode
/>

```jsx
<Motion.View
  animate={{
    x: value * 100,
    opacity: value ? 1 : 0.2,
    scale: value ? 1 : 0.5,
  }}
  transition={{
    default: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
    x: {
      type: "spring",
      damping: 20,
      stiffness: 1000,
    },
    opacity: {
      type: "tween",
      duration: 1000,
    },
  }}
/>
```

Legend-Motion supports two kinds of transitions, `spring` or `timing`. They pass straight through to Animated, so see the React Native docs on [Timing](https://reactnative.dev/docs/animated#timing) and [Spring](https://reactnative.dev/docs/animated#spring) for usage.

Transitions with durations are called `timing` in React Native's Animated and `tween` in Framer Motion, so Legend-Motion has transition types of both names that do the same thing, to make it easy to match props with the rest of your codebase.

## Animate on mount

When a component mounts, it will automatically be set to the `animate` value. But you want to animate it into position on mount, set `initial` as a starting point.

<Editor
  code={`
<ExampleAnim width={220} noValue time={1800}>
  {(value) => (
    <Motion.View
      key={value}
      style={{
        width: 50,
        height: 50,
        backgroundColor: '#59B0F8',
        borderRadius: 8,
      }}
      initial={{ x: 0 }}
      animate={{ x: 100 }}
    />
  )}
</ExampleAnim>
  `}
  hideCode
/>

```jsx
<Motion.View initial={{ x: 0 }} animate={{ x: 100 }} />
```

This example can be hard to see because it's a mount transition, so try refreshing the page to see it animate into place.

## Automatic interpolating

For values that are strings or arrays, Legend-Motion automatically interpolates between the values so you don't have to worry about it.

<Editor
  code={`
<ExampleAnim width={220}>
  {(value) => (
    <Motion.View
      style={{
        width: 50,
        height: 50,
        borderRadius: 8,
      }}
      animate={{
        backgroundColor: value ? '#F81FEC' : '#59B0F8',
      }}
    />
  )}
</ExampleAnim>
  `}
  hideCode
/>

```jsx
<Motion.View
  animate={{
    backgroundColor: value ? "#F81FEC" : "#59B0F8",
  }}
/>
```

## Text

With the automatic interpolating, it's easy to animate text colors as well as simple numbers like fontSize.

<Editor
  code={`
<ExampleAnim width={220} noValue className="h-20">
  {(value) => (
    <Motion.Text
      style={{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
      }}
      animate={{
        color: value ? '#F81FEC' : '#59B0F8',
        fontSize: value ? 48 : 24,
      }}
    >
      Text
    </Motion.Text>
  )}
</ExampleAnim>
  `}
  hideCode
/>

```jsx
<Motion.Text
  animate={{
    color: value ? "#F81FEC" : "#59B0F8",
    fontSize: value ? 48 : 24,
  }}
>
  Text
</Motion.Text>
```

## Easing

React Native and Framer Motion use different naming, so Legend-Motion supports either `ease` or `easing` props, which do the same thing.

It accepts the same easing functions as React Native's `Animated` along with some named functions to match usage of Framer Motion.

The supported values match most of Framer Motion's options:

`linear`, `easeIn`, `easeOut`, `easeInOut`, `circIn`, `circOut`, `circInOut`, `backIn`, `backOut`, `backInOut`

See the [React Native docs](https://reactnative.dev/docs/easing) for more details.

<Editor
  code={`
<ExampleAnim width={260} time={1600}>
  {(value) => (
    <View
      style={{
        height: 140,
        justifyContent: 'space-between',
        paddingVertical: 8,
      }}
    >
      <Motion.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          backgroundColor: '#59B0F8',
        }}
        animate={{ x: value * 120 }}
        transition={{
          type: 'timing',
          duration: 600,
          easing: 'linear',
        }}
      />
      <Motion.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          backgroundColor: '#F81FEC',
        }}
        animate={{ x: value * 120 }}
        transition={{
          type: 'timing',
          duration: 600,
          easing: Easing.easing,
        }}
      />
    </View>
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={300}
/>

```jsx
<Motion.View
  animate={{ x: value * 100 }}
  transition={{
    type: "timing",
    duration: 300,
    easing: "linear",
  }}
/>
<Motion.View
  animate={{ x: value * 100 }}
  transition={{
    type: "timing",
    duration: 300,
    easing: Easing.linear,
  }}
/>
```

## Gestures

The `whileTap` prop animates to the target while the component is pressed, and the `whileHover` prop animates to the target while the component is hovered. Try pressing the box on the right to see it in action. `whileHover` is only supported in `react-native-web`.

These props require a `Motion.Pressable` ancestor, which is uses for tracking whether it is hovered or pressed. So you could have multiple inner elements that use the same hovered/pressed state.

<Editor
  code={`
<Motion.Pressable
  style={{
    width: 220,
    height: 140,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
  }}
>
  <Motion.View
    style={{
      width: 60,
      height: 60,
      borderRadius: 14,
      backgroundColor: '#59B0F8',
    }}
    whileHover={{ scale: 1.2 }}
    whileTap={{ y: 20 }}
    transition={{
      type: 'spring',
      damping: 20,
      stiffness: 300,
    }}
  />
</Motion.Pressable>
  `}
  hideCode
  previewWidth={260}
/>

```jsx
<Motion.Pressable>
  <Motion.View
    whileHover={{ scale: 1.2 }}
    whileTap={{ y: 20 }}
    transition={{
      type: "spring",
      damping: 20,
      stiffness: 300,
    }}
  />
</Motion.Pressable>
```


## usage/svg

To use SVG animations, you'll need to additionally install `react-native-svg`. See [its documentation](https://github.com/react-native-svg/react-native-svg#installation) for details.

## Usage

SVG animations work by animating the props that you want to change, with the `animateProps` prop.

<Editor
  code={`
<ExampleAnim width={240} noValue>
  {(value) => (
    <MotionSvg.Svg height="200" width="200">
      <MotionSvg.Rect
        stroke="#555"
        strokeWidth="1"
        animateProps={{
          fill: value ? '#F81FEC' : '#59B0F8',
          x: value ? '60' : '0',
          y: value ? '40' : '10',
          width: value ? '140' : '50',
          height: value ? '140' : '50',
        }}
        transition={{
          default: {
            type: 'spring',
            damping: 20,
            stiffness: 300,
          },
          fill: {
            type: 'tween',
            duration: 800,
          },
        }}
      />
    </MotionSvg.Svg>
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={280}
/>

```jsx
import { MotionSvg } from '@legendapp/motion/svg';

<MotionSvg.Svg height="200" width="200">
  <MotionSvg.Rect
    stroke="#555"
    strokeWidth="1"
    animateProps={{
      fill: value ? "#F81FEC" : "#59B0F8",
      x: value ? "60" : "0",
      y: value ? "40" : "10",
      width: value ? "140" : "50",
      height: value ? "140" : "50",
    }}
    transition={{
      default: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
      fill: {
        type: "tween",
        duration: 800,
      },
    }}
  />
</MotionSvg.Svg>
```

You can see in this example that we used a tween transition for the `fill` color and set a default spring transition for the rest of the props, because spring transitions don't look good on colors.


## usage/tailwind-css

Legend-Motion includes a special set of Motion components that support TailwindCSS `className` by using [NativeWind](https://www.nativewind.dev).

<Editor
  code={`
<ExampleAnim width={320} noValue time={1600}>
  {(value) => (
    <View style={{ alignItems: 'center' }}>
      <MotionStyled.View
        style={{
          width: 220,
          borderRadius: 16,
          backgroundColor: '#59B0F8',
          marginBottom: 24,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}
        animate={{ x: value ? 50 : 0 }}
      >
        <MotionStyled.Text
          className="font-bold text-white"
          style={{ color: '#fff', fontWeight: '600' }}
        >
          RN View
        </MotionStyled.Text>
      </MotionStyled.View>
      <MotionStyled.View
        style={{
          width: 220,
          borderRadius: 16,
          backgroundColor: '#F81FEC',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ x: 30 }}
      >
        <MotionStyled.Text
          className="font-bold text-white"
          style={{ color: '#fff', fontWeight: '600' }}
        >
          Press me
        </MotionStyled.Text>
      </MotionStyled.View>
    </View>
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={360}
/>

```jsx
<Motion.View
  className="items-center justify-center p-4"
  animate={{ x: value * 50 }}
>
  <Motion.Text className="font-bold text-white">RN View</Motion.Text>
</Motion.View>
<Motion.View
  className="items-center justify-center p-4 mt-8"
  whileHover={{ scale: 1.1 }}
  whileTap={{ x: 30 }}
>
  <Motion.Text className="font-bold text-white">Press me</Motion.Text>
</Motion.View>
```


## Installation

1. This depends on [NativeWind](https://www.nativewind.dev) so first follow its [installation steps](https://www.nativewind.dev).

2. Then pass `styled` into `configureMotion`

```js
import { styled } from "nativewind";
import { configureMotion } from "@legendapp/motion";

configureMotion({ styled });
```

<br />
3. Then just change the Motion import to `/styled`

```js
import { Motion } from "@legendapp/motion/styled";
```


## usage/transform-origin

A crucial animation feature that's missing from React Native Animated is `transformOrigin`. React Native does transformations from the center of the component, but sometimes you need to scale or rotate from one side. So Legend-Motion adds a `transformOrigin` prop.

You can see in the following example the difference between scaling from the top left vs. the bottom right.

<Editor
  code={`
<ExampleAnim width={320} noValue time={1600}>
  {(value) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Motion.View
        style={{
          width: 90,
          height: 90,
          borderRadius: 16,
          backgroundColor: '#59B0F8',
        }}
        animate={{ scale: value ? 1 : 0.5 }}
        transformOrigin={{ x: 0, y: 0 }}
      />
      <Motion.View
        style={{
          width: 90,
          height: 90,
          borderRadius: 16,
          backgroundColor: '#F81FEC',
        }}
        animate={{ scale: value ? 1 : 0.5 }}
        transformOrigin={{ x: '100%', y: '100%' }}
      />
    </View>
  )}
</ExampleAnim>
  `}
  hideCode
  previewWidth={340}
/>

```jsx
<Motion.View
  animate={{ scale: value ? 1 : 0.5 }}
  transformOrigin={{ x: 0, y: 0 }}
/>
<Motion.View
  animate={{ scale: value ? 1 : 0.5 }}
  transformOrigin={{ x: "100%", y: "100%" }}
/>
```


Possible values are a number of pixels or a percentage, and it defaults to `50%` as usual in React Native.

**Note**: Using `transformOrigin` adds a hook, so setting `transformOrigin` conditionally would cause crashes.

