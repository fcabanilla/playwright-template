import { defineConfig } from 'allure';

export default defineConfig({
  name: 'UCI Phase 1 Automation Report',
  output: '.allure/report',
  historyPath: '.allure/history.jsonl',
  plugins: {
    awesome: {
      options: {
        reportName: 'UCI Cinema Automation - Phase 1',
        theme: 'dark',
        reportLanguage: 'es',
        logo: null,
        singleFile: false,
        ci: {
          type: 'github',
          url: 'https://github.com/fcabanilla/playwright-template',
          name: 'UCI Phase 1 Automation',
        },
        groupBy: 'titlepath',
      },
    },
  },
});
