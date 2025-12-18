import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createLeadsForWebsite } from '../services/apiLeads';
import { getPublicCompanyData } from '../services/apiCompany';
import styles from './ClientRegistrationForm.module.css';

const ClientRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+971');
  const [companyLogo, setCompanyLogo] = useState('/logo.png');
  const [companyName, setCompanyName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange'
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await getPublicCompanyData();
        if (data?.company_logo_url) {
          setCompanyLogo(data.company_logo_url);
        }
        if (data?.company_name) {
          setCompanyName(data.company_name);
        }
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        // Keep default logo if API fails
      }
    };

    fetchCompanyData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = {
        name: data.name,
        email: data.email || '',
        phone: data.phone ? `${phoneCode}${data.phone}` : '',
        clientSource: "Landingpages",
        clientSubSource: "Forms"
      };

      await createLeadsForWebsite(payload);
      
      toast.success('Registration successful! We will contact you soon.');
      reset();
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          
          <div className={styles.formTitle}>
          <div className={styles.jbrText}>{companyName}</div>
            <div>REGISTRATION FORM</div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className={styles.companyLogo}
            onError={(e) => {
              e.target.src = "/logo.png";
            }}
          />
        </div>
      </div>

      {/* Form Panel */}
      <div className={styles.formPanel}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Client Full Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                 Full Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register('name', {
                  required: 'Required'
                })}
                placeholder="Full Name"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              {errors.name && (
                <span className={styles.errorText}>Required</span>
              )}
            </div>

            {/* Client Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                 Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            {/* Phone Number */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <div className={styles.phoneInputContainer}>
                <select 
                  value={phoneCode} 
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className={styles.phoneCode}
                >
                  <option value="+971">+971</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+966">+966</option>
                </select>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  placeholder="Phone Number"
                  className={`${styles.input} ${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`}
                />
              </div>
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone.message}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.submitContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientRegistrationForm;

