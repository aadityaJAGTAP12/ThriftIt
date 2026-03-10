import { errorMiddleware } from './error-handler.js';

describe('errorMiddleware', () => {
  it('should be defined', () => {
    expect(errorMiddleware).toBeDefined();
  });
});
