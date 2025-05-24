import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuickNumericSelector } from '../QuickNumericSelector'; // Assicurati che il percorso sia corretto

// Mock dei componenti Themed e hooks per isolare il test del componente QuickNumericSelector
jest.mock('@/components/ThemedText', () => {
  const RN = jest.requireActual('react-native');
  return {
    ThemedText: ({ children, style, ...props }: any) => <RN.Text style={style} {...props}>{children}</RN.Text>,
  };
});

jest.mock('@/components/ThemedView', () => {
  const RN = jest.requireActual('react-native');
  return {
    ThemedView: ({ children, style, ...props }: any) => <RN.View style={style} {...props}>{children}</RN.View>,
  };
});

jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((props, colorName) => {
    // Restituisce valori mock per i colori, puoi personalizzarli se necessario
    if (colorName === 'text') return 'black';
    if (colorName === 'tint') return 'blue';
    if (colorName === 'buttonBackground') return 'lightblue';
    if (colorName === 'buttonTextColor') return 'white';
    if (colorName === 'loginCardBackground') return 'lightgrey';
    if (colorName === 'visitStatusRejected') return 'red';
    if (colorName === 'tabIconDefault') return 'grey';
    return 'mockedColor';
  }),
}));

// Mock di Ionicons
jest.mock('@expo/vector-icons', () => {
  const RN = jest.requireActual('react-native');
  return {
    Ionicons: ({ name, size, color }: { name: string; size: number; color: string }) => (
      <RN.Text testID={`icon-${name}`}>Icon-{name}-{size}-{color}</RN.Text>
    ),
  };
});


describe('QuickNumericSelector', () => {
  const mockOnValueChange = jest.fn();
  const defaultProps = {
    label: 'Numero di Camere',
    value: '1',
    onValueChange: mockOnValueChange,
    maxValue: 5,
    minValue: 1,
    unit: 'camere',
  };

  beforeEach(() => {
    // Resetta il mock prima di ogni test
    mockOnValueChange.mockClear();
  });

  it('renders correctly with initial props', () => {
    const { getByText, getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} />);
    expect(getByText('Numero di Camere')).toBeTruthy();
    expect(getByDisplayValue('1')).toBeTruthy(); // TextInput dovrebbe avere il valore iniziale
    expect(getByText('1camere')).toBeTruthy(); // Bottone rapido
  });

  it('calls onValueChange with the correct value when a quick button is pressed', () => {
    const { getByText } = render(<QuickNumericSelector {...defaultProps} value="2" />);
    fireEvent.press(getByText('3camere')); // Simula la pressione del bottone "3"
    expect(mockOnValueChange).toHaveBeenCalledWith('3');
  });

  it('increments value correctly', () => {
    const { getByTestId } = render(<QuickNumericSelector {...defaultProps} value="2" />);
    fireEvent.press(getByTestId('icon-add')); // Simula il click sul pulsante "+"
    expect(mockOnValueChange).toHaveBeenCalledWith('3');
  });

  it('decrements value correctly', () => {
    const { getByTestId } = render(<QuickNumericSelector {...defaultProps} value="2" />);
    fireEvent.press(getByTestId('icon-remove')); // Simula il click sul pulsante "-"
    expect(mockOnValueChange).toHaveBeenCalledWith('1');
  });

  it('does not increment beyond maxValue', () => {
    const { getByTestId } = render(<QuickNumericSelector {...defaultProps} value="5" />);
    fireEvent.press(getByTestId('icon-add'));
    expect(mockOnValueChange).not.toHaveBeenCalled(); // Non dovrebbe cambiare se è già al massimo
  });

  it('does not decrement below minValue', () => {
    const { getByTestId } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    fireEvent.press(getByTestId('icon-remove'));
    expect(mockOnValueChange).not.toHaveBeenCalled(); // Non dovrebbe cambiare se è già al minimo
  });

  // Test per la logica di handleInputChange modificata
  it('handles direct input correctly and removes leading zeros', () => {
    const { getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '03');
    expect(mockOnValueChange).toHaveBeenCalledWith('3');
  });

  it('handles direct input of a single digit correctly', () => {
    const { getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '4');
    expect(mockOnValueChange).toHaveBeenCalledWith('4');
  });
  
  it('handles input of "0" correctly if minValue is 0', () => {
    const { getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} minValue={0} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '0');
    expect(mockOnValueChange).toHaveBeenCalledWith('0');
  });

  it('handles input of multiple leading zeros correctly (e.g., "005" becomes "5")', () => {
    const { getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '005');
    expect(mockOnValueChange).toHaveBeenCalledWith('5');
  });

  it('sets error when input is empty string', () => {
    const { getByDisplayValue, getByText } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '');
    // onValueChange non dovrebbe essere chiamato con stringa vuota se gestito come errore
    // expect(mockOnValueChange).toHaveBeenCalledWith(''); // O il valore che rappresenta "nessun input"
    expect(getByText(`Inserire un valore tra ${defaultProps.minValue} e ${defaultProps.maxValue}${defaultProps.unit}`)).toBeTruthy();
  });

  it('sets error when input is greater than maxValue', () => {
    const { getByDisplayValue, getByText } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '6'); // maxValue è 5
    expect(mockOnValueChange).not.toHaveBeenCalledWith('6'); // Non dovrebbe chiamare con valore non valido
    expect(getByText(`Inserire un valore tra ${defaultProps.minValue} e ${defaultProps.maxValue}${defaultProps.unit}`)).toBeTruthy();
  });

  it('sets error when input is less than minValue (but not empty)', () => {
    // Questo test presuppone che l'input '0' sia sotto minValue (che è 1 di default)
    const { getByDisplayValue, getByText } = render(<QuickNumericSelector {...defaultProps} value="2" minValue={1} />);
    const input = getByDisplayValue('2');
    fireEvent.changeText(input, '0');
    expect(mockOnValueChange).not.toHaveBeenCalledWith('0');
    expect(getByText(`Inserire un valore tra ${defaultProps.minValue} e ${defaultProps.maxValue}${defaultProps.unit}`)).toBeTruthy();
  });

  it('filters out non-numeric characters from input', () => {
    const { getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, 'a4b');
    expect(mockOnValueChange).toHaveBeenCalledWith('4');
  });

  it('handles input that becomes valid after filtering non-numeric characters', () => {
    const { getByDisplayValue } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '2x');
    expect(mockOnValueChange).toHaveBeenCalledWith('2');
  });

  it('handles input that becomes invalid (too large) after filtering', () => {
    const { getByDisplayValue, getByText } = render(<QuickNumericSelector {...defaultProps} value="1" />);
    const input = getByDisplayValue('1');
    fireEvent.changeText(input, '7x'); // maxValue è 5
    expect(mockOnValueChange).not.toHaveBeenCalled();
    expect(getByText(`Inserire un valore tra ${defaultProps.minValue} e ${defaultProps.maxValue}${defaultProps.unit}`)).toBeTruthy();
  });

  it('handles input that becomes invalid (too small) after filtering', () => {
    const { getByDisplayValue, getByText } = render(<QuickNumericSelector {...defaultProps} value="2" minValue={1}/>);
    const input = getByDisplayValue('2');
    fireEvent.changeText(input, '0x'); // minValue è 1
    expect(mockOnValueChange).not.toHaveBeenCalled();
    expect(getByText(`Inserire un valore tra ${defaultProps.minValue} e ${defaultProps.maxValue}${defaultProps.unit}`)).toBeTruthy();
  });

});