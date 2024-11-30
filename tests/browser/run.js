import path from 'path'
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`file://${path.resolve('./build/js/index.html')}`)

page.on('console', async (msg) => {
    const text = msg.text()
    console.log(text) // eslint-disable-line no-console

    if (text.startsWith('# fail')) {
        await browser.close()
        process.exit(+text.replace('# fail', ''))
    }

    if (text === '# ok') {
        await browser.close()
        process.exit(0)
    }
})
