import { KnappGisReportsPage } from './app.po';

describe('knapp-gis-reports App', function() {
  let page: KnappGisReportsPage;

  beforeEach(() => {
    page = new KnappGisReportsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
