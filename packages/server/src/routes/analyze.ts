import { exec } from 'child_process'
import { Request, Response, Router } from 'express'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)
const router = Router()

interface AnalyzeRequest {
  packageName: string
}

router.post(
  '/analyze-package',
  async (req: Request<unknown, unknown, AnalyzeRequest>, res: Response): Promise<void> => {
    const { packageName } = req.body

    if (!packageName || typeof packageName !== 'string') {
      res.status(400).json({ error: 'Package name is required' })
      return
    }

    // Basic sanitization: allow only alphanumeric, hyphens, underscores, @, and /
    if (!/^[a-zA-Z0-9@/_-]+$/.test(packageName)) {
      res.status(400).json({ error: 'Invalid package name' })
      return
    }

    const tmpDir = path.join(
      os.tmpdir(),
      'fundee-workspaces',
      `workspace-${Date.now()}-${Math.random().toString(36).substring(7)}`
    )

    try {
      // Create workspace
      fs.mkdirSync(tmpDir, { recursive: true })

      // Initialize dummy package.json
      await execAsync('npm init -y', { cwd: tmpDir })

      // Install package (full install to ensure npm fund works)
      await execAsync(`npm install ${packageName}`, { cwd: tmpDir })

      // Run npm fund
      const { stdout } = await execAsync('npm fund --json', { cwd: tmpDir })

      const fundingData = JSON.parse(stdout) as unknown

      res.json(fundingData)
    } catch (error) {
      console.error('Analysis error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ error: 'Failed to analyze package', details: errorMessage })
    } finally {
      // Cleanup
      try {
        if (fs.existsSync(tmpDir)) {
          fs.rmSync(tmpDir, { recursive: true, force: true })
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError)
      }
    }
  }
)

export default router
