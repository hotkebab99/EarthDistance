import { browser, by, element } from 'protractor';

export class EarthDistancePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('iex-root h1')).getText();
  }
}
