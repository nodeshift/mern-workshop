import { render, screen } from '@testing-library/react';
import App from './containers/App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/todos/i);
  expect(linkElement).toBeInTheDocument();
});
