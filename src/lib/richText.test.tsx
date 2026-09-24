import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderInline, stripInline } from './richText';

describe('renderInline', () => {
  it('convierte los backticks en <code>', () => {
    render(<p>{renderInline('una interfaz `DataAdapter`: hoy Sheets')}</p>);
    expect(screen.getByText('DataAdapter').tagName).toBe('CODE');
  });

  it('convierte los asteriscos en <em>', () => {
    render(<p>{renderInline('funciona un *lunes a la mañana*.')}</p>);
    expect(screen.getByText('lunes a la mañana').tagName).toBe('EM');
  });

  it('deja los guiones bajos en paz', () => {
    // El copy está lleno de `tool_use`, `agent_runner` y `wa_id`: si el guion
    // bajo fuera un marcador, se comería el texto del medio.
    const { container } = render(<p>{renderInline('rule · tool_use · result')}</p>);
    expect(container.querySelector('em')).toBeNull();
    expect(container.textContent).toBe('rule · tool_use · result');
  });

  it('no toca un asterisco suelto', () => {
    const { container } = render(<p>{renderInline('2 * 3 = 6')}</p>);
    expect(container.querySelector('em')).toBeNull();
    expect(container.textContent).toBe('2 * 3 = 6');
  });

  it('conserva el texto completo', () => {
    const source = 'antes `código` medio *acento* después';
    const { container } = render(<p>{renderInline(source)}</p>);
    expect(container.textContent).toBe('antes código medio acento después');
  });
});

describe('stripInline', () => {
  it('devuelve el texto sin marcadores, para aria-label y metadatos', () => {
    expect(stripInline('una interfaz `DataAdapter` y un *acento*')).toBe(
      'una interfaz DataAdapter y un acento',
    );
  });
});
