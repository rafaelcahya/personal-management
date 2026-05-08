import * as dotenv from 'dotenv'
import { defineConfig } from 'cypress'
import { createClient } from '@supabase/supabase-js'
import { registerTasks } from './cypress/plugin/tasks/index.js'
import mochawesomePlugin from 'cypress-mochawesome-reporter/plugin'
import grepPlugin from '@cypress/grep/src/plugin'

dotenv.config({ path: '.env.local' })

if (process.env.NODE_ENV !== 'production') {
  console.log('\n=== Cypress Environment Check ===')
  console.log('CYPRESS_AUTH_SECRET:', process.env.CYPRESS_AUTH_SECRET ? '✓ Loaded' : '✗ Missing')
  console.log('CYPRESS_TEST_EMAIL:', process.env.CYPRESS_TEST_EMAIL ? '✓ Loaded' : '✗ Missing')
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Loaded' : '✗ Missing')
  console.log('=================================\n')
}

export default defineConfig({
  projectId: process.env.CYPRESS_PROJECT_ID,

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/reports/html',
  },

  e2e: {
    baseUrl: 'http://localhost:3000',

    setupNodeEvents(on, config) {
      mochawesomePlugin(on)
      grepPlugin(config)

      config.env = {
        ...config.env,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_PROJECT_REF: process.env.SUPABASE_URL
          ? new URL(process.env.SUPABASE_URL).hostname.split('.')[0]
          : '',
        TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
        TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
        CYPRESS_AUTH_SECRET: process.env.CYPRESS_AUTH_SECRET,
        grepFilterSpecs: true,
        grepOmitFiltered: true,
      }

      const supabaseAdmin = createClient(
        process.env.SUPABASE_URL || config.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || config.env.SUPABASE_SERVICE_ROLE_KEY || '',
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      registerTasks(on, supabaseAdmin)

      return config
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
