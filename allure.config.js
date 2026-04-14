import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Multi-Cinema Test Automation Report',
  output: '.allure/report',
  plugins: {
    awesome: {
      options: {
        reportName: 'Cinesa & UCI Cinema Automation',
        theme: 'dark',
        reportLanguage: 'en',
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
