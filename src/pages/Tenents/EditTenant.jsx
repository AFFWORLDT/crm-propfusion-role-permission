import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TenentsForm from '../../features/Tenants/TenentsForm';
import { useUpdateTenant } from '../../features/Tenants/useUpdate';
import { useTenant } from './useTenants';

function EditTenant() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { tenant, isLoading } = useTenant(tenantId);
  const { update, isPending } = useUpdateTenant();
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_emirates_id: '',
    license_no: '',
    licensing_authority: '',
    tenant_email: '',
    tenant_phone: '',
  });

  useEffect(() => {
    if (tenant) {
      setFormData(tenant);
    }
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    update(
      { id: tenantId, data: formData },
      {
        onSuccess: () => {
          navigate('/tenants');
        },
      }
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <TenentsForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isPending={isPending}
      isEditing={true}
    />
  );
}

export default EditTenant; 