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
