import React from 'react';
import './Card.css';

/**
 * Card component for displaying content in a card layout
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {boolean} props.hoverable - Whether the card should have hover effects
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Card component
 */
const Card = ({ 
  title, 
  children, 
  footer, 
  hoverable = false, 
  className = '', 
  ...rest 
}) => {
  const cardClasses = [
    'card',
    hoverable ? 'card-hoverable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...rest}>
      {title && (
        <div className="card-header">
          {typeof title === 'string' ? <h3 className="card-title">{title}</h3> : title}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;