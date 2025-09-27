import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './../../pages/Owner/AddOwner.module.css';

export function StepFirst({nextStep}){
    return(
        <div className={styles.stepContainers}>
        <h2 className={styles.title}>Create Your Owner Click next</h2>
        <p className={styles.subtitle}>Click Next for Create Owner </p>
        <div className={styles.imageContainer}>
          <img 
            src='https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg'
            alt="Owner profile"
            className={styles.uploadedImage}
          />
        </div>
        <button
          onClick={nextStep}
          className={styles.nextButton}
        >
          Next <ChevronRight />
        </button>
      </div>
    )
}

export function StepSecond({formData,handleInputChange,nextStep,prevStep}){
    return(
        <div className={styles.stepContainer}>
        <h2 className={styles.stepTitle}>Property Details</h2>
        <select
          name="owner_type"
          value={formData.owner_type}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        >
          <option value="">Select Owner Type</option>
          <option value="Individual">Individual</option>
          <option value="Company">Company</option>
          <option value="Organization">Organization</option>
        </select>
        <div className={styles.navigationButtons}>
          <button onClick={prevStep} className={styles.prevButton}>
            <ChevronLeft /> Back
          </button>
          <button 
            onClick={nextStep} 
            className={styles.nextButton}
            disabled={!formData.owner_type}
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    )
}

export function StepThird({formData,handleInputChange,nextStep,prevStep}){
    return(
        <div className={styles.stepContainer}>
        <h2 className={styles.stepTitle}>Owner Information</h2>
        <input
          type="text"
          name="owner_name"
          placeholder="Owner Name"
          value={formData.owner_name}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
        <textarea
          name="owner_info"
          placeholder="Owner Additional Information"
          value={formData.owner_info}
          onChange={handleInputChange}
          className={styles.formTextarea}
        />
        <div className={styles.navigationButtons}>
          <button onClick={prevStep} className={styles.prevButton}>
            <ChevronLeft /> Back
          </button>
          <button 
            onClick={nextStep} 
            className={styles.nextButton}
            disabled={!formData.owner_name}
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    )
}

export function StepFour({formData,handleInputChange,nextStep,prevStep}){
    return(
        <div className={styles.stepContainer}>
        <h2 className={styles.stepTitle}>Lessor Details</h2>
        <input
          type="text"
          name="lessor_name"
          placeholder="Lessor Name"
          value={formData.lessor_name}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
        <input
          type="text"
          name="lessor_emirates_id"
          placeholder="Emirates ID"
          value={formData.lessor_emirates_id}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
        <input
          type="text"
          name="license_no"
          placeholder="License Number"
          value={formData.license_no}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
        <input
          type="email"
          name="lessor_email"
          placeholder="Lessor Email"
          value={formData.lessor_email}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
        <input
          type="tel"
          name="lessor_phone"
          placeholder="Lessor Phone"
          value={formData.lessor_phone}
          onChange={handleInputChange}
          className={styles.formInput}
          required
        />
        <div className={styles.navigationButtons}>
          <button onClick={prevStep} className={styles.prevButton}>
            <ChevronLeft /> Back
          </button>
          <button 
            onClick={nextStep} 
            className={styles.nextButton}
            disabled={
              !formData.lessor_name || 
              !formData.lessor_emirates_id || 
              !formData.license_no || 
              !formData.lessor_email || 
              !formData.lessor_phone
            }
          >
            Next <ChevronRight />
          </button>
        </div>
      </div>
    )
}

export function StepFith({formData,prevStep,handleSubmit}){
    return(
        <div className={styles.stepContainer}>
            <h2 className={styles.stepTitle}>Review Details</h2>
            <div className={styles.reviewSection}>
              <div className={styles.reviewItem}>
                <strong>Owner Type:</strong> {formData.owner_type}
              </div>
              <div className={styles.reviewItem}>
                <strong>Owner Name:</strong> {formData.owner_name}
              </div>
              <div className={styles.reviewItem}>
                <strong>Owner Info:</strong> {formData.owner_info || 'No additional info'}
              </div>
              <div className={styles.reviewItem}>
                <strong>Lessor Name:</strong> {formData.lessor_name}
              </div>
              <div className={styles.reviewItem}>
                <strong>Emirates ID:</strong> {formData.lessor_emirates_id}
              </div>
              <div className={styles.reviewItem}>
                <strong>License Number:</strong> {formData.license_no}
              </div>
              <div className={styles.reviewItem}>
                <strong>Lessor Email:</strong> {formData.lessor_email}
              </div>
              <div className={styles.reviewItem}>
                <strong>Lessor Phone:</strong> {formData.lessor_phone}
              </div>
            </div>
            <div className={styles.navigationButtons}>
              <button onClick={prevStep} className={styles.prevButton}>
                <ChevronLeft /> Back
              </button>
              <button 
                onClick={handleSubmit} 
                className={styles.submitButton}
              >
                <Check /> Submit
              </button>
            </div>
          </div>
    )
}