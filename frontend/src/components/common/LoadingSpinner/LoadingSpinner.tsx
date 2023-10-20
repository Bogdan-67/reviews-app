import { FC } from 'react';
import './spinner.scss';

const LoadingSpinner: FC<Props> = ({ size, color, padding, ...props }) => {
  return (
    <svg
      className='spinner'
      style={{ width: `${size}px`, height: `${size}px`, padding: padding ? padding : '0' }}
      viewBox='0 0 50 50'
      {...props}>
      <circle
        className='path'
        style={{ stroke: color ? color : 'currentColor' }}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'></circle>
    </svg>
  );
};

export default LoadingSpinner;
