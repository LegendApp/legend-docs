import { View } from 'react-native-web';
import { ExampleAnim } from './ExampleAnim';
import { Motion } from '@legendapp/motion/';
import { MotionSvg } from '@legendapp/motion/svg';
import { MotionLinearGradient } from '@legendapp/motion/linear-gradient';
import * as React from 'react';

const styleBox = {
    width: 50,
    height: 50,
    backgroundColor: '#59B0F8',
    borderRadius: 8,
};

const IntroUsageExample = () => {
    return (
        <ExampleAnim width={240}>
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
