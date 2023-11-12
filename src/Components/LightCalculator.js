import { useState } from 'react';

import { Box, Typography, Stack, Button } from '@mui/material';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';

const MAX_LENGTH = 12;

export default function LightCalculator() {
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [isOperated, setOperated] = useState(false);
  const [operationType, setOperation] = useState('');
  const [thirdValue, setThirdValue] = useState('');
  const [initialOperation, setInitOperation] = useState('');

  const displayValueStyles = {
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
  };

  const handleDeletion = () => {
    if (!isOperated) {
      if (!isNaN(firstValue)) {
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
      if (isNaN(value)) return null;

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

  const handleNumberClick = (newValue) => {
    // Check if the firstValue is NaN and not operated, reset firstValue
    if (isNaN(firstValue) && !isOperated) {
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

  const handleClickForZeros = () => {
    if (isNaN(firstValue) && !isOperated) {
      setFirstValue('');
      return;
    }

    if (!isOperated) {
      if (firstValue !== '' && firstValue.length < MAX_LENGTH && firstValue !== '-') {
        setFirstValue(prevValue => (prevValue + '0'));
      } else if (firstValue === '-') {
        setFirstValue('');
      }
    } else {
      if (secondValue !== '0' && secondValue.length < MAX_LENGTH && secondValue !== '-') {
        setSecondValue(prevValue => (prevValue + '0'));
      } else if (secondValue === '-') {
        setSecondValue('0');
      }
    }
  }

  const handleClickForDots = () => {
    if (!isOperated) {
      if (!firstValue.includes('.')) {
        if (firstValue === '' || firstValue === 'NaN') {
          setFirstValue('0.');
        } else if (firstValue.length < MAX_LENGTH) {
          setFirstValue(prevValue => (prevValue + '.'));
        }
      }
    } else {
      if (!secondValue.includes('.')) {
        if (secondValue === '') {
          setSecondValue('0.');
        } else if (secondValue.length < MAX_LENGTH) {
          setSecondValue(prevValue => (prevValue + '.'));
        }
      }
    }
  }

  const executeWithThreeValues = () => {
    setThirdValue(firstValue);
    setFirstValue(secondValue);
    setSecondValue('');
    setInitOperation(operationType);
  }

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

  const handlePlusMinus = () => {
    if (isNaN(firstValue) && !isOperated) {
      setFirstValue('-');
      return;
    }

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

    sum = String(sum);

    //handle sum edge cases
    if (sum.includes('e') || sum === 'Infinity' || sum === '-Infinity') {
      sum = 'NaN';
    } else if (sum.length > MAX_LENGTH) {
      if (sum.includes('.')) {
        if (sum.indexOf('.') === MAX_LENGTH - 1) {
          sum = String(Math.round(Number(sum)));
        } else {
          sum = sum.substring(0, MAX_LENGTH);
        }
      } else {
        sum = 'NaN';
      }
    } else if (sum === '0') {
      sum = '';
    }

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

  const executionThree = (secVal) => {
    let x;
    let y;
    let sum = 0;
    let flagDecimals = false;
    let xDecimals = 0;
    let yDecimals = 0;

    if (thirdValue[thirdValue.length - 1] === '.') {
      x = Number(thirdValue.slice(0, -1));
    } else if (thirdValue === '' || thirdValue === '-') {
      x = 0;
    } else {
      if (thirdValue.includes('.')) {
        flagDecimals = true;
        xDecimals = thirdValue.length - thirdValue.indexOf('.');
      }
      x = Number(thirdValue);
    };

    if (secVal[secVal.length - 1] === '.') {
      y = Number(secVal.slice(0, -1));
    } else if (secVal === '' || secVal === '-') {
      y = 0;
    } else {
      if (secVal.includes('.')) {
        flagDecimals = true;
        yDecimals = secVal.length - secVal.indexOf('.');
      }
      y = Number(secVal);
    };

    if (initialOperation === '-') {
      if (flagDecimals) {
        if (xDecimals > yDecimals) {
          x = x * (10 ** xDecimals);
          y = y * (10 ** xDecimals);
          sum = (x - y) / (10 ** xDecimals);
        } else {
          x = x * (10 ** yDecimals);
          y = y * (10 ** yDecimals);
          sum = (x - y) / (10 ** yDecimals);
        }
      } else {
        sum = x - y;
      }
    } else if (initialOperation === '+') {
      if (flagDecimals) {
        if (xDecimals > yDecimals) {
          x = x * (10 ** xDecimals);
          y = y * (10 ** xDecimals);
          sum = (x + y) / (10 ** xDecimals);
        } else {
          x = x * (10 ** yDecimals);
          y = y * (10 ** yDecimals);
          sum = (x + y) / (10 ** yDecimals);
        }
      } else {
        sum = x + y;
      }
    };

    sum = String(sum);

    if (sum.length > MAX_LENGTH) {
      if (sum.includes('.')) {
        if (sum.indexOf('.') === MAX_LENGTH - 1) {
          sum = String(Math.round(Number(sum)));
        } else {
          sum = sum.substring(0, MAX_LENGTH);
        }
      } else {
        sum = 'NaN';
      }
    } else if (sum === '0') {
      sum = '';
    };

    return sum;
  }

  //check if the button content is an integer between 1 and 9
  const isContentAnIntegerInRange = (value) => {
    const intValue = parseInt(value, 10);

    return Number.isInteger(intValue) && intValue >= 1 && intValue <= 9;
  }

  //function to render buttons
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

  return (
    <Box
      sx={{
        bgcolor: '#f2f2f2',
        opacity: '85%',
        border: 1,
        height: 450,
        width: 355,
        margin: 'auto',
        boxShadow: 3,
        mb: 10
      }}
    >

      {secondValue === '' && <PutFirstValue />}
      {secondValue !== '' && <PutSecondValue />}
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
    </Box>
  );
}