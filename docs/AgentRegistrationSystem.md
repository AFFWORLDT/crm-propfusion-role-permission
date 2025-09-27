# Agent Registration System - Complete Guide

## 🎯 **Overview**
यह एक public agent registration system है जहाँ real estate agents automatically अपना account create कर सकते हैं। System multi-step form के through agents को guide करता है और backend API के साथ integrate होता है।

## 🚀 **Features**

### 1. **Multi-Step Registration Form**
- **Step 1**: Account Information (Name, Email, Password)
- **Step 2**: Personal Information (Gender, Phone)
- **Step 3**: Professional Information (Experience, Specialities, Profile Picture)

### 2. **Form Validation**
- Real-time validation
- Password strength requirements
- Email format validation
- Emirates ID format validation
- Age verification (18+)
- File type and size validation

### 3. **File Upload Support**
- Multiple file uploads
- Supported formats: JPG, PNG, PDF
- File size limit: 5MB per file
- Drag & drop interface
- File preview and removal

### 4. **User Experience**
- Progress indicator
- Step-by-step navigation
- Responsive design
- Dark mode support
- Toast notifications
- Loading states

## 🏗️ **Architecture**

### **Frontend Components**
```
src/pages/AgentRegistration/
├── AgentRegistration.jsx      # Main component
├── AgentRegistration.module.css # Styles
└── index.js                   # Export file
```

### **API Services**
```
src/services/
└── apiAgentRegistration.js    # API functions
```

### **Routes**
```
/agent-registration            # Public registration page
```

## 📋 **API Integration**

### **Main Registration Endpoint**
```bash
POST https://ivre-api.propfusion.io/agent/public
```

### **Request Payload Structure**
```json
{
  "name": "Rahul sarswat",
  "email": "rahulsarswat57@gmail.com",
  "password": "rahul123",
  "role": "agent",
  "team": 0,
  "gender": "MALE",
  "phone": "+971 542997582",
  // "nationality": "{\"value\":\"Malaysia\",\"label\":\"Malaysia\",\"flag\":\"https://flagcdn.com/w320/my.png\"}", // Removed for simplicity
  // "emirates_id": null, // Removed for simplicity
  "passport_no": null,
  // "documents": null, // Removed for simplicity
  "avatar": "profile_picture_file", // Profile picture
  "kyc_verification": false,
  // "created_at": "2025-06-14T10:36:58.038675", // Backend handles automatically
  "state": "pending",
  // "dob": "2025-06-13T00:00:00.000Z", // Removed for simplicity
  // "remarks": "", // Removed for simplicity
  // "languages": ["am", "as"], // Removed for simplicity
  // "brn_number": "22", // Removed for simplicity
  "experience_years": null,
  "specialities": [],
  "property_default_view": null,
  "leads_default_view": null,
  "whatsapp_notification": false,
  // "joining_date": null, // Removed for simplicity
  // "job_type": null, // Removed for simplicity
  "telCode": ""
}
```

### **Additional API Endpoints**
- `GET /agent/check-email` - Email availability check
- `GET /agent/roles` - Available agent roles
- `GET /agent/teams` - Available teams
- `POST /agent/upload-documents` - Document upload
- `GET /agent/registration-status` - Registration status

### **Important Notes**
- **`created_at`**: Backend automatically sets this field when creating new agents
- **`state`**: New registrations start with "pending" status
- **`role`**: Default role is "agent" for new registrations
- **`team`**: Default team is 0 (unassigned)
- **`password`**: Single password field (no confirmation required for better UX)

## 🔧 **Implementation Details**

### **Form Validation Rules**
```javascript
const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' }
  },
  email: {
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
  },
  emirates_id: {
    required: 'Emirates ID is required',
    pattern: {
      value: /^\d{3}-\d{4}-\d{7}$/,
      message: 'Emirates ID format: XXX-XXXX-XXXXXXX'
    }
  },
  dob: {
    required: 'Date of birth is required',
    validate: value => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      return age >= 18 || 'You must be at least 18 years old';
    }
  }
};
```

### **File Upload Handling**
```javascript
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  const validFiles = files.filter(file => {
    const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
    
    if (!isValidType) {
      toast.error(`${file.name} is not a valid file type. Only JPEG, PNG, JPG, and PDF are allowed.`);
    }
    if (!isValidSize) {
      toast.error(`${file.name} is too large. Maximum size is 5MB.`);
    }
    
    return isValidType && isValidSize;
  });
  
  setSelectedFiles(prev => [...prev, ...validFiles]);
};
```

### **Multi-Step Navigation**
```javascript
const nextStep = async () => {
  const fieldsToValidate = getFieldsForStep(step);
  const isValid = await trigger(fieldsToValidate);
  
  if (isValid) {
    // Save current step data
    const currentData = watch(fieldsToValidate);
    setFormData(prev => ({ ...prev, ...currentData }));
    
    if (step < 3) {
      setStep(step + 1);
    }
  }
};
```

## 🎨 **UI Components**

### **Progress Steps**
- Visual step indicator
- Active/inactive states
- Step labels (Account, Personal, Professional)
- Progress bar animation

### **Form Fields**
- Input validation states
- Error message display
- Icon integration
- Responsive layout

### **File Upload**
- Drag & drop interface
- File type validation
- Size restrictions
- Preview functionality

## 🔒 **Security Features**

### **Password Requirements**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### **Input Validation**
- Email format validation
- Emirates ID format validation
- Age verification
- Required field validation

### **File Security**
- File type restrictions
- Size limitations
- Secure upload handling

## 📱 **Responsive Design**

### **Mobile Optimization**
- Touch-friendly interface
- Responsive form layout
- Optimized button sizes
- Mobile-first approach

### **Breakpoints**
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🌙 **Dark Mode Support**

### **Automatic Detection**
- System preference detection
- CSS custom properties
- Smooth transitions
- Consistent theming

## 🧪 **Testing**

### **Form Validation Tests**
1. **Required Fields**: Empty submission should show errors
2. **Email Format**: Invalid emails should be rejected
3. **Password Strength**: Weak passwords should be rejected
4. **File Upload**: Invalid files should be rejected
5. **Step Navigation**: Validation should prevent progression

### **API Integration Tests**
1. **Registration**: Successful account creation
2. **Error Handling**: Network failures and API errors
3. **File Upload**: Document upload functionality
4. **Response Handling**: Proper success/error messages

## 🚀 **Deployment**

### **Build Process**
```bash
npm run build
```

### **Environment Variables**
```env
VITE_API_URL=https://ivre-api.propfusion.io
VITE_APP_NAME=PropFusion CRM
```

### **Production Considerations**
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Error logging
- Performance monitoring

## 📊 **Analytics & Monitoring**

### **User Behavior Tracking**
- Form completion rates
- Step abandonment analysis
- File upload success rates
- Error frequency monitoring

### **Performance Metrics**
- Page load times
- Form submission times
- API response times
- Error rates

## 🔄 **Future Enhancements**

### **Planned Features**
1. **Email Verification**: Email confirmation workflow
2. **SMS Verification**: Phone number verification
3. **KYC Integration**: Automated identity verification
4. **Social Login**: Google, Facebook integration
5. **Multi-language**: Arabic, Hindi support

### **Technical Improvements**
1. **Real-time Validation**: Server-side validation
2. **Progressive Web App**: Offline support
3. **Advanced Analytics**: User journey tracking
4. **A/B Testing**: Form optimization
5. **Performance Optimization**: Lazy loading, caching

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Form Not Submitting**
- Check browser console for errors
- Verify API endpoint accessibility
- Check network connectivity
- Validate form data

#### **File Upload Failures**
- Verify file size limits
- Check file type restrictions
- Ensure proper permissions
- Monitor server logs

#### **Validation Errors**
- Review validation rules
- Check input formats
- Verify required fields
- Test edge cases

### **Debug Steps**
1. **Browser Console**: Check for JavaScript errors
2. **Network Tab**: Monitor API calls
3. **Form State**: Verify data collection
4. **API Response**: Check server responses
5. **File Uploads**: Verify file handling

## 📞 **Support & Maintenance**

### **Documentation**
- API documentation
- User guides
- Troubleshooting guides
- FAQ section

### **Contact Information**
- Technical support: tech@propfusion.io
- User support: support@propfusion.io
- Bug reports: bugs@propfusion.io

## 🎉 **Conclusion**

यह agent registration system agents को seamlessly अपना account create करने में help करता है। Multi-step approach, comprehensive validation, और user-friendly interface के साथ यह system modern web standards को follow करता है और scalable architecture provide करता है।

### **Key Benefits**
- ✅ **User-Friendly**: Intuitive multi-step process, no password confirmation
- ✅ **Secure**: Comprehensive validation and security
- ✅ **Responsive**: Mobile-first design approach
- ✅ **Scalable**: Modular architecture for future growth
- ✅ **Maintainable**: Clean code structure and documentation 