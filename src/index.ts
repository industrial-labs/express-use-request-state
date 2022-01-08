import { Response } from "express";
import { v4 } from "uuid";

interface UseRequestStateReturn<State> {
  getState: (res: Response) => State | undefined;
  setState: (res: Response, state: State) => void;
}

export default function useRequestState<State>(): UseRequestStateReturn<State> {
  const namespace = v4();

  function getState(res: Response): State {
    return res?.locals?.[namespace];
  }

  function setState(res: Response, state: State): void {
    if (res?.locals) {
      res.locals[namespace] = state;
    }
  }

  return {
    getState,
    setState,
  };
}
