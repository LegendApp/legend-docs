import { ExampleAnim } from './ExampleAnim';
import { Motion } from '@legendapp/motion';

const styleBox = {
    width: 50,
    height: 50,
    backgroundColor: '#59B0F8',
    borderRadius: 8,
};

const MotionPressable = Motion.Pressable;
const MotionView = Motion.View;

const IntroExample = () => {
    return (
        <ExampleAnim width={200}>
            {(value) => (
                <MotionPressable>
                    <MotionView
                        style={styleBox}
                        initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    />
                </MotionPressable>
            )}
        </ExampleAnim>
    );
};

export function IntroComponent() {
    return <IntroExample />;
}
