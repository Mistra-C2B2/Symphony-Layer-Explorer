import { test, expect } from '@playwright/test'

test.describe('Symphony Layers Explorer', () => {
  test('should load the homepage and display layers', async ({ page }) => {
    await page.goto('/')
    
    // Check if the header is visible
    await expect(page.locator('header')).toContainText('Symphony Layers Explorer')
    
    // Wait for data to load
    await page.waitForSelector('[data-testid="layer-card"]', { timeout: 10000 })
    
    // Check if layer cards are displayed
    const layerCards = page.locator('[data-testid="layer-card"]')
    await expect(layerCards).toHaveCount.greaterThan(0)
    
    // Check if the first layer card contains expected content
    const firstCard = layerCards.first()
    await expect(firstCard).toBeVisible()
  })

  test('should navigate to layer detail page', async ({ page }) => {
    await page.goto('/')
    
    // Wait for layer cards to load
    await page.waitForSelector('[data-testid="layer-card"]')
    
    // Click on the first layer card
    const firstCard = page.locator('[data-testid="layer-card"]').first()
    const layerName = await firstCard.locator('h3').textContent()
    await firstCard.click()
    
    // Check if we're on the detail page
    await expect(page.locator('nav[data-testid="breadcrumb"]')).toContainText('Layers')
    await expect(page.locator('h1')).toContainText(layerName || '')
    
    // Check if layer details are displayed
    await expect(page.locator('[data-testid="layer-summary"]')).toBeVisible()
    await expect(page.locator('[data-testid="p02-parameters-table"]')).toBeVisible()
  })

  test('should navigate to dataset table from parameter', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to first layer
    await page.waitForSelector('[data-testid="layer-card"]')
    await page.locator('[data-testid="layer-card"]').first().click()
    
    // Wait for P02 parameters table
    await page.waitForSelector('[data-testid="p02-parameters-table"]')
    
    // Click on first parameter row
    const firstParamRow = page.locator('[data-testid="p02-parameters-table"] tbody tr').first()
    const parameterName = await firstParamRow.locator('td').nth(1).textContent()
    await firstParamRow.click()
    
    // Check if we're on the dataset page
    await expect(page.locator('nav[data-testid="breadcrumb"]')).toContainText(parameterName || '')
    await expect(page.locator('h1')).toContainText('Datasets for')
  })

  test('should filter layers by search text', async ({ page }) => {
    await page.goto('/')
    
    // Wait for layer cards to load
    await page.waitForSelector('[data-testid="layer-card"]')
    const initialCount = await page.locator('[data-testid="layer-card"]').count()
    
    // Search for "bird"
    await page.fill('input[placeholder*="Search"]', 'bird')
    
    // Wait for filtering to complete
    await page.waitForTimeout(500)
    
    const filteredCount = await page.locator('[data-testid="layer-card"]').count()
    expect(filteredCount).toBeLessThan(initialCount)
    
    // Check if all visible cards contain "bird" in name or theme
    const visibleCards = page.locator('[data-testid="layer-card"]')
    const cardCount = await visibleCards.count()
    
    for (let i = 0; i < cardCount; i++) {
      const card = visibleCards.nth(i)
      const cardText = await card.textContent()
      expect(cardText?.toLowerCase()).toMatch(/bird/)
    }
  })

  test('should sort layers by availability', async ({ page }) => {
    await page.goto('/')
    
    // Wait for layer cards to load
    await page.waitForSelector('[data-testid="layer-card"]')
    
    // Change sort to availability
    await page.selectOption('select[data-testid="sort-select"]', 'availability')
    
    // Wait for re-sorting
    await page.waitForTimeout(500)
    
    // Get availability indexes from first few cards
    const availabilityIndexes: number[] = []
    const cards = page.locator('[data-testid="layer-card"]')
    const cardCount = Math.min(3, await cards.count())
    
    for (let i = 0; i < cardCount; i++) {
      const availabilityText = await cards.nth(i).locator('text=Data Availability').locator('..').locator('span').textContent()
      const availability = parseInt(availabilityText || '0')
      availabilityIndexes.push(availability)
    }
    
    // Check if sorted in descending order
    for (let i = 1; i < availabilityIndexes.length; i++) {
      expect(availabilityIndexes[i]).toBeLessThanOrEqual(availabilityIndexes[i - 1])
    }
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Intercept fetch requests and return error
    await page.route('**/data/symphony_layers.json', (route) => {
      route.fulfill({ status: 404 })
    })
    
    await page.goto('/')
    
    // Check if error message is displayed
    await expect(page.locator('text=Error loading data')).toBeVisible()
    await expect(page.locator('text=Failed to load application data')).toBeVisible()
  })
})