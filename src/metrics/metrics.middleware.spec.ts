import { MetricsMiddleware } from './metrics.middleware';

describe('MetricsMiddleware', () => {
  it('should be defined', () => {
    expect(new MetricsMiddleware()).toBeDefined();
  });
});
