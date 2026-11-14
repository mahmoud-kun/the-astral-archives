async (page) => {
  const output = 'docs/visual-validation';
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const sizes = [[1920,1080], [1366,768], [390,844], [360,800]];
  const labels = [
    ['Open Mission Files cabinet', 'Mission Files'],
    ['Inspect Evidence Board', 'Evidence Board'],
    ['Read Mission Briefing at center terminal', 'Mission Briefing'],
    ['Open Station Door directory', 'Station Door'],
    ['Inspect Rescue Console', 'Rescue Console'],
  ];
  const results = [];
  for (const [width,height] of sizes) {
    await page.setViewportSize({width,height});
    await page.goto('http://127.0.0.1:5173/?room=1');
    await page.locator('.idr-layered-scene:visible .idr-scene-image').waitFor();
    await page.locator('.idr-layered-scene:visible img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    await page.screenshot({path:`${output}/room-${width}x${height}.png`, fullPage:false});
    const broken = await page.locator('img:visible').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
    const floating = await page.getByText('INTERACT', {exact:true}).count() + await page.getByText('CASE FILES', {exact:true}).count();
    results.push({size:`${width}x${height}`, broken, floating});
    for (const [label, dialog] of labels) {
      const button = page.getByRole('button', {name:label}).filter({visible:true});
      await button.focus();
      await page.keyboard.press('Enter');
      const opened = await page.getByRole('dialog', {name:dialog}).isVisible();
      if (!opened) throw new Error(`${width}x${height}: ${label} did not open ${dialog}`);
      await page.keyboard.press('Escape');
    }
  }
  await page.setViewportSize({width:1920,height:1080});
  await page.goto('http://127.0.0.1:5173/?room=1');
  const files = page.getByRole('button', {name:'Open Mission Files cabinet'}).filter({visible:true});
  await files.hover();
  await page.waitForTimeout(250);
  if (!await files.evaluate(el => el.classList.contains('idr-object-lit'))) throw new Error('Mouse hover did not illuminate the cabinet');
  await page.screenshot({path:`${output}/room-hover-files.png`});
  await files.click();
  if (!await page.getByRole('dialog',{name:'Mission Files'}).isVisible()) throw new Error('Mouse click failed');
  const caseTabs = await page.locator('.idr-case-tabs button').count();
  if (caseTabs !== 5) throw new Error(`Expected five case tabs, got ${caseTabs}`);
  await page.locator('.idr-case-tabs button').nth(2).click();
  await page.getByRole('button',{name:'TRACK THIS CASE'}).click();
  await page.keyboard.press('Escape');
  await page.reload();
  if (!await page.getByText('TRACKING / LUMEN', {exact:false}).isVisible()) throw new Error('Tracked case did not persist');
  await page.locator('.idr-object').filter({visible:true}).first().evaluate(el => { el.style.visibility='hidden'; });
  await page.screenshot({path:`${output}/room-object-hidden.png`});
  const browser = page.context().browser();
  if (!browser) throw new Error('No browser for touch verification');
  const touchContext = await browser.newContext({hasTouch:true, isMobile:true, viewport:{width:390,height:844}});
  const touchPage = await touchContext.newPage();
  await touchPage.goto('http://127.0.0.1:5173/?room=1');
  await touchPage.locator('.idr-layered-original img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  for (const [label, dialog] of labels) {
    const button = touchPage.getByRole('button', {name:label}).filter({visible:true});
    const box = await button.boundingBox();
    if (!box) throw new Error(`Touch object missing: ${label}`);
    await touchPage.touchscreen.tap(box.x + box.width/2, box.y + box.height/2);
    if (!await touchPage.getByRole('dialog',{name:dialog}).isVisible()) throw new Error(`Touch failed: ${label}`);
    await touchPage.keyboard.press('Escape');
  }
  await touchContext.close();
  const nav = ['/', '/?old-room=1', '/?workbench=1', '/?legacy=1'];
  for (const route of nav) { await page.goto('http://127.0.0.1:5173' + route); if (!await page.locator('#root').isVisible()) throw new Error(`Route failed ${route}`); }
  return {results, caseTabs, errors, touchTargets:labels.length, routes:nav};
}
