import { McreenPage } from './app.po';

describe('mcreen App', () => {
  let page: McreenPage;

  beforeEach(() => {
    page = new McreenPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
