import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  size = 'base',
  interactive = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'elevated':
        return styles['card--elevated'];
      case 'outlined':
        return styles['card--outlined'];
      case 'ghost':
        return styles['card--ghost'];
      default:
        return '';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles['card--sm'];
      case 'lg':
        return styles['card--lg'];
      default:
        return '';
    }
  };

  const getInteractiveClass = () => {
    return interactive ? styles['card--interactive'] : '';
  };

  const getLoadingClass = () => {
    return loading ? styles['card--loading'] : '';
  };

  const cardClasses = [
    styles.card,
    getVariantClass(),
    getSizeClass(),
    getInteractiveClass(),
    getLoadingClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Sub-components
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardHeader} ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`${styles.cardTitle} ${className}`} {...props}>
    {children}
  </h3>
);

const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`${styles.cardSubtitle} ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardContent} ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`${styles.cardFooter} ${className}`} {...props}>
    {children}
  </div>
);

// Assign sub-components to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

// Set display names
Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardTitle.displayName = 'Card.Title';
CardSubtitle.displayName = 'Card.Subtitle';
CardContent.displayName = 'Card.Content';
CardFooter.displayName = 'Card.Footer';

export default Card;
