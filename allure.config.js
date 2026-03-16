import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Multi-Cinema Test Automation Report',
  output: '.allure/report',
  historyPath: '.allure/history.jsonl',
  plugins: {
    awesome: {
      options: {
        reportName: 'Cinesa & UCI Cinema Automation',
        theme: 'dark',
        reportLanguage: 'es',
        logo: null,
        singleFile: false,
        ci: {
          type: 'github',
          url: 'https://github.com/fcabanilla/playwright-template',
          name: 'Multi-Cinema Test Automation',
        },
        groupBy: 'titlepath',
      },
    },
  },
});
