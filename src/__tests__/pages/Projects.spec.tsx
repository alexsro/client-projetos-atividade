import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Projects from '../../pages/Projects';

describe('Projects page', () => {
  const setState = jest.fn();

  it('deve poder criar o projeto', async () => {
    const { getByText, getByTestId } = render(<Projects />);

    const name = getByTestId('name');
    const startDate = getByTestId('start_date');
    const endDate = getByTestId('end_date');
    const buttonElement = getByText('Cadastrar novo projeto!');

    fireEvent.change(name, { target: { value: 'teste123' } });
    fireEvent.change(startDate, { target: { value: new Date() } });
    fireEvent.change(endDate, { target: { value: new Date() } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});
