// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// fetch polyfill
import fetch, { Headers, Request, Response } from "node-fetch";
import { TextDecoder, TextEncoder } from "node:util";

if (!globalThis.fetch) {
  globalThis.fetch = async (input, ...args) => {
    return fetch(new URL(input, "http://localhost:3000/"), ...args);
  };
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
