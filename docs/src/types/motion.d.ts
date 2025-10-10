declare module '@legendapp/motion' {
  import * as React from 'react';
  import { ViewProps, PressableProps } from 'react-native';
  
  export interface MotionTransition {
    type?: string;
    duration?: number;
    bounce?: number;
    stiffness?: number;
    damping?: number;
  }
  
  export interface MotionValue {
    x?: number;
    y?: number;
    scale?: number;
    opacity?: number;
    [key: string]: unknown;
  }
  
  export interface MotionProps {
    animate?: MotionValue;
    initial?: MotionValue;
    whileHover?: MotionValue;
    whileTap?: MotionValue;
    transition?: MotionTransition;
    animateProps?: Record<string, unknown>;
  }
  
  export interface MotionViewProps extends ViewProps, MotionProps {}
  export interface MotionPressableProps extends PressableProps, MotionProps {}
  
  export const Motion: {
    View: React.ForwardRefExoticComponent<MotionViewProps>;
    Pressable: React.ForwardRefExoticComponent<MotionPressableProps>;
    [key: string]: React.ForwardRefExoticComponent<Record<string, unknown>>;
  };
}

declare module '@legendapp/motion/svg' {
  import * as React from 'react';
  
  export interface MotionSvgProps extends Record<string, unknown> {
    animateProps?: Record<string, unknown>;
    transition?: {
      type?: string;
      damping?: number;
      stiffness?: number;
    };
  }
  
  export const MotionSvg: {
    Svg: React.ForwardRefExoticComponent<MotionSvgProps>;
    Polygon: React.ForwardRefExoticComponent<MotionSvgProps>;
    [key: string]: React.ForwardRefExoticComponent<MotionSvgProps>;
  };
}
