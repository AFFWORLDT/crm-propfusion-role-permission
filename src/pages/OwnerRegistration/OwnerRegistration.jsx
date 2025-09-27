import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './OwnerRegistration.module.css';
import { registerOwner } from '../../services/apiOwnerRegistration';

const OwnerRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const password = watch('password');

  // Form validation rules
  const validationRules = {
    owner_name: {
      required: 'Owner name is required',
      minLength: { value: 2, message: 'Name must be at least 2 characters' }
    },
    lessor_email: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address'
      }
    },
    password: {
      required: 'Password is required',
      minLength: { value: 6, message: 'Password must be at least 6 characters' },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare owner data according to API structure
      const ownerData = {
        owner_name: data.owner_name,
        lessor_email: data.lessor_email,
        password: data.password
      };

      // Make API call using our service
      await registerOwner(ownerData);
      
      toast.success('Registration successful! Your account is pending approval.');
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registrationCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <Home size={32} />
            <h1>Owner Registration</h1>
          </div>
          <p className={styles.subtitle}>
            Register as a property owner and start managing your properties
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formContent}>
            <h2>Owner Information</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="owner_name">
                <User size={16} />
                Owner Name *
              </label>
              <input
                type="text"
                id="owner_name"
                {...register('owner_name', validationRules.owner_name)}
                placeholder="Enter your full name"
                className={errors.owner_name ? styles.error : ''}
              />
              {errors.owner_name && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.owner_name.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lessor_email">
                <Mail size={16} />
                Email Address *
              </label>
              <input
                type="email"
                id="lessor_email"
                {...register('lessor_email', validationRules.lessor_email)}
                placeholder="Enter your email address"
                className={errors.lessor_email ? styles.error : ''}
              />
              {errors.lessor_email && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.lessor_email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                <Lock size={16} />
                Password *
              </label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', validationRules.password)}
                  placeholder="Create a strong password"
                  className={errors.password ? styles.error : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggle}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div 
                    className={`${styles.strengthFill} ${
                      password.length >= 6 ? styles.strong : 
                      password.length >= 4 ? styles.medium : styles.weak
                    }`}
                  />
                </div>
                <span className={styles.strengthText}>
                  {password.length >= 6 ? 'Strong' : 
                   password.length >= 4 ? 'Medium' : 'Weak'}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Register as Owner
                </>
              )}
            </button>

            {/* Login Link */}
            <div className={styles.loginLink}>
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className={styles.linkButton}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerRegistration; 