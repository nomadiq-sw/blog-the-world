import { render, screen } from '@testing-library/react';
import App from './App';

test('renders site header', () => {
	render(<App />);
	const titleElement = screen.getByText(/#BTW/i);
	expect(titleElement).toBeInTheDocument();
});
