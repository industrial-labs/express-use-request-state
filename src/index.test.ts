import { Response } from "express";
import useRequestState from ".";

describe("useRequestState", () => {
  it("state should be readable right after `setState` returns", () => {
    const res = { locals: {} };
    const { getState, setState } = useRequestState<number>();

    expect(getState(res as Response)).toBe(undefined);
    setState(res as Response, 5);
    expect(getState(res as Response)).toBe(5);
  });
});
