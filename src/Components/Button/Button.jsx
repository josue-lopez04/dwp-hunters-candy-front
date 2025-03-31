import React from 'react';
import './Button.css';

/**
 * Button component for consistent button styling throughout the application
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Button type (primary, secondary, danger)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.size - Button size (small, medium, large)
 * @param {Function} props.onClick - Click handler function
 * @param {ReactNode} props.children - Button content
 * @returns {JSX.Element} Button component
 */
const Button = ({ 
  type = 'primary', 
  disabled = false, 
  fullWidth = false, 
  size = 'medium',
  onClick,
  children,
  ...rest
}) => {
  const buttonClasses = [
    'custom-button',
    `button-${type}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;