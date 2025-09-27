import { useForm } from "react-hook-form";
import useCreateWatchman from "./useCreateWatchman";
import useUpdateWatchman from "./useUpdateWatchman";
import "./AddWatchmenForm.css";
import { useState, useEffect } from "react";

function AddWatchmenForm({ onCloseModal, watchmanToEdit = null }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: watchmanToEdit || {},
    mode: "onChange"
  });
  
  const { createWatchman, isLoading: isCreating } = useCreateWatchman();
  const { updateWatchman, isLoading: isUpdating } = useUpdateWatchman();
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    // Set initial avatar preview if editing a watchman with an avatar
    if (watchmanToEdit?.profile_pic) {
      setAvatarPreview(watchmanToEdit.profile_pic);
    } else if (watchmanToEdit?.avatar) {
      setAvatarPreview(watchmanToEdit.avatar);
    }
    
    return () => {
      // Only clean up URLs created by our component, not URLs from the backend
      if (avatarPreview && !watchmanToEdit?.profile_pic && !watchmanToEdit?.avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [watchmanToEdit]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      
      // Revoke previous preview URL to avoid memory leaks
      // Only clean up URLs created by our component, not URLs from the backend
      if (avatarPreview && !watchmanToEdit?.profile_pic && !watchmanToEdit?.avatar) {
        URL.revokeObjectURL(avatarPreview);
      }
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  }

  function onSubmit(data) {
    if (watchmanToEdit) {
      const { password, ...updateData } = data;
      const changedData = Object.entries(updateData).reduce((acc, [key, value]) => {
        if (value !== watchmanToEdit[key]) {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      if (password) {
        changedData.password = password;
      }
      
      updateWatchman({ watchmanId: watchmanToEdit.id, watchmanData: changedData , file: avatarFile });
    } else {
      createWatchman({ watchmanData: data, file: avatarFile });
    }
    reset();
    onCloseModal();
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{watchmanToEdit ? 'Edit Watchman' : 'Add New Watchman'}</h5>
      </div>
      
      <div className="modal-body">
        <form onSubmit={handleSubmit(onSubmit)} className="watchman-form">
          {/* Avatar Upload */}
          <div className="form-group">
            <label htmlFor="avatar">Profile Image</label>
            <div className="avatar-upload-container">
              {avatarPreview && (
                <div className="avatar-preview">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="avatar-image"
                  />
                </div>
              )}
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="form-control-file"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
                <label htmlFor="avatar" className="btn btn-outline-secondary">
                  {watchmanToEdit?.profile_pic || watchmanToEdit?.avatar ? 'Change Image' : 'Select Image'}
                </label>
                {avatarFile && (
                  <span className="file-name">{avatarFile.name}</span>
                )}
                {watchmanToEdit && (watchmanToEdit.profile_pic || watchmanToEdit.avatar) && !avatarFile && (
                  <span className="current-image-info">Current profile image</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
              placeholder="Enter Name"
              disabled={isLoading}
              {...register("name", { 
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
            />
            {errors?.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
              placeholder="Enter Email"
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors?.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contact_no">Contact Number</label>
            <input
              type="tel"
              id="contact_no"
              className={`form-control ${errors?.contact_no ? 'is-invalid' : ''}`}
              placeholder="Enter Contact Number"
              disabled={isLoading}
              {...register("contact_no", { 
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid number"
                }
              })}
            />
            {errors?.contact_no && <div className="invalid-feedback">{errors.contact_no.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              className={`form-control ${errors?.address ? 'is-invalid' : ''}`}
              placeholder="Enter Address"
              disabled={isLoading}
              {...register("address", { 
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters"
                }
              })}
            />
            {errors?.address && <div className="invalid-feedback">{errors.address.message}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors?.password ? 'is-invalid' : ''}`}
              placeholder={watchmanToEdit ? "Leave blank to keep current password" : "Enter Password"}
              disabled={isLoading}
              {...register("password", {
                required: !watchmanToEdit && "Password is required",
                minLength: watchmanToEdit ? {
                  value: 8,
                  message: "Password must be at least 8 characters",
                } : undefined,
                validate: (value) => {
                  if (watchmanToEdit && value === "") return true;
                  if (value && value.length < 8) return "Password must be at least 8 characters";
                  return true;
                }
              })}
            />
            {errors?.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <div className="modal-footer px-0 pb-0">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCloseModal}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {watchmanToEdit ? 'Update Watchman' : 'Add Watchman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWatchmenForm; 