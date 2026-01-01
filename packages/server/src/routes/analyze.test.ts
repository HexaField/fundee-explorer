import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../index'

interface FundingResponse {
  dependencies: Record<
    string,
    {
      version: string
      funding?: unknown
    }
  >
}

describe('POST /api/analyze-package', () => {
  it('should return funding data for vite', async () => {
    const response = await request(app).post('/api/analyze-package').send({ packageName: 'vite' }).timeout(60000) // Increase timeout for npm install

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()

    // The root should be the dummy project
    // We expect 'vite' to be in the dependencies
    const body = response.body as FundingResponse
    const dependencies = body.dependencies
    expect(dependencies).toBeDefined()
    expect(dependencies['vite']).toBeDefined()

    // Check if vite has funding info or version
    expect(dependencies['vite'].version).toBeDefined()
  }, 60000)
})
