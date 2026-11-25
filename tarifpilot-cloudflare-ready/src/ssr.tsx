import { renderToString } from 'react-dom/server';
import App from './App';

export { articles, categories, pageMetadata } from './content';
export function renderPage() {
  return renderToString(<App />);
}