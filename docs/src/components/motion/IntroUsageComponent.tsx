import { View } from "react-native-web";
import { ExampleAnim } from "./ExampleAnim";

// Mock Motion components for demonstration
const Motion = {
  View: ({ children, style, ...props }: { children?: React.ReactNode; style?: object; [key: string]: unknown }) => (
    <View style={[style, { backgroundColor: '#59B0F8', borderRadius: 8 }]} {...props}>
      {children}
    </View>
  ),
};

// Mock SVG Motion components
const MotionSvg = {
  Svg: ({ children, height, width, style, ...props }: { children?: React.ReactNode; height?: number; width?: number; style?: object; [key: string]: unknown }) => (
    <svg height={height} width={width} style={style} {...props}>
      {children}
    </svg>
  ),
  Polygon: ({ strokeWidth, fill, animateProps, points, ...props }: { strokeWidth?: number; fill?: string; animateProps?: { points?: string }; points?: string; [key: string]: unknown }) => (
    <polygon
      strokeWidth={strokeWidth}
      fill={fill}
      points={points || animateProps?.points}
      {...props}
    />
  ),
};

// Mock LinearGradient component
const MotionLinearGradient = ({ style, animateProps, children, ...props }: { style?: object; animateProps?: { colors?: string[] }; children?: React.ReactNode; [key: string]: unknown }) => (
  <View 
    style={[
      style, 
      { 
        background: `linear-gradient(to bottom, ${animateProps?.colors?.[0] || 'blue'}, ${animateProps?.colors?.[1] || 'yellow'})` 
      }
    ]} 
    {...props}
  >
    {children}
  </View>
);

const styleBox = {
  width: 50,
  height: 50,
  backgroundColor: '#59B0F8',
  borderRadius: 8,
};

const IntroUsageExample = () => {
  return (
    <ExampleAnim width={200}>
      {(value) => (
        <View>
          <Motion.View
            style={styleBox}
            animate={{
              x: value * 100,
              opacity: value ? 1 : 0.2,
              scale: value ? 1 : 0.5,
            }}
            transition={{
              type: 'spring',
            }}
          />
          <MotionSvg.Svg height="200" width="200" style={{ marginTop: 48 }}>
            <MotionSvg.Polygon
              strokeWidth={1}
              fill="#59B0F8"
              animateProps={{
                points: value === 1 ? '120,10 190,160 70,190 23,184' : '100,50 140,160 50,130 23,84',
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }}
            />
          </MotionSvg.Svg>
          <MotionLinearGradient
            style={[styleBox, { width: 100, height: 100, marginLeft: 50, marginTop: 48 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            animateProps={{
              colors: [value ? '#F81FEC' : 'blue', value ? '#59B0F8' : 'yellow'],
            }}
          />
        </View>
      )}
    </ExampleAnim>
  );
};

export function IntroUsageComponent() {
  return <IntroUsageExample />;
}