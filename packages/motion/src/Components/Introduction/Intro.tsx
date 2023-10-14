import { observable } from "@legendapp/state";
import classNames from "classnames";
import { Editor } from "shared/src/Components/Editor/Editor";
import { ExampleAnim } from "../ExampleAnim/ExampleAnimComponent";
import { Motion } from "@legendapp/motion";

const MotionPressable = Motion.Pressable;
const MotionView = Motion.View;

const INTRO_CODE = `
const Intro = () => {
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

render(<Intro />)
`;

export function IntroComponent() {
  return (
    <Editor
      code={INTRO_CODE}
      scope={{
        observable,
        classNames,
        ExampleAnim,
        MotionPressable,
        MotionView,
      }}
      noInline={true}
    />
  );
}
