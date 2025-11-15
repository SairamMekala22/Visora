import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mode = process.env.NODE_ENV ?? 'development';

const config = {
  mode,
  devtool: false, // Disable source maps completely
  entry: {
    background: './extension/src/background.js',
    content: './extension/src/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: false, // Keep console logs
          },
          format: {
            comments: false, // Remove all comments including source map URLs
          },
        },
        extractComments: false, // Don't extract comments to separate file
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'extension/assets'),
          to: './assets'
        },
        {
          from: path.resolve(__dirname, 'extension/manifest.json'),
          to: './manifest.json'
        },
        {
          from: path.resolve(__dirname, 'popup'),
          to: './popup',
          globOptions: {
            ignore: ['**/src/**', '**/node_modules/**', '**/postcss.config.js', '**/tailwind.config.cjs', '**/vite.config.js']
          }
        }
      ]
    })
  ]
};

export default config;
