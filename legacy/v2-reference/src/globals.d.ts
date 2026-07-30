declare const React: {
  createElement: any;
  Fragment: any;
  useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
  useMemo: <T>(factory: () => T, deps: any[]) => T;
  useRef: <T>(initial: T) => { current: T };
  useState: <T>(initial: T | (() => T)) => [T, (value: T | ((current: T) => T)) => void];
  useCallback: <T extends (...args: any[]) => any>(fn: T, deps: any[]) => T;
};
declare const ReactDOMClient: any;
declare namespace JSX {
  interface Element {}
  interface ElementChildrenAttribute { children: {} }
  interface IntrinsicAttributes { key?: any }
  interface IntrinsicElements { [elemName: string]: any }
}
