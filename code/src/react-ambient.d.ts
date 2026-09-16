// Ambient declarations for React and JSX when installed in consumer app
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type TouchEvent = any;
  export type MouseEvent = any;
  export type KeyboardEvent = any;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): { current: T };

  namespace React {
    export type FC<P = {}> = (props: P) => any;
    export type MouseEvent = any;
    export type TouchEvent = any;
    export type KeyboardEvent = any;
    export type ReactNode = any;
  }

  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
