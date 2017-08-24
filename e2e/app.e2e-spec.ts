import { EarthDistancePage } from './app.po';

describe('earth-distance App', () => {
  let page: EarthDistancePage;

  beforeEach(() => {
    page = new EarthDistancePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to iex!');
  });
});
