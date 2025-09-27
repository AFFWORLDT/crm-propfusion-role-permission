import React from 'react';
import styles from './Input.module.css';

const Input = ({
  label,
  helpText,
  error,
  success,
  warning,
  required = false,
  disabled = false,
  variant = 'default',
  size = 'base',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'outlined':
        return styles['input--outlined'];
      case 'filled':
        return styles['input--filled'];
      default:
        return '';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles['input--sm'];
      case 'lg':
        return styles['input--lg'];
      case 'xl':
        return styles['input--xl'];
      default:
        return '';
    }
  };

  const getStateClass = () => {
    if (error) return styles['input--error'];
    if (success) return styles['input--success'];
    if (warning) return styles['input--warning'];
    return '';
  };

  const getIconClass = () => {
    let iconClass = '';
    if (leftIcon) iconClass += ` ${styles['input--withLeftIcon']}`;
    if (rightIcon) iconClass += ` ${styles['input--withRightIcon']}`;
    return iconClass;
  };

  const getHelpTextClass = () => {
    if (error) return styles['inputHelpText--error'];
    if (success) return styles['inputHelpText--success'];
    if (warning) return styles['inputHelpText--warning'];
    return '';
  };

  const inputClasses = [
    styles.input,
    getVariantClass(),
    getSizeClass(),
    getStateClass(),
    getIconClass(),
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    styles.inputLabel,
    required ? styles['inputLabel--required'] : ''
  ].filter(Boolean).join(' ');

  const helpTextClasses = [
    styles.inputHelpText,
    getHelpTextClass()
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <span className={styles.inputLeftIcon}>
            {leftIcon}
          </span>
        )}
        
        <input
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <span className={styles.inputRightIcon}>
            {rightIcon}
          </span>
        )}
      </div>
      
      {helpText && (
        <p className={helpTextClasses}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default Input;
