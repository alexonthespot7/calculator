import { useState } from 'react';

import { Box, Typography, Stack, Fab } from '@mui/material';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';

export default function DarkCalculator() {
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [isOperated, setOperated] = useState(false);
  const [operationType, setOperation] = useState('');
  const [thirdValue, setThirdValue] = useState('');
  const [initialOperation, setInitOperation] = useState('');

  function PutFirstValue() {
    if (firstValue === '') {
      return (
        <Typography
          align='right'
          sx={{
            color: '#fff',
            fontSize: 40,
            mb: 0,
            mr: 2,
            ml: 2,
            pt: 10         
          }}                
        >
          0    
        </Typography>    
      );  
    } else if (firstValue === '-') {
        return (
            <Typography
              align='right'
              sx={{
                color: '#fff',
                fontSize: 40,
                mb: 0,
                mr: 2,
                ml: 2,
                pt: 10         
            }}                
        >
          -0    
        </Typography>
        );
    } else {
    return (
        <Typography
          align='right'
          sx={{
            color: '#fff',
            fontSize: 40,
            mb: 0,
            mr: 2,
            ml: 2,
            pt: 10         
          }}                
        >
          {firstValue}    
        </Typography>    
      );
    };
    
  };

  function PutSecondValue() {
    if (secondValue === '-') {
        return (
            <Typography
              align='right'
              sx={{
                color: '#fff',
                fontSize: 40,
                mb: 0,
                mr: 2,
                ml: 2,
                pt: 10         
            }}                
        >
          -0    
        </Typography>
        );
    } else return (
      <Typography
        align='right'
        sx={{
          color: '#fff',
          fontSize: 40,
          mb: 0,
          mr: 2,
          ml: 2,
          pt: 10         
        }}                
      >
        {secondValue}    
      </Typography>    
    );
  };

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
      if (firstValue !== 'NaN') {
        setFirstValue(prevValue => (prevValue.slice(0, -1)));
      }
    } else if (secondValue.length > 1) {
      setSecondValue(prevValue => (prevValue.slice(0, -1)));
    } else if (secondValue.length === 1) {
      setSecondValue('0');
    }
  };

  const handlePercentage = () => {
    let newValue;
    let flagDecimals = false;
    let decimals;
    let previousValue;

    if (!isOperated) {
        previousValue = firstValue;
    } else {
        if (isOperated && secondValue === '') {
            previousValue = firstValue
        } else {
            previousValue = secondValue;
        }
    }

    if (previousValue[previousValue.length - 1] === '.') {
        newValue = Number(previousValue.slice(0, -1));
    } else if (previousValue === '' | previousValue === '-') {
        newValue = 0;
    } else {
        if (previousValue.includes('.')) {
            flagDecimals = true;
            decimals = previousValue.length - previousValue.indexOf('.');
        };
        newValue = Number(previousValue);
    };

    if (flagDecimals) {
        newValue = String(Math.round(newValue * 10 ** (decimals - 1)) / (100 * 10 ** (decimals - 1)));
    } else {
        newValue = String(newValue / 100);
    }

    if (newValue.includes('e')) {
        newValue = 'NaN';
    } else {
        if (newValue.length > 12) {
            if (newValue.includes('.')) {
                if (newValue.indexOf('.') === 11) {
                    newValue = String(Math.round(Number(newValue)));
                } else {
                    newValue = newValue.substring(0, 12);
                }
            } else {
                newValue = 'NaN';
            }
        } else if (newValue === '0') {
            newValue = '';
        }
    };
    
    if (!isOperated) {
        setFirstValue(newValue);
    } else if (operationType === '/' | operationType === '*') {
        setSecondValue(newValue);
    }
  }

  const handleButtonClick = (newValue) => {
    if (firstValue !== 'NaN' | (firstValue === 'NaN' && isOperated)) {
        if (!isOperated && firstValue !== '0') {
            if (firstValue.length < 12) {
              setFirstValue(prevValue => (prevValue + newValue));
            }     
        } else if (!isOperated) {
            setFirstValue(newValue);
        } else if (secondValue !== '0') {
            if (secondValue.length < 12) {
              setSecondValue(prevValue => (prevValue + newValue));
            }
        } else {
            setSecondValue(newValue);
        }
    } else {
        setFirstValue(newValue);
    }
  };

  const handleClickForZeros = () => {
      if (firstValue !== 'NaN' | (firstValue === 'NaN' && isOperated)) {
        if (!isOperated) {
            if (firstValue !== '' && firstValue.length < 12 && firstValue !== '-') {
                setFirstValue(prevValue => (prevValue + '0'));
            } else if (firstValue === '-') {
                setFirstValue('');
            }
        } else {
            if (secondValue !== '0' && secondValue.length < 12 && secondValue !== '-') {
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
        if (firstValue === '' | firstValue === 'NaN') {
          setFirstValue('0.');
        } else if (firstValue.length < 12) {
          setFirstValue(prevValue => (prevValue + '.'));
        }
      }
    } else {
      if (!secondValue.includes('.')) {
        if (secondValue === '') {
          setSecondValue('0.');
        } else if (secondValue.length < 12) {
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
        if (value === '+' | value === '-') {
            executeOperation();
        } else {
            if (operationType === '*' | operationType === '/') {
                executeOperation();
            } else {
                executeWithThreeValues(value);
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
              setSecondValue(prevValue => ( '-' + prevValue));
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
        } else if (firstValue === '' | firstValue === '-') {
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
            if (sum.length > 12) {
                if (sum.includes('.')) {
                    if (sum.indexOf('.') === 11) {
                        sum = String(Math.round(Number(sum)));
                    } else {
                        sum = sum.substring(0, 12);
                    }
                } else {
                    sum = 'NaN';
                }
            } else if (sum === 'Infinity' | sum === '-Infinity') {
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
    } else if (thirdValue === '' | thirdValue === '-') {
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
    } else if (secVal === '' | secVal === '-') {
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

    if (sum.length > 12) {
        if (sum.includes('.')) {
            if (sum.indexOf('.') === 11) {
                sum = String(Math.round(Number(sum)));
            } else {
                sum = sum.substring(0, 12);
            }
        } else {
            sum = 'NaN';
        }
    } else if (sum === '0') {
        sum = '';
    };

    return sum;
  }

  return (
    <Box
        sx={{
          bgcolor: '#000',
          borderRadius: 3,
          height: 500,
          width: 305,
          margin: 'auto',
          mb: 10,
          boxShadow: 3
        }}
    >
        
        {secondValue === '' && <PutFirstValue />}
        {secondValue !== '' && <PutSecondValue />}
        <Stack direction="column" spacing={2} sx={{mx: 2}}>
            <Stack direction="row" spacing={2}>
                <Fab onClick={() => handleReset()}>
                    <Typography sx={{fontWeight: 'bold', fontSize: 20}}>AC</Typography>
                </Fab> 
                <Fab onClick={() => handleDeletion()}>
                    <BackspaceOutlinedIcon />
                </Fab>
                <Fab onClick={() => handlePercentage()}>
                    <PercentOutlinedIcon />
                </Fab>
                <Fab sx={{bgcolor: '#ffa726', color: '#fff'}} onClick={() => handleOperation('/')}>
                    <Typography sx={{fontSize: 35}}>÷</Typography>
                </Fab>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('7')}>
                    <Typography sx={{fontSize: 30}}>7</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('8')}>
                    <Typography sx={{fontSize: 30}}>8</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('9')}>
                    <Typography sx={{fontSize: 30}}>9</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#ffa726', color: '#fff'}} onClick={() => handleOperation('*')}>
                    <Typography sx={{fontSize: 35}}>×</Typography>
                </Fab>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('4')}>
                    <Typography sx={{fontSize: 30}}>4</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('5')}>
                    <Typography sx={{fontSize: 30}}>5</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('6')}>
                    <Typography sx={{fontSize: 30}}>6</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#ffa726', color: '#fff'}} onClick={() => handleOperation('-')}>
                    <Typography sx={{fontSize: 35}}>−</Typography>
                </Fab>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('1')}>
                    <Typography sx={{fontSize: 30}}>1</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('2')}>
                    <Typography sx={{fontSize: 30}}>2</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleButtonClick('3')}>
                    <Typography sx={{fontSize: 30}}>3</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#ffa726', color: '#fff'}} onClick={() => handleOperation('+')}>
                    <Typography sx={{fontSize: 35}}>+</Typography>
                </Fab>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handlePlusMinus()}>
                    <Typography sx={{fontSize: 30}}>+/-</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleClickForZeros()}>
                    <Typography sx={{fontSize: 30}}>0</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#424242', color: '#fff'}} onClick={() => handleClickForDots()}>
                    <Typography sx={{fontSize: 35}}>,</Typography>
                </Fab>
                <Fab sx={{bgcolor: '#ffa726', color: '#fff'}} onClick={() => executeOperation()}>
                    <Typography sx={{fontSize: 35}}>=</Typography>
                </Fab>
            </Stack>
        </Stack>
    </Box>
  );
}