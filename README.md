# @industrial-labs/express-use-request-state

Persist state during a request in express.

## What is it?

`useRequestState` is an abstraction on top of `res.locals`, the standard way to persist state within a request in express.

## Why should I use it?

The goal of this module is to allow you to better persist state throughout requests in express by using encapsulation.

The whole idea is to use a setter and a getter instead of writing directly into `res.locals`.
This allows to prevent accidental state overwriting from other areas.

Plus, if you use typescript, you can take specify the interface of your state and enjoy intellisense during your code session.

## Install

```
npm i @industrial-labs/express-use-request-state
```

## Usage

This modules is particularly useful when your need to persist state while writing custom middlewares.
Let's pretend we need to write a middleware for AB-test that tells us in which group the request is bucketed:

```typescript
import useRequestState from "@industrial-labs/express-use-request-state";

const { setState, getState } = useRequestState<boolean>();

export default function abTestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isRequestInTestGroup = Date.now() % 2 === 0;
  setState(res, isRequestInTestGroup);
}

export function isRequestInTestGroup(res: Response): boolean {
  return getState(res) || false;
}
```

In the code above we checked if the request should be in the test group and we saved that value as state of the request.
Now, we can use the `isRequestInTestGroup` function to retrieve that information from another area of the codebase, for example during the rendering of the page:

```typescript
import abTestMiddleware, {
  isRequestInTestGroup,
} from "./middlewares/abTestMiddleware";

app.use(abTestMiddleware, function renderPage(req: Request, res: Response) {
  if (isRequestInTestGroup()) {
    res.send("You are in the test!");
  } else {
    res.send("Welcome to the home page");
  }

  return res.end();
});
```

Everytime you call `useRequestState` you will receive a `setState` and `getState` function.
Every time you invoke `useRequestState`, the module will reserve a dedicated internal namespace for your state.
This allow you to use as many states as you want:

```typescript
import useRequestState from "@industrial-labs/express-use-request-state";

const { setState: setUser, getState: getUser } = useRequestState<{
  id: string;
  email: string;
  name: string;
}>();
const { setState: setTestVariant, getState: getTestVariant } =
  useRequestState<string>();
const { setState: setRequestCount, getState: getRequestCount } =
  useRequestState<number>();
```
