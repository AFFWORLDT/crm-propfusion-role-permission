import { useState } from "react";
import SectionTop from "../../ui/SectionTop";
import TenentsForm from "../../features/Tenants/TenentsForm";
import { useCreateTenant } from "../../features/Tenants/useCreate";

function AddTenends() {
    const { create: addTenents, isPending } = useCreateTenant();
    const [formData, setFormData] = useState({
        tenant_name: "",
        tenant_emirates_id: "",
        license_no: "",
        licensing_authority: "",
        tenant_email: "",
        tenant_phone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTenents(formData);
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Add Tenant" />
            <TenentsForm
                formData={formData}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                isPending={isPending}
            />
        </div>
    );
}

export default AddTenends;
