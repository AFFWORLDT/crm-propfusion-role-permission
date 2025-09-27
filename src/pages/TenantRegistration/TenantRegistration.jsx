import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone,
  Building,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './TenantRegistration.module.css';
import { registerTenant } from '../../services/apiTenantRegistration';

const TenantRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  // Form validation rules
  const validationRules = {
    tenant_name: {
      required: 'Tenant name is required',
      minLength: { value: 2, message: 'Name must be at least 2 characters' }
    },
    tenant_email: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address'
      }
    },
    tenant_phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[+]?[\d\s\-()]+$/,
        message: 'Invalid phone number'
      },
      minLength: { value: 10, message: 'Phone number must be at least 10 digits' }
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare tenant data according to API structure
      const tenantData = {
        tenant_name: data.tenant_name,
        tenant_email: data.tenant_email,
        tenant_phone: data.tenant_phone
      };

      // Make API call using our service
      await registerTenant(tenantData);
      
      toast.success('Registration successful! Your account has been created.');
      
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
            <Users size={32} />
            <h1>Tenant Registration</h1>
          </div>
          <p className={styles.subtitle}>
            Register as a tenant and find your perfect rental property
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formContent}>
            <h2>Tenant Information</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="tenant_name">
                <User size={16} />
                Tenant Name *
              </label>
              <input
                type="text"
                id="tenant_name"
                {...register('tenant_name', validationRules.tenant_name)}
                placeholder="Enter your full name"
                className={errors.tenant_name ? styles.error : ''}
              />
              {errors.tenant_name && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.tenant_name.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tenant_email">
                <Mail size={16} />
                Email Address *
              </label>
              <input
                type="email"
                id="tenant_email"
                {...register('tenant_email', validationRules.tenant_email)}
                placeholder="Enter your email address"
                className={errors.tenant_email ? styles.error : ''}
              />
              {errors.tenant_email && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.tenant_email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tenant_phone">
                <Phone size={16} />
                Phone Number *
              </label>
              <input
                type="tel"
                id="tenant_phone"
                {...register('tenant_phone', validationRules.tenant_phone)}
                placeholder="Enter your phone number"
                className={errors.tenant_phone ? styles.error : ''}
              />
              {errors.tenant_phone && (
                <span className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.tenant_phone.message}
                </span>
              )}
            </div>

            {/* Additional Information */}
            <div className={styles.infoBox}>
              <div className={styles.infoIcon}>
                <Building size={16} />
              </div>
              <div className={styles.infoContent}>
                <h4>What happens next?</h4>
                <p>After registration, you&apos;ll be able to:</p>
                <ul>
                  <li>Browse available rental properties</li>
                  <li>Contact property owners and agents</li>
                  <li>Schedule property viewings</li>
                  <li>Apply for rental properties</li>
                </ul>
              </div>
            </div>

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
                  Register as Tenant
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

export default TenantRegistration; 