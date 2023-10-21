import { FC, ForwardRefRenderFunction, forwardRef } from 'react';
import { ButtonProps } from './button.props';
import classNames from 'classnames';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, spinnerColor, children, className, ...props }, forwardedRef) => {
    return (
      <button
        ref={forwardedRef}
        className={classNames(className, 'button')}
        disabled={loading || props.disabled}
        {...props}>
        {loading ? "":""}
      </button>
    );
  },
);

export default Button;
