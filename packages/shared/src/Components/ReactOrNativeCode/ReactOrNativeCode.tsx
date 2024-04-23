import { observe } from "@legendapp/state";
import { useMount } from "@legendapp/state/react";
import { state$ } from "../../state";

export const ReactOrNativeCode = function ReactOrNativeCode() {
  useMount(() => {
    const mapSpans = new Map<Element, "View" | "Text">();
    const spans = document.querySelectorAll("code span");
    const spansEnable = new Set<Element>();
    const spansAsyncStorage = new Set<Element>();
    const spansAsyncStorage2 = new Set<Element>();
    const spansAsyncStorage3 = new Set<HTMLSpanElement>();
    const spansTextInput = new Set<Element>();
    spans.forEach((span) => {
      const text = span.textContent as string;
      if (text === "View" || text === "Text") {
        mapSpans.set(span, text);
      } else if (text?.includes("enableReact") && text.includes("Components")) {
        spansEnable.add(span);
      } else if (text?.includes("ObservablePersistAsyncStorage")) {
        spansAsyncStorage.add(span);
      } else if (text?.includes("async-storage")) {
        spansAsyncStorage2.add(span);
      } else if (text?.includes("asyncStorage: { AsyncStorage }")) {
        spansAsyncStorage3.add(span as HTMLSpanElement);
      } else if (text?.includes("Reactive.TextInput")) {
        spansTextInput.add(span as HTMLSpanElement);
      }
    });
    const dispose = observe(() => {
      const isReact = state$.framework.get() === "React";
      mapSpans.forEach((text, span) => {
        span.textContent = isReact ? "div" : text;
      });
        spansEnable.forEach(span => {
            span.textContent = span.textContent!.replace(/enableReact(?:Native)?Components/, isReact ? 'enableReactComponents' : 'enableReactNativeComponents')
        })
        spansAsyncStorage.forEach(span => {
            span.textContent = span.textContent!.replace(
              /ObservablePersist(?:Local|Async)?Storage/,
              isReact
                ? "ObservablePersistLocalStorage"
                : "ObservablePersistAsyncStorage"
            );
        })
        spansAsyncStorage2.forEach((span) => {
          span.textContent = span.textContent!.replace(
            /(?:local|async)-storage/,
            isReact
              ? "local-storage"
              : "async-storage"
          );
        });
        spansAsyncStorage3.forEach((span) => {
          span.textContent = isReact ? "" : "asyncStorage: { AsyncStorage }"
          span.parentElement!.style.height = isReact ? '0px' : 'auto';
        });
        spansTextInput.forEach((span) => {
          span.textContent = isReact ? "Reactive.input" : "Reactive.TextInput";
        });
    });

    return dispose;
  });
  return null;
};
