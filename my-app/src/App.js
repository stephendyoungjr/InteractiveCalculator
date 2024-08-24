import React, { useState, useReducer, useEffect } from 'react';
import './App.css';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import Dice from './Dice';
import Timer from './Timer';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === '0' && state.currentOperand === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentOperand?.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';

  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
    default:
      return '';
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function adjustFontSize() {
  const outputElement = document.querySelector('.output .current-operand');
  if (!outputElement) return;
  const parentWidth = outputElement.parentElement.clientWidth;
  let fontSize = 3;

  outputElement.style.fontSize = `${fontSize}rem`;

  while (outputElement.scrollWidth > parentWidth && fontSize > 0.5) {
    fontSize -= 0.1;
    outputElement.style.fontSize = `${fontSize}rem`;
  }
}

function App() {
  const [currentView, setCurrentView] = useState('calculator');
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  useEffect(() => {
    adjustFontSize();
  }, [currentOperand, previousOperand, operation]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${process.env.PUBLIC_URL + '/stockdungeon.jpg'})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        position: 'relative',
      }}
    >
      <div className="bag-button">
        <img
          src={`${process.env.PUBLIC_URL}/bag.png`}
          alt="Bag"
          onClick={() =>
            setCurrentView((prevView) =>
              prevView === 'menu' ? 'calculator' : 'menu'
            )
          }
        />
      </div>

      {currentView === 'calculator' && (
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">
              {formatOperand(previousOperand)} {operation}
            </div>
            <div className="current-operand">
              {formatOperand(currentOperand)}
            </div>
          </div>
          <button
            className="span-two"
            onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          >
            AC
          </button>
          <button
            onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
          >
            DEL
          </button>
          <OperationButton operation="÷" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button
            className="span-two"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          >
            =
          </button>
        </div>
      )}

      {currentView === 'timer' && <Timer />}

      {currentView === 'dice' && <Dice />}

      {currentView === 'menu' && (
        <div className="menu">
          <button onClick={() => setCurrentView('calculator')}>
            <img
              src={`${process.env.PUBLIC_URL}/calculator.jpeg`}
              alt="Calculator"
              className="menu-icon"
            />
            Calculator
          </button>
          <button onClick={() => setCurrentView('timer')}>
            <img
              src={`${process.env.PUBLIC_URL}/hourglass.jpeg`}
              alt="Hourglass"
              className="menu-icon"
            />
            Hourglass
          </button>
          <button onClick={() => setCurrentView('dice')}>
            <img
              src={`${process.env.PUBLIC_URL}/dice.png`}
              alt="Dice"
              className="menu-icon"
            />
            Dice
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
