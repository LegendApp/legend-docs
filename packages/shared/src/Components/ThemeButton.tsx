import { type Observable } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";
import { observer, Reactive } from "@legendapp/state/react";
import { BiMoon, BiSun } from "react-icons/bi";

enableReactComponents();

export const ThemeButton = observer(function ThemeButton({
  $value,
}: {
  $value: Observable<"light" | "dark">;
}) {
  const value = $value.get();
  return (
    <Reactive.div
      className={
      'absolute right-0 top-0 size-8 flex justify-center items-center cursor-pointer hover:text-blue-500'
      }
      onClick={() => $value.set((prev) => prev === 'dark' ? 'light' : 'dark')}
    >
      {value === "dark" ? <BiMoon size={16} /> : <BiSun size={16} />}
    </Reactive.div>
  );
});
