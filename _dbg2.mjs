export default async function run(page, ui) {
  await page.goto('file:///c:/Users/Rowzabaghi/Desktop/Ask a Doctor/pages/AskADoctor.html', { waitUntil: 'domcontentloaded', timeout: 120000 });

  // Run the loader logic step by step inside the page:
  const steps = await page.evaluate(async () => {
    const log = [];
    try {
      log.push('fetch react...');
      const t0 = Date.now();
      const r1 = await fetch('https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js');
      const c1 = await r1.text();
      log.push('react fetched ' + c1.length + 'b in ' + (Date.now() - t0) + 'ms');
      eval(c1);
      log.push('React defined: ' + typeof window.React);
    } catch (e) {
      log.push('ERR: ' + e.message);
    }
    return log;
  });
  return { steps, reactGlobal: await page.evaluate(() => typeof window.React) };
}
