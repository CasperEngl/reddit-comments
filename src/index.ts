import * as path from 'path';

import { mkdirp } from 'fs-extra';
import puppeteer from 'puppeteer';
import slug from 'slug';
import commandLineArgs from 'command-line-args';
import downloadsFolder from 'downloads-folder';

import { optionDefinitions } from './optionDefinitions';
import { createVideo } from './createVideo';
import { askForPostUrl } from './askForPostUrl';

const launch = async (): Promise<void> => {
  const argv = commandLineArgs(optionDefinitions);

  const { url } = await askForPostUrl();

  const browser = await puppeteer.launch({
    headless: !argv.head,
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 180000,
  });

  if (argv['remove-ago']) {
    await page.evaluate(() => {
      const removeAbleSpans = document.querySelectorAll('span');

      Array.from(removeAbleSpans)
        .filter((span) => (
          span.innerHTML.includes('·')
        || span.innerHTML.includes('edited')
        || span.innerHTML.includes('days ago')
        ))
        .forEach(
          (span: HTMLElement) => span.parentNode?.removeChild(span),
        );
    }, 'body');
  }

  const titleElement = await page.$x('//h1[last()]');

  const title = slug(
    await page.evaluate(
      (element) => element.textContent, (titleElement.pop() as puppeteer.ElementHandle<Element>),
    ), {
      lower: true,
    },
  );

  const spans = await page.$x('//span[contains(text(), \'level 1\')]');

  const comments = await Promise.all(
    spans.map(
      (span) => span.$x('../..').then(
        (result) => result.pop(),
      ),
    ),
  );

  const dest = argv.path === downloadsFolder()
    ? `${argv.path}/${title}`
    : path.join(process.cwd(), `${argv.path}`);

  await mkdirp(dest);

  const paths: string[] = [];

  for (const comment of comments) { // eslint-disable-line
    const classNames = await comment?.getProperty('className');
    const value = await classNames?.jsonValue();
    const name = slug(value, {
      lower: true,
    });

    await comment?.screenshot({
      path: `${dest}/${name}.png`,
    });

    paths.push(`${dest}/${name}.png`);
  }

  createVideo(paths[0], title);

  await browser.close();
};

(async (): Promise<void> => {
  try {
    await launch();
  } catch (error) {
    console.error(`${error.name}: ${error.message}`);
  }
})();
