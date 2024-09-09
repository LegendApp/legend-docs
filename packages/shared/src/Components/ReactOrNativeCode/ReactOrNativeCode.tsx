import { observe } from "@legendapp/state";
import { useMount } from "@legendapp/state/react";
import { state$ } from "../../state";

interface Props {
  onlyFirst: boolean;
}

export const ReactOrNativeCode = function ReactOrNativeCode({ onlyFirst }: Props) {
  useMount(() => {
    const mapSpans = new Map<Element, "View" | "Text">();
    const spans = document.querySelectorAll("code span");
    const spansMMKV = new Set<Element>();
    const spansMMKV2 = new Set<Element>();
    const spansTextInput = new Set<Element>();
    spans.forEach((span) => {
      const text = span.textContent as string;
      if (text === "View" || text === "Text") {
        mapSpans.set(span, text);
      } else if (text?.includes("ObservablePersistMMKV")) {
        if (!onlyFirst || spansMMKV.size < 2) {
          spansMMKV.add(span);
        }
      } else if (text?.includes("/mmkv")) {
        if (!onlyFirst || spansMMKV2.size < 1) {
          spansMMKV2.add(span);
        }
      } else if (text?.includes("Reactive.TextInput")) {
        spansTextInput.add(span as HTMLSpanElement);
      }
    });
    const dispose = observe(() => {
      const isReact = state$.framework.get() === "React";
      mapSpans.forEach((text, span) => {
        span.textContent = isReact ? "div" : text;
      });
      spansMMKV.forEach((span) => {
        span.textContent = span.textContent!.replace(
          /ObservablePersist(?:LocalStorage|MMKV)/,
          isReact ? "ObservablePersistLocalStorage" : "ObservablePersistMMKV"
        );
      });
      spansMMKV2.forEach((span) => {
        span.textContent = span.textContent!.replace(
          /local-storage|mmkv/,
          isReact ? "local-storage" : "mmkv"
        );
      });
      spansTextInput.forEach((span) => {
        span.textContent = isReact ? "Reactive.input" : "Reactive.TextInput";
      });
    });

    return dispose;
  });
  return null;
};
