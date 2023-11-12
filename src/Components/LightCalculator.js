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
    // Check if firstValue is 'NaN' and not isOperated, if true, reset firstValue
    if (isNaN(firstValue) && !isOperated) {
      setFirstValue(newValue);
      return;
    }

    // Determine the target value and set it based on conditions
    let targetValue;
    if (!isOperated) {
      // If not operated, determine the target value based on firstValue and newValue
      targetValue = firstValue !== '0' ? firstValue + newValue : newValue;
      setFirstValue(targetValue);
    } else {
      // If operated, determine the target value based on secondValue and newValue
      targetValue = secondValue !== '0' ? secondValue + newValue : newValue;
      setSecondValue(targetValue);
    }
  }

  const handleClickForZeros = () => {
    if (firstValue !== 'NaN' || (firstValue === 'NaN' && isOperated)) {
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
    } else {
      setFirstValue('');
    };
  };

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
    };
  };

  const executeWithThreeValues = () => {
    setThirdValue(firstValue);
    setFirstValue(secondValue);
    setSecondValue('');
    setInitOperation(operationType);
  };

  const handleOperation = (value) => {
    if (isOperated && secondValue !== '') {
      if (value === '+' || value === '-') {
        executeOperation();
      } else {
        if (operationType === '*' || operationType === '/') {
          executeOperation();
        } else {
          executeWithThreeValues();
        }
      }
    };
    setOperated(true);
    setOperation(value);
  };

  const handlePlusMinus = () => {
    if (firstValue !== 'NaN' | (firstValue === 'NaN' && isOperated)) {
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
    } else {
      setFirstValue('-');
    }
  };

  const executeOperation = () => {
    if (operationType !== '') {
      let x;
      let y;
      let sum = 0;
      let flagDecimals = false;
      let xDecimals = 0;
      let yDecimals = 0;

      if (firstValue[firstValue.length - 1] === '.') {
        x = Number(firstValue.slice(0, -1));
      } else if (firstValue === '' || firstValue === '-') {
        x = 0;
      } else {
        if (firstValue.includes('.')) {
          flagDecimals = true;
          xDecimals = firstValue.length - firstValue.indexOf('.');
        }
        x = Number(firstValue);
      };

      if (secondValue === '') {
        y = x;
      } else {
        if (secondValue[secondValue.length - 1] === '.') {
          y = Number(secondValue.slice(0, -1));
        } else if (secondValue === '-') {
          y = 0;
        } else {
          if (secondValue.includes('.')) {
            flagDecimals = true;
            yDecimals = secondValue.length - secondValue.indexOf('.');
          }
          y = Number(secondValue);
        };
      }

      if (operationType === '/') {
        if (flagDecimals) {
          if (xDecimals > yDecimals) {
            x = Math.round(x * (10 ** (xDecimals - 1)));
            y = Math.round(y * (10 ** (xDecimals - 1)));
            sum = (x / y);
          } else {
            x = Math.round(x * (10 ** (yDecimals - 1)));
            y = Math.round(y * (10 ** (yDecimals - 1)));
            sum = (x / y);
          }
        } else {
          sum = x / y;
        }
      } else if (operationType === '*') {
        if (flagDecimals) {
          if (xDecimals > yDecimals) {
            x = Math.round(x * (10 ** (xDecimals - 1)));
            y = Math.round(y * (10 ** (xDecimals - 1)));
            sum = (x * y) / (10 ** (2 * (xDecimals - 1)));
          } else {
            x = Math.round(x * (10 ** (yDecimals - 1)));
            y = Math.round(y * (10 ** (yDecimals - 1)));
            sum = (x * y) / (10 ** (2 * (yDecimals - 1)));
          }
        } else {
          sum = x * y;
        }
      } else if (operationType === '-') {
        if (flagDecimals) {
          if (xDecimals > yDecimals) {
            x = Math.round(x * (10 ** (xDecimals - 1)));
            y = Math.round(y * (10 ** (xDecimals - 1)));
            sum = (x - y) / (10 ** (xDecimals - 1));
          } else {
            x = Math.round(x * (10 ** (yDecimals - 1)));
            y = Math.round(y * (10 ** (yDecimals - 1)));
            sum = (x - y) / (10 ** (yDecimals - 1));
          }
        } else {
          sum = x - y;
        }
      } else if (operationType === '+') {
        if (flagDecimals) {
          if (xDecimals > yDecimals) {
            x = Math.round(x * (10 ** (xDecimals - 1)));
            y = Math.round(y * (10 ** (xDecimals - 1)));
            sum = (x + y) / (10 ** (xDecimals - 1));
          } else {
            x = Math.round(x * (10 ** (yDecimals - 1)));
            y = Math.round(y * (10 ** (yDecimals - 1)));
            sum = (x + y) / (10 ** (yDecimals - 1));
          }
        } else {
          sum = x + y;
        }
      };

      sum = String(sum);

      if (sum.includes('e')) {
        sum = 'NaN';
      } else {
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
        } else if (sum === 'Infinity' || sum === '-Infinity') {
          sum = 'NaN';
        } else if (sum === '0') {
          sum = '';
        }
      };

      if (initialOperation !== '' && sum !== 'NaN') {
        if (sum === '') {
          sum = '0';
        };
        sum = executionThree(sum);
        setInitOperation('');
        setThirdValue('');
      };

      setOperated(false);
      setOperation('');
      setFirstValue(sum);
      setSecondValue('');
    };
  };

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