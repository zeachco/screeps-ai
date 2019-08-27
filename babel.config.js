module.exports = {
   presets: ['@babel/typescript', ['@babel/env', { modules: false }]],
   plugins: [
      '@babel/plugin-proposal-class-properties',
      [
         '@babel/plugin-proposal-decorators',
         {
            decoratorsBeforeExport: true,
         },
      ],
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-json-strings',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
   ],
};
