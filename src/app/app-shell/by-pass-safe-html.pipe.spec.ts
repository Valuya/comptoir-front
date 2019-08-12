import { ByPassSafeHtmlPipe } from './by-pass-safe-html.pipe';

describe('ByPassSafeHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new ByPassSafeHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
