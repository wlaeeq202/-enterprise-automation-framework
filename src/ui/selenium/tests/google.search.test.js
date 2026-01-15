const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function runGoogleSearchTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Go to Google
    await driver.get('https://www.google.com');

    // 2. Best-effort: accept cookies / consent if present
    try {
      const consentButtons = await driver.findElements(
        By.xpath("//button[contains(., 'Accept all') or contains(., 'I agree') or contains(., 'Accept')]")
      );
      if (consentButtons.length > 0) {
        await consentButtons[0].click();
      }
    } catch (e) {
      // Ignore if not found
    }

    // 3. Find the search box and search
    const searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Playwright vs Selenium', Key.RETURN);

    // 4. Wait until the results page loads (URL contains 'search')
    await driver.wait(until.urlContains('search'), 15000);

    // 5. Option A: Check that the page title contains our query
    const title = await driver.getTitle();
    const titleHasQuery = title.toLowerCase().includes('playwright') || title.toLowerCase().includes('selenium');

    // 6. Option B: Try to find at least one result heading (best-effort)
    let hasResultHeading = false;
    try {
      const results = await driver.findElements(By.css('h3'));
      hasResultHeading = results.length > 0;
    } catch (err) {
      // If Google layout changed, we still rely on the title check
    }

    // 7. Final assertion: either title looks correct OR we saw headings
    assert.ok(
      titleHasQuery || hasResultHeading,
      'Expected Google results page to show relevant content'
    );

    console.log('✅ Selenium test passed: Google search returned results.');
  } catch (error) {
    console.error('❌ Selenium test failed:', error);
    process.exitCode = 1;
  } finally {
    await driver.quit();
  }
}

runGoogleSearchTest();
