const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: "new",
  });

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the URL you want to scrape
  const url = 'https://hris.parliament.go.th/ss_th.php'; // Replace with your target URL
  await page.goto(url);

  // Extract data from each <li> within <ul class="list user_list">
  const memberDataList = await page.evaluate(() => {
    const memberList = [];
    const liElements = document.querySelectorAll('.list.user_list > li');

    liElements.forEach(li => {
      const memberID = li.querySelector('.label-info').textContent.trim();
      const imgURL = li.querySelector('.thumbnail img').getAttribute('src');
      const name = li.querySelector('.sl_name h4').textContent.trim();
      const positionInfo = li.querySelector('.sl_email').textContent.trim();

      memberList.push({
        member_id: memberID,
        img_url: imgURL,
        name,
        position_info: positionInfo,
      });
    });

    return {
      member_list: memberList
    }
  });

  
  // Save the extracted data to a JSON file
  const jsonFilePath = 'db.json';

  // Check if the old file exists, and delete it if it does
  if (fs.existsSync(jsonFilePath)) {
    fs.unlinkSync(jsonFilePath);
    console.log('Old file deleted:', jsonFilePath);
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(memberDataList, null, 2));

  // Log a message indicating successful data extraction and save to JSON
  console.log('All User Data:', memberDataList);
  console.log(`Data saved to ${jsonFilePath}`);

  // Close the browser
  await browser.close();
})();
