import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'base',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return styles['button--secondary'];
      case 'outline':
        return styles['button--outline'];
      case 'ghost':
        return styles['button--ghost'];
      case 'destructive':
        return styles['button--destructive'];
      default:
        return styles['button--primary'];
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles['button--sm'];
      case 'lg':
        return styles['button--lg'];
      case 'xl':
        return styles['button--xl'];
      default:
        return '';
    }
  };

  const getLoadingClass = () => {
    return loading ? styles['button--loading'] : '';
  };

  const buttonClasses = [
    styles.button,
    getVariantClass(),
    getSizeClass(),
    getLoadingClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
