import { event, type Observable, type ObservableEvent } from "@legendapp/state";
import { useObservable } from "@legendapp/state/react";
import { useEffect, type MutableRefObject } from "react";

export interface PositionSize {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

const mapGroups = new Map<string, ObservableEvent>();

function getStyle(el: HTMLElement, styleName: any) {
  return getComputedStyle(el)[styleName] as any;
}

function getOffset(el: HTMLElement) {
  if (!el) {
    return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }
  const rect = el.getBoundingClientRect();
  const doc = el.ownerDocument;
  if (!doc) throw new Error("Unexpectedly missing <document>.");
  const win = doc.defaultView || (doc as any).parentWindow;

  const body = (doc.documentElement ||
    doc.body.parentNode ||
    doc.body) as HTMLElement;
  const winX =
    win.pageXOffset !== undefined ? win.pageXOffset : body.scrollLeft;
  const winY = win.pageYOffset !== undefined ? win.pageYOffset : body.scrollTop;

  return {
    left: rect.left + winX,
    top: rect.top + winY,
    right: rect.right + winX,
    bottom: rect.bottom + winY,
    width: rect.width,
    height: rect.height,
  };
}

function getPosition(el: HTMLElement) {
  if (!el) {
    return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }
  let offset = getOffset(el);
  let parentOffset = { top: 0, left: 0 };
  const marginTop = parseInt(getStyle(el, "marginTop")) || 0;
  const marginLeft = parseInt(getStyle(el, "marginLeft")) || 0;

  if (getStyle(el, "position") === "fixed") {
    offset = el.getBoundingClientRect();
  } else {
    const doc = el.ownerDocument;

    let offsetParent = (el.offsetParent ||
      doc.documentElement) as HTMLElement | null;

    while (
      offsetParent &&
      (offsetParent === doc.body || offsetParent === doc.documentElement)
    ) {
      offsetParent = offsetParent.parentElement;
    }

    if (offsetParent && offsetParent !== el && offsetParent.nodeType === 1) {
      parentOffset = getOffset(offsetParent);
      parentOffset.top +=
        parseInt(getStyle(offsetParent, "borderTopWidth")) || 0;
      parentOffset.left +=
        parseInt(getStyle(offsetParent, "borderLeftWidth")) || 0;
    }
  }

  const top = offset.top - parentOffset.top - marginTop;
  const left = offset.left - parentOffset.left - marginLeft;

  return {
    left: left,
    top: top,
    right: left + offset.width,
    bottom: top + offset.height,
    width: offset.width,
    height: offset.height,
  };
}

function usePositionOrOffset(
  type: "position" | "offset",
  ref: MutableRefObject<HTMLElement | undefined | null>,
  group?: string
): Observable<PositionSize> {
  const fn = type === "position" ? getPosition : getOffset;
  const elementPosition$ = useObservable<PositionSize>();

  function handleChangePosition() {
    elementPosition$.set(fn(ref.current!));
  }

  let ev$: ObservableEvent;
  if (group) {
    if (!mapGroups.has(group)) {
      mapGroups.set(group, event());
    }
    ev$ = mapGroups.get(group)!;
    ev$.on(handleChangePosition);
  }

  useEffect(() => {
    handleChangePosition();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        handleChangePosition();
      });
    });

    // If in a group then fire the event which will trigger handleChangePosition on every element in the group.
    // Otherwise just call the handler
    const handler = group ? () => ev$.fire() : handleChangePosition;
    window.addEventListener("resize", handler);
    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(ref.current!);

    return () => {
      window.removeEventListener("resize", handler);
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps

  return elementPosition$ as any;
}

type Fn = (
  ref: MutableRefObject<HTMLElement | undefined | null>,
  group?: string
) => Observable<PositionSize>;

export const useElementPosition: Fn = usePositionOrOffset.bind(
  this,
  "position"
);
export const useElementOffset: Fn = usePositionOrOffset.bind(this, "offset");