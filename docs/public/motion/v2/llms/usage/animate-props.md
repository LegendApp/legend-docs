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
