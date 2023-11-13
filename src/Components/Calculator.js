import { useContext, useState } from 'react';

import { Box, Typography, Stack, Button, Fab } from '@mui/material';

import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';

import ThemeContext from '../contexts/ThemeContext';
import useMediaQuery from '../Hooks/useMediaQuery';

const MAX_LENGTH = 12;

export default function Calculator() {
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [isOperated, setOperated] = useState(false);
  const [operationType, setOperation] = useState('');
  const [thirdValue, setThirdValue] = useState('');
  const [initialOperation, setInitOperation] = useState('');

  const { theme } = useContext(ThemeContext);
  const isNormalHeight = useMediaQuery("(min-height: 650px)");
  const isPC = useMediaQuery("(min-width: 950px)");
  const isLargeLightCalculator = useMediaQuery("(min-width: 400px)");

  const isDark = theme === 'dark';

  const displayValueStyles = isDark
    ? {
      color: '#fff',
      fontSize: 40,
      mb: 0,
      mr: 2,
      ml: 2,
      pt: 10
    }
    : {
      color: '#000',
      fontSize: 40,
      fontWeight: 'medium',
      mb: 0,
      mr: 2,
      ml: 2,
      pt: 18.4
    }

  function PutFirstValue() {
    let displayedValue = firstValue === '' ? '0' : firstValue;

    if (firstValue === '-') {
      displayedValue = '-0';
    }

    return (
      <Typography
        align='right'
        sx={displayValueStyles}
      >
        {displayedValue}
      </Typography>
    );
  }

  function PutSecondValue() {
    let displayedValue = secondValue === '-' ? '-0' : secondValue;

    return (
      <Typography
        align='right'
        sx={displayValueStyles}
      >
        {displayedValue}
      </Typography>
    );
  }

  const handleReset = () => {
    setFirstValue('');
    setSecondValue('');
    setOperated(false);
    setOperation('');
    setInitOperation('');
    setThirdValue('');
  }

  const handleDeletion = () => {
    if (!isOperated) {
      if (!('NaN' === firstValue)) {
        setFirstValue((prevValue) => prevValue.slice(0, -1));
      }
    } else {
      if (secondValue.length > 1) {
        setSecondValue((prevValue) => prevValue.slice(0, -1));
      } else {
        setSecondValue('0');
      }
    }
  }

  const handlePercentage = () => {
    // Function to process the value and extract relevant information
    const getProcessedValue = (value) => {
      if ('NaN' === value) return null;

      if (value.endsWith('.')) {
        return Number(value.slice(0, -1));
      }

      const numericValue = value === '' || value === '-' ? 0 : Number(value);
      const hasDecimals = value.includes('.');
      const decimals = hasDecimals ? value.length - value.indexOf('.') : 0;

      return {
        value: numericValue,
        hasDecimals,
        decimals,
      }
    }

    // Function to apply percentage calculation with proper decimals
    const applyDecimals = (value, decimals) => {
      const factor = 10 ** (decimals - 1);
      return String(Math.round(value * factor) / (100 * factor));
    }

    // Function to handle overflow conditions and adjust the value
    const handleOverflow = (value) => {
      if (value.includes('e')) {
        return 'NaN'; // Large values represented with 'e' are treated as NaN
      }

      if (value.length > MAX_LENGTH) {
        if (value.includes('.')) {
          return value.indexOf('.') === MAX_LENGTH - 1
            ? String(Math.round(Number(value)))
            : value.substring(0, MAX_LENGTH);
        } else {
          return 'NaN'; // Overflow for integer values is treated as NaN
        }
      } else if (value === '0') {
        return ''; // Zero is converted to an empty string
      }

      return value; // Return the original value if no overflow conditions are met
    }

    // Determine which value to process based on the operation state
    const { value: previousValue, hasDecimals, decimals } = isOperated && secondValue !== ''
      ? getProcessedValue(secondValue)
      : getProcessedValue(firstValue);

    if (previousValue === null) return; // Skip further processing if the value is not a number

    // Apply percentage calculation
    let newValue = hasDecimals
      ? applyDecimals(previousValue, decimals)
      : String(previousValue / 100);

    // Handle overflow conditions
    newValue = handleOverflow(newValue);

    // Update the state based on the operation state
    if (!isOperated) {
      setFirstValue(newValue);
    } else {
      setSecondValue(newValue);
    }
  }

  //function to handle triggering containing a number button
  const handleNumberClick = (newValue) => {
    // Check if the firstValue is NaN and not operated, reset firstValue
    if (('NaN' === firstValue) && !isOperated) {
      setFirstValue(newValue);
      return;
    }

    // Determine the target value based on isOperated and current values
    const targetValue = isOperated ? secondValue : firstValue;

    //check if the value doesn't exceed the max_length
    if (targetValue.length < MAX_LENGTH) {
      if (targetValue !== '0') {
        isOperated ? setSecondValue((prevValue) => prevValue + newValue) : setFirstValue((prevValue) => prevValue + newValue);
      } else {
        isOperated ? setSecondValue(newValue) : setFirstValue(newValue);
      }
    }
  }


  //function to handle triggering zero button
  const handleClickForZeros = () => {
    if (('NaN' === firstValue) && !isOperated) {
      setFirstValue('');
      return;
    }

    //if operation is triggered change the first value, otherwise the second one
    if (!isOperated) {
      if (firstValue === '-') {
        setFirstValue('');
      } else if (firstValue !== '' && firstValue.length < MAX_LENGTH) {
        setFirstValue(prevValue => (prevValue + '0'));
      }
    } else {
      if (secondValue === '-') {
        setSecondValue('0');
      } else if (secondValue !== '0' && secondValue.length < MAX_LENGTH) {
        setSecondValue(prevValue => (prevValue + '0'));
      }
    }
  }

  //Function to handle decimal point triggering
  const handleClickForDots = () => {
    //if the operation is triggered, then change first value. Otherwise change the second one.

    const targetValue = isOperated ? secondValue : firstValue;

    if (targetValue.includes('.')) return;

    if (['', 'NaN'].includes(targetValue)) {
      isOperated ? setSecondValue('0.') : setFirstValue('0.');
    } else if (targetValue.length < MAX_LENGTH) {
      isOperated ? setSecondValue(prevValue => (prevValue + '.')) : setFirstValue(prevValue => (prevValue + '.'));
    }
  }

  //function to handle three-values operation (e.g. 2 + 3 * 5);
  const executeWithThreeValues = () => {
    setThirdValue(firstValue);
    setFirstValue(secondValue);
    setSecondValue('');
    setInitOperation(operationType);
  }

  //function to handle triggering one of the four basic maths operations
  const handleOperation = (value) => {
    if (isOperated && secondValue !== '') {
      // Check if the current operation is addition or subtraction,
      // or if the previous operation was multiplication or division.
      if (value === '+' || value === '-' || (operationType === '*' || operationType === '/')) {
        executeOperation(); // If true, automatically execute the operation.
      } else {
        executeWithThreeValues(); // Otherwise, allow the initiation of a three-values operation.
      }
    }
    setOperated(true);
    setOperation(value);
  }

  //function to handle plus/minus button
  const handlePlusMinus = () => {
    if (('NaN' === firstValue) && !isOperated) {
      setFirstValue('-');
      return;
    }

    //if operation sign wasn't triggered, change the first value. Otherwise the second one
    if (!isOperated) {
      if (firstValue[0] === '-') {
        setFirstValue(prevValue => (prevValue.substring(1, prevValue.length)));
      } else {
        setFirstValue(prevValue => ('-' + prevValue));
      }
    } else {
      if (secondValue[0] === '-') {
        setSecondValue(prevValue => (prevValue.substring(1, prevValue.length)));
      } else if (secondValue === '0') {
        setSecondValue('-');
      } else {
        setSecondValue(prevValue => ('-' + prevValue));
      }
    }
  }

  //find decimals in value; if the value contains decimals it returns the actual amount of decimals + 1;
  const findDecimals = (value) => {
    if (!value.includes('.')) return 0;
    return value.length - value.indexOf('.');
  }

  const initialFormattingToNumeric = (value) => {
    let numericValue;
    if (value.endsWith('.')) {
      numericValue = Number(value.slice(0, -1));
    } else if (value === '-') {
      numericValue = 0;
    } else {
      numericValue = Number(value);
    }
    return numericValue;
  }

  //handle sum edge cases
  const handleSumEdgeCases = (value) => {
    value = String(value);
    if (value.includes('e') || value === 'Infinity' || value === '-Infinity') {
      value = 'NaN';
    } else if (value.length > MAX_LENGTH) {
      if (value.includes('.')) {
        if (value.indexOf('.') === MAX_LENGTH - 1) {
          value = String(Math.round(Number(value)));
        } else {
          value = value.substring(0, MAX_LENGTH);
        }
      } else {
        value = 'NaN';
      }
    } else if (value === '0') {
      value = '';
    }
    return value;
  }

  const executeOperation = () => {
    if (operationType === '') {
      return;
    }

    let firstNumber;
    let secondNumber;
    let sum = 0;
    let firstDecimals = 0;
    let secondDecimals = 0;
    let maxDecimals = 0;

    if (firstValue === '') {
      firstNumber = 0;
    } else {
      firstNumber = initialFormattingToNumeric(firstValue);
      firstDecimals = findDecimals(String(firstNumber));
    }

    if (secondValue === '') {
      secondNumber = firstNumber;
    } else {
      secondNumber = initialFormattingToNumeric(secondValue);
      secondDecimals = findDecimals(String(secondNumber));
    }

    maxDecimals = Math.max(firstDecimals, secondDecimals);

    let factor = 1;

    //if decimals are in the values let's first make them integers for the accuracy of the calculations
    if (maxDecimals > 0) {
      factor = 10 ** (maxDecimals - 1);
      firstNumber = Math.round(firstNumber * factor);
      secondNumber = Math.round(secondNumber * factor);
    }

    if (operationType === '/') {
      sum = firstNumber / secondNumber;
    } else if (operationType === '*') {
      sum = (firstNumber * secondNumber) / (factor ** 2);
    } else if (operationType === '+') {
      sum = (firstNumber + secondNumber) / factor;
    } else if (operationType === '-') {
      sum = (firstNumber - secondNumber) / factor;
    }

    sum = handleSumEdgeCases(sum);

    //check if there should be executed operation with three values
    if (initialOperation !== '' && sum !== 'NaN') {
      if (sum === '') {
        sum = '0';
      }
      sum = executionThree(sum);
      setInitOperation('');
      setThirdValue('');
    }

    setOperated(false);
    setOperation('');
    setFirstValue(sum);
    setSecondValue('');
  }

  const executionThree = (currentSum) => {
    let firstNumber;
    let secondNumber;
    let sum = 0;
    let firstDecimals = 0;
    let secondDecimals = 0;
    let maxDecimals = 0;

    if (thirdValue === '') {
      firstNumber = 0;
    } else {
      firstNumber = initialFormattingToNumeric(thirdValue);
      firstDecimals = findDecimals(String(firstNumber));
    }

    if (currentSum === '') {
      secondNumber = 0;
    } else {
      secondNumber = initialFormattingToNumeric(currentSum);
      secondDecimals = findDecimals(String(secondNumber));
    }

    maxDecimals = Math.max(firstDecimals, secondDecimals);

    let factor = 1;

    if (maxDecimals > 0) {
      factor = 10 ** (maxDecimals - 1);
      firstNumber = Math.round(firstNumber * factor);
      secondNumber = Math.round(secondNumber * factor);
    }

    sum = initialOperation === '-' ? firstNumber - secondNumber : firstNumber + secondNumber;

    if (maxDecimals > 0) sum /= factor;

    sum = handleSumEdgeCases(sum);

    return sum;
  }

  //check if the button content is an integer between 1 and 9
  const isContentAnIntegerInRange = (value) => {
    const intValue = parseInt(value, 10);

    return Number.isInteger(intValue) && intValue >= 1 && intValue <= 9;
  }

  //the function to render calculator buttons in the dark mode
  function RenderFab({ content, onClick }) {
    let fabStyle = {};
    let typographyStyle = { fontSize: 35 };

    //conditional styling for different buttons based on its content
    if (/^([0-9]|,|\+\/-)$/.test(content)) {
      fabStyle = {
        bgcolor: '#424242',
        color: '#fff'
      }
    } else if (['×', '÷', '−', '+', '='].includes(content)) {
      fabStyle = {
        bgcolor: '#ffa726',
        color: '#fff'
      }
    }

    if (/^([0-9]|\+\/-)$/.test(content)) {
      typographyStyle = { fontSize: 30 };
    } else if (content === 'AC') {
      typographyStyle = {
        fontWeight: 'bold',
        fontSize: 20
      }
    }

    return (
      <Fab sx={fabStyle} onClick={onClick}>
        {typeof content === 'string'
          && <Typography sx={typographyStyle}>
            {content}
          </Typography>
        }
        {typeof content !== 'string' && content}
      </Fab>
    );
  }

  //displaying row containing the numbers buttons (for dark theme)
  function ButtonsForNumbersRow({ startFrom }) {
    let operationContent = '×';
    let operation = '*';

    if (startFrom === 4) {
      operationContent = '−';
      operation = '-'
    } else if (startFrom === 1) {
      operationContent = '+';
      operation = '+';
    }

    return (
      <Stack direction="row" spacing={2}>
        {[String(startFrom), String(startFrom + 1), String(startFrom + 2)].map((value, index) => (
          <RenderFab key={index} content={value} onClick={() => handleNumberClick(value)} />
        ))}
        <RenderFab key={startFrom} content={operationContent} onClick={() => handleOperation(operation)} />
      </Stack>
    )
  }

  //function to render buttons in light calculator
  const renderButton = (content, onClick, bgcolor, fontSize, fontWeight) => (
    <Button
      sx={{
        bgcolor: isContentAnIntegerInRange(content) ? '#fff' : bgcolor,
        color: '#000',
        borderRadius: 0,
        width: '24.5%',
        height: 46,
        fontWeight: isContentAnIntegerInRange(content) ? 'bold' : fontWeight,
        fontSize: isContentAnIntegerInRange(content) ? 20 : fontSize,
      }}
      variant="contained"
      onClick={isContentAnIntegerInRange(content) ? () => handleNumberClick(content) : onClick}
    >
      {content}
    </Button >
  );

  const darkCalculatorWidth = 305;
  const darkCalculatorHeight = 500;
  const lightCalculatorWidth = isLargeLightCalculator ? 355 : 275;
  const lightCalculatorHeight = 450;

  const calculatorWidth = isDark ? darkCalculatorWidth : lightCalculatorWidth;
  const calculatorHeight = isNormalHeight
    ? isDark ? darkCalculatorHeight : lightCalculatorHeight
    : isDark ? darkCalculatorHeight - 50 : lightCalculatorHeight - 50;

  //calculator box style depends on theme
  const boxStyle = isDark
    ? {
      bgcolor: '#000',
      borderRadius: 3,
      height: darkCalculatorHeight,
      width: darkCalculatorWidth,
      margin: 'auto',
      mb: 10,
      boxShadow: 3
    }
    : {
      bgcolor: '#f2f2f2',
      opacity: isPC ? '85%' : '95%',
      border: 1,
      height: lightCalculatorHeight,
      width: lightCalculatorWidth,
      margin: 'auto',
      boxShadow: 3,
      mb: 10
    }

  //displaying all calculator buttons depending on theme
  function ButtonsOfCalculator() {
    if (isDark) {
      return (
        <Stack direction="column" spacing={2} sx={{ mx: 2 }}>
          <Stack direction="row" spacing={2}>
            <RenderFab content='AC' onClick={() => handleReset()} />
            <RenderFab content={<BackspaceOutlinedIcon />} onClick={() => handleDeletion()} />
            <RenderFab content={<PercentOutlinedIcon />} onClick={() => handlePercentage()} />
            <RenderFab content='÷' onClick={() => handleOperation('/')} />
          </Stack>
          {[7, 4, 1].map((startFrom, index) => (
            <ButtonsForNumbersRow startFrom={startFrom} key={index} />
          ))}
          <Stack direction="row" spacing={2}>
            <RenderFab content='+/-' onClick={() => handlePlusMinus()} />
            <RenderFab content='0' onClick={() => handleClickForZeros()} />
            <RenderFab content=',' onClick={() => handleClickForDots()} />
            <RenderFab content='=' onClick={() => executeOperation()} />
          </Stack>
        </Stack>
      );
    } else {
      return (
        <Stack direction="column" spacing={0.3} sx={{ mx: 0.3 }}>
          <Stack direction="row" spacing={0.3}>
            {renderButton(<PercentOutlinedIcon fontSize='small' />, () => handlePercentage(), '#eeeeee', 20, 'light')}
            {renderButton('C', () => handleReset(), '#eeeeee', 20, 'light')}
            {renderButton(<BackspaceOutlinedIcon fontSize='small' />, () => handleDeletion(), '#eeeeee')}
            {renderButton('÷', () => handleOperation('/'), '#eeeeee', 30, 'light')}
          </Stack>
          <Stack direction="row" spacing={0.3}>
            {renderButton('7')}
            {renderButton('8')}
            {renderButton('9')}
            {renderButton('×', () => handleOperation('*'), '#eeeeee', 30, 'light')}
          </Stack>
          <Stack direction="row" spacing={0.3}>
            {renderButton('4')}
            {renderButton('5')}
            {renderButton('6')}
            {renderButton('−', () => handleOperation('-'), '#eeeeee', 30, 'light')}
          </Stack>
          <Stack direction="row" spacing={0.3}>
            {renderButton('1')}
            {renderButton('2')}
            {renderButton('3')}
            {renderButton('+', () => handleOperation('+'), '#eeeeee', 30, 'light')}
          </Stack>
          <Stack direction="row" spacing={0.3}>
            {renderButton('+/-', () => handlePlusMinus(), '#fff', 20, 'bold')}
            {renderButton('0', () => handleClickForZeros(), '#fff', 20, 'bold')}
            {renderButton(',', () => handleClickForDots(), '#fff', 25, 'bold')}
            {renderButton('=', () => executeOperation(), '#7bafdc', 30, 'light')}
          </Stack>
        </Stack>
      );
    }
  }

  return (
    <Box
      sx={{
        ...boxStyle,
        position: 'fixed',
        zIndex: 0,
        top: `calc(50vh - ${calculatorHeight / 2}px)`,
        left: `calc(50vw - ${calculatorWidth / 2}px)`
      }}
    >
      {secondValue === '' && <PutFirstValue />}
      {secondValue !== '' && <PutSecondValue />}
      <ButtonsOfCalculator />
    </Box>
  );
}