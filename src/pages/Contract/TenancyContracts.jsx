import { useState, useEffect, useRef, useCallback } from "react";
import { FileDown, Save, Search, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import styles from "./TenancyContracts.module.css";
import SectionTop from '../../ui/SectionTop'
import useSaveTanance from "../../features/Contract/useSaveTanance";
import { useSearchParams } from "react-router-dom";
import { useAgreements } from "../../features/Contract/useAgrement";
import { fetchOwners, fetchTenants } from "../../api/tenetInformation";

const TenancyContract = () => {
    const [formData, setFormData] = useState({
        owner_name: "",
        owner_licensing_authority: "",
        lessor_name: "",
        lessor_emirates_id: "",
        ownerlicense_no: "",
        lessor_email: "",
        lessor_phone: "",
        tenant_name: "",
        tenant_emirates_id: "",
        tenant_licensing_authority: "",
        tenantlicense_no: "",
        tenant_email: "",
        tenant_phone: "",
        plot_no: "",
        location: "",
        building_name: "",
        property_type: "",
        property_no: "",
        property_area: "",
        premises_no: "",
        Makani_no: "",
        property_usage: "", // Radio button values: Industrial, Commercial, Residential
        agreement_period_from: "",
        agreement_period_to: "",
        agreement_value: "",
        security_deposit_amount: "",
        payment_mode: "",
        annual_rent: "",
        additionalTerm1: "",
        additionalTerm2: "",
        additionalTerm3: "",
        additionalTerm4: "",
        additionalTerm5: "",
        contract_date:""
    });
    
    // For Owner and Tenant dropdown functionality
    const [owners, setOwners] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
    const [tenantSearchTerm, setTenantSearchTerm] = useState("");
    const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
    const [showTenantDropdown, setShowTenantDropdown] = useState(false);
    const [loadingOwners, setLoadingOwners] = useState(false);
    const [loadingTenants, setLoadingTenants] = useState(false);
    
    const ownerDropdownRef = useRef(null);
    const tenantDropdownRef = useRef(null);
    
    const [searchParams] = useSearchParams();
    const did = searchParams.get('id');
    const isdownload = did ? true : false;
    const { saveTanance, isPending } = useSaveTanance();
    const [pdfUrl, setPdfUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {data, status} = useAgreements({agreement_id:did});

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const updatePDFPreview = useCallback(async (currentFormData) => {
        try {
            // Only proceed if the form actually has data to reduce unnecessary API calls
            if (!currentFormData || Object.values(currentFormData).every(val => !val)) {
                return; // Skip PDF generation if form is empty
            }
            
            setIsLoading(true);
            const existingPdfBytes = await fetch("/TENANCY CONTRACT_Blank_Dynamic.pdf").then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();
    
            // Convert all values to strings before setting them in the PDF
            form.getTextField("Text1")?.setText(String(currentFormData.owner_name || ""));
            form.getTextField("Text2")?.setText(String(currentFormData.lessor_name || ""));
            form.getTextField("Text3")?.setText(String(currentFormData.lessor_emirates_id || ""));
            form.getTextField("Text4")?.setText(String(currentFormData.ownerlicense_no || ""));
            form.getTextField("Text5")?.setText(String(currentFormData.owner_licensing_authority || ""));
            form.getTextField("Text6")?.setText(String(currentFormData.lessor_email || ""));
            form.getTextField("Text7")?.setText(String(currentFormData.lessor_phone || ""));
            form.getTextField("Text8")?.setText(String(currentFormData.tenant_name || ""));
            form.getTextField("Text9")?.setText(String(currentFormData.tenant_emirates_id || ""));
            form.getTextField("Text10")?.setText(String(currentFormData.tenantlicense_no || ""));
            form.getTextField("Text11")?.setText(String(currentFormData.tenant_licensing_authority || ""));
            form.getTextField("Text12")?.setText(String(currentFormData.tenant_email || ""));
            form.getTextField("Text13")?.setText(String(currentFormData.tenant_phone || ""));
            form.getTextField("Text14")?.setText(String(currentFormData.plot_no || ""));
            form.getTextField("Text15")?.setText(String(currentFormData.property_no || ""));
            form.getTextField("Text17")?.setText(String(currentFormData.building_name || ""));
            form.getTextField("Text18")?.setText(String(currentFormData.property_type || ""));
            form.getTextField("Text19")?.setText(String(currentFormData.Makani_no || ""));
            form.getTextField("Text22")?.setText(String(currentFormData.location || ""));
            form.getTextField("Text23")?.setText(String(currentFormData.property_area || ""));
            form.getTextField("Text24")?.setText(String(currentFormData.premises_no || ""));
            form.getTextField("Text25")?.setText(formatDate(currentFormData.agreement_period_from));
            form.getTextField("Text26")?.setText(currentFormData.annual_rent ? `${currentFormData.annual_rent} AED` : "");
            form.getTextField("Text27")?.setText(currentFormData.agreement_value ? `${currentFormData.agreement_value} AED` : "");
            form.getTextField("Text28")?.setText(currentFormData.security_deposit_amount ? `${currentFormData.security_deposit_amount} AED` : "");
            form.getTextField("Text29")?.setText(String(currentFormData.payment_mode || ""));
            form.getTextField("Date32_es_:signer:date")?.setText(formatDate(currentFormData.contract_date));
            form.getTextField("Text43")?.setText(String(currentFormData.additionalTerm1 || ""));
            form.getTextField("Text44")?.setText(String(currentFormData.additionalTerm2 || ""));
            form.getTextField("Text45")?.setText(String(currentFormData.additionalTerm3 || ""));
            form.getTextField("Text46")?.setText(String(currentFormData.additionalTerm4 || ""));
            form.getTextField("Text47")?.setText(String(currentFormData.additionalTerm5 || ""));
            form.getTextField("Date38_es_:signer:date")?.setText(formatDate(currentFormData.agreement_period_to));
    
            // Handle radio button for property usage
            const group31Field = form.getRadioGroup("Group31");
            if (group31Field) {
                const propertyUsageMapping = {
                    Residential: "Choice2",
                    Commercial: "Choice1",
                    Industrial: "Choice3",
                };
    
                const valueToSelect =
                    propertyUsageMapping[currentFormData.property_usage] || "Choice1";
    
                try {
                    group31Field.select(valueToSelect); // Select the appropriate radio button
                } catch (err) {
                    console.error("Error selecting radio button:", err.message);
                }
            } else {
                console.error('Radio group "Group31" not found in the PDF.');
            }
    
            // Add other field mappings here...
    
            const fields = form.getFields();
            fields.forEach((field) => {
                field.enableReadOnly();
            });
    
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            
            // Revoke previous URL before creating a new one
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
            
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error updating PDF preview:", error);
        } finally {
            setIsLoading(false);
        }
    }, [pdfUrl]);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        
        // Check if the field is an amount field
        const amountFields = ['annual_rent', 'security_deposit_amount', 'agreement_value'];
        if (amountFields.includes(name)) {
            // Only allow numeric input
            if (value !== '' && !/^\d*$/.test(value)) {
                return; // Don't update if non-numeric
            }
        }

        const newFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(newFormData);
        await updatePDFPreview(newFormData);
    };

    useEffect(() => {
        if (status === "pending") {
            setIsLoading(true);  
        } else {
            setIsLoading(false); 
        }
        
       
    }, [data, status]);
    
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ownerDropdownRef.current && !ownerDropdownRef.current.contains(event.target)) {
                setShowOwnerDropdown(false);
            }
            if (tenantDropdownRef.current && !tenantDropdownRef.current.contains(event.target)) {
                setShowTenantDropdown(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    // Replace the old fetchOwners function with the new one
    const handleFetchOwners = async (searchTerm = "") => {
        try {
            setLoadingOwners(true);
            const filters = searchTerm ? { owner_name: searchTerm } : {};
            const data = await fetchOwners(filters);
            setOwners(data.owners || []);
        } catch (error) {
            console.error("Error fetching owners:", error);
        } finally {
            setLoadingOwners(false);
        }
    };
    
    // Replace the old fetchTenants function with the new one
    const handleFetchTenants = async (searchTerm = "") => {
        try {
            setLoadingTenants(true);
            const filters = searchTerm ? { tenant_name: searchTerm } : {};
            const data = await fetchTenants(filters);
            setTenants(data.tenants || []);
        } catch (error) {
            console.error("Error fetching tenants:", error);
        } finally {
            setLoadingTenants(false);
        }
    };
    
    // Handle owner search and dropdown
    const handleOwnerSearchChange = (e) => {
        const value = e.target.value;
        setOwnerSearchTerm(value);
        if (value.trim()) {
            handleFetchOwners(value);
        } else {
            setOwners([]);
        }
    };
    
    // New function to handle search icon click for owners
    const handleOwnerSearch = () => {
        handleFetchOwners(ownerSearchTerm);
    };
    
    // Handle tenant search and dropdown
    const handleTenantSearchChange = (e) => {
        const value = e.target.value;
        setTenantSearchTerm(value);
        // Remove the automatic fetchTenants call to prevent API calls on every keystroke
    };
    
    // New function to handle search icon click for tenants
    const handleTenantSearch = () => {
        handleFetchTenants(tenantSearchTerm);
    };
    
    // Select owner and populate form
    const selectOwner = (owner) => {
        const updatedFormData = {
            ...formData,
            owner_name: owner.owner_name || "",
            lessor_name: owner.lessor_name || "",
            lessor_emirates_id: owner.lessor_emirates_id || "",
            ownerlicense_no: owner.license_no || "",
            owner_licensing_authority: owner.owner_type === "Company" ? owner.owner_info || "" : "",
            lessor_email: owner.lessor_email || "",
            lessor_phone: owner.lessor_phone || ""
        };
        
        setFormData(updatedFormData);
        setOwnerSearchTerm(owner.owner_name || "");
        setShowOwnerDropdown(false);
        updatePDFPreview(updatedFormData);
    };
    
    // Select tenant and populate form
    const selectTenant = (tenant) => {
        const updatedFormData = {
            ...formData,
            tenant_name: tenant.tenant_name || "",
            tenant_emirates_id: tenant.tenant_emirates_id || "",
            tenantlicense_no: tenant.license_no || "",
            tenant_licensing_authority: tenant.licensing_authority || "",
            tenant_email: tenant.tenant_email || "",
            tenant_phone: tenant.tenant_phone || ""
        };
        
        setFormData(updatedFormData);
        setTenantSearchTerm(tenant.tenant_name || "");
        setShowTenantDropdown(false);
        updatePDFPreview(updatedFormData);
    };
    
    // Initialize dropdowns when they're first opened - modified to fetch 10 default results
    useEffect(() => {
        if (showOwnerDropdown) {
            // Fetch 10 default owners when the dropdown opens initially
            if (owners.length === 0) {
                handleFetchOwners(); // This will use the default filters with no search term
            }
        }
    }, [showOwnerDropdown, owners.length]);
    
    useEffect(() => {
        if (showTenantDropdown) {
            // Fetch 10 default tenants when the dropdown opens initially
            if (tenants.length === 0) {
                handleFetchTenants(); // This will use the default filters with no search term
            }
        }
    }, [showTenantDropdown, tenants.length]);

    const generatePDF = async () => {
        try {
            const existingPdfBytes = await fetch(
                "/TENANCY CONTRACT_Blank_Dynamic.pdf"
            ).then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            const field = form.getFields();
            field.forEach((field) => {
                console.log(field.getName());
            });
            form.getTextField("Text1")?.setText(formData.owner_name);
            form.getTextField("Text2")?.setText(formData.lessor_name);
            form.getTextField("Text3")?.setText(
                formData.lessor_emirates_id || ""
            );
            form.getTextField("Text4")?.setText(formData.ownerlicense_no || "");
            form.getTextField("Text5")?.setText(
                formData.owner_licensing_authority || ""
            );
            form.getTextField("Text6")?.setText(formData.lessor_email || "");
            form.getTextField("Text7")?.setText(formData.lessor_phone || "");
            form.getTextField("Text8")?.setText(formData.tenant_name || "");
            form.getTextField("Text9")?.setText(
                formData.tenant_emirates_id || ""
            );
            form.getTextField("Text10")?.setText(
                formData.tenantlicense_no || ""
            );
            form.getTextField("Text11")?.setText(
                formData.tenant_licensing_authority || ""
            );
            form.getTextField("Text12")?.setText(formData.tenant_email || "");
            form.getTextField("Text13")?.setText(formData.tenant_phone || "");
            form.getTextField("Text14")?.setText(formData.plot_no || "");
            form.getTextField("Text15")?.setText(formData.property_no || "");
            form.getTextField("Text18")?.setText(formData.property_type || "");
            form.getTextField("Text17")?.setText(formData.building_name || "");
            form.getTextField("Text19")?.setText(formData.Makani_no || "");
            form.getTextField("Text22")?.setText(formData.location || "");
            form.getTextField("Text23")?.setText(formData.property_area || "");
            form.getTextField("Text24")?.setText(formData.premises_no || "");
            form.getTextField("Text25")?.setText(
                formatDate(formData.agreement_period_from)
            );
            form.getTextField("Text27")?.setText(formData.agreement_value ? `${formData.agreement_value} AED` : "");
            form.getTextField("Text26")?.setText(formData.annual_rent ? `${formData.annual_rent} AED` : "");
            form.getTextField("Text28")?.setText(formData.security_deposit_amount ? `${formData.security_deposit_amount} AED` : "");
            form.getTextField("Text29")?.setText(formData.payment_mode || "");
            form.getTextField("Text43")?.setText(
                formData.additionalTerm1 || ""
            );
            form.getTextField("Text44")?.setText(
                formData.additionalTerm2 || ""
            );
            form.getTextField("Text45")?.setText(
                formData.additionalTerm3 || ""
            );
            form.getTextField("Text46")?.setText(
                formData.additionalTerm4 || ""
            );
            form.getTextField("Text47")?.setText(
                formData.additionalTerm5 || ""
            );
            form.getTextField("Date38_es_:signer:date")?.setText(
                formatDate(formData.agreement_period_to)
            );
            form.getTextField("Date32_es_:signer:date")?.setText(
                formatDate(formData.contract_date)
            );
            const group31Field = form.getRadioGroup("Group31");
            if (group31Field) {
                const propertyUsageMapping = {
                    Residential: "Choice2",
                    Commercial: "Choice1",
                    Industrial: "Choice3",
                };

                const valueToSelect =
                    propertyUsageMapping[formData.property_usage] || "Choice1";

                try {
                    group31Field.select(valueToSelect); // Select the appropriate radio button
                } catch (err) {
                    console.error("Error selecting radio button:", err.message);
                }
            } else {
                console.error('Radio group "Group31" not found in the PDF.');
            }

            // Add other field mappings...

            const fields = form.getFields();
            fields.forEach((field) => {
                field.enableReadOnly();
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Generated_Tenancy_Contract.pdf";
            link.click();
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    // Add a cleanup useEffect to handle URL revocation when component unmounts
    useEffect(() => {
        // This effect is specifically for cleaning up the blob URL when component unmounts
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
                console.log("PDF URL revoked on unmount");
            }
        };
    }, [pdfUrl]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navItems = [
        { label: 'Owner', href: '#owner' },
        { label: 'Tenant', href: '#tenant' },
        { label: 'Property', href: '#property' },
        { label: 'Contact', href: '#contact' },
        { label: 'T&C', href: '#term' }
      ];
    
const handelSave = ()=>{

   const payload = {
    ...formData,
    agreement_period_from: formData.agreement_period_from ? `${formData.agreement_period_from}T00:00:00Z` : null,
    agreement_period_to: formData.agreement_period_to ? `${formData.agreement_period_to}T00:00:00Z` : null,
    agreement_type:"tenancy"

};
    saveTanance(payload)
}
    return (
        <div className="sectionContainer">
        <SectionTop heading="Tenancy Contact Form" />
        <section className="sectionStyles">
        <>
      {/* <button 
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className={styles.menuButton}
      >
        {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}

      <nav className={`${styles.navbar} ${isDrawerOpen ? styles.open : ''}`} style={{ display: isdownload ? "none" : "block" }}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
           <a  key={item.label} href={item.href}>
             <li className={styles.navItem}>
              {item.label}
              <span className={styles.navItemUnderline} />
            </li>
           </a>
          ))}
        </ul>
      </nav>

      {isDrawerOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </>
        <div className={styles.mainContainer}>
       
            <div className={styles.formSection}   style={{ display: isdownload ? "none" : "block" }}>
                <div className={styles.formContainer}>

                    <h2 className={styles.title}>Tenant Information Form</h2>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.formGrid}>
 
                        <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Contract Date
                                </label>
                                <input
                                    type="date"
                                    name="contract_date"
                                    value={formData.contract_date || ""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            {/* Lessor Information */}
                            <h3 className={styles.sectionHeader} id="owner">
                                Owner/Lessor Information
                            </h3>
                            
                            {/* Owner Dropdown */}
                            <div className={styles.formGroup} ref={ownerDropdownRef}>
                                <label className={`${styles.label} ${styles.required}`}>
                                    Select Owner
                                </label>
                                <div className={styles.dropdownContainer}>
                                    <div className={styles.searchInputContainer}>
                                        <input
                                            type="text"
                                            placeholder="Search and select owner..."
                                            value={ownerSearchTerm}
                                            onChange={handleOwnerSearchChange}
                                            onFocus={() => setShowOwnerDropdown(true)}
                                            className={styles.searchInput}
                                        />
                                        <div 
                                            className={styles.searchIcon}
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            <Search size={16} />
                                        </div>
                                        {ownerSearchTerm && (
                                            <button 
                                                className={styles.clearButton}
                                                onClick={() => {
                                                    setOwnerSearchTerm("");
                                                    setOwners([]);
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {showOwnerDropdown && (
                                        <div className={styles.dropdown}>
                                            {loadingOwners ? (
                                                <div className={styles.dropdownItem}>Loading...</div>
                                            ) : owners.length > 0 ? (
                                                owners.map(owner => (
                                                    <div 
                                                        key={owner.id} 
                                                        className={styles.dropdownItem}
                                                        onClick={() => selectOwner(owner)}
                                                    >
                                                        <strong>{owner.owner_name}</strong>
                                                        <div className={styles.dropdownItemDetails}>
                                                            {owner.lessor_phone && `📞 ${owner.lessor_phone}`}
                                                            {owner.lessor_email && ` | ✉️ ${owner.lessor_email}`}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.dropdownItem}>
                                                    No owners found. Try a different search.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    className={`${styles.label} ${styles.required}`}
                                >
                                    Owner Name
                                </label>
                                <input
                                    type="text"
                                    name="owner_name"
                                    value={formData.owner_name ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label
                                    className={`${styles.label} ${styles.required}`}
                                >
                                    Lessor Name
                                </label>
                                <input
                                    type="text"
                                    name="lessor_name"
                                    value={formData.lessor_name ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Lessor Emirates ID
                                </label>
                                <input
                                    type="text"
                                    name="lessor_emirates_id"
                                    value={formData.lessor_emirates_id ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                     License No (Incase of a Company)
                                </label>
                                <input
                                    type="text"
                                    name="ownerlicense_no"
                                    value={formData.ownerlicense_no ||""} 
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                     Licensing Authority (Incase of a Company)
                                </label>
                                <input
                                    type="text"
                                    name="owner_licensing_authority"
                                    value={formData.owner_licensing_authority ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Owner Email
                                </label>
                                <input
                                    type="text"
                                    name="lessor_email"
                                    value={formData.lessor_email ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Owner Phone No.
                                </label>
                                <input
                                    type="text"
                                    name="lessor_phone"
                                    value={formData.lessor_phone ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <h3 className={styles.sectionHeader} id="tenant">
                                Tenant Information
                            </h3>
                            
                            {/* Tenant Dropdown */}
                            <div className={styles.formGroup} ref={tenantDropdownRef}>
                                <label className={`${styles.label} ${styles.required}`}>
                                    Select Tenant
                                </label>
                                <div className={styles.dropdownContainer}>
                                    <div className={styles.searchInputContainer}>
                                        <input
                                            type="text"
                                            placeholder="type to search and click on the tenant"
                                            value={tenantSearchTerm}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setTenantSearchTerm(value);
                                                if (value.trim()) {
                                                    handleTenantSearch();
                                                } else {
                                                    setTenants([]);
                                                }
                                            }}
                                            onFocus={() => setShowTenantDropdown(true)}
                                            className={styles.searchInput}
                                        />
                                        <div 
                                            className={styles.searchIcon}
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            <Search size={16} />
                                        </div>
                                        {tenantSearchTerm && (
                                            <button 
                                                className={styles.clearButton}
                                                onClick={() => {
                                                    setTenantSearchTerm("");
                                                    setTenants([]);
                                                }}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {showTenantDropdown && (
                                        <div className={styles.dropdown}>
                                            {loadingTenants ? (
                                                <div className={styles.dropdownItem}>Loading...</div>
                                            ) : tenants.length > 0 ? (
                                                tenants.map(tenant => (
                                                    <div 
                                                        key={tenant.id} 
                                                        className={styles.dropdownItem}
                                                        onClick={() => selectTenant(tenant)}
                                                    >
                                                        <strong>{tenant.tenant_name}</strong>
                                                        <div className={styles.dropdownItemDetails}>
                                                            {tenant.tenant_phone && `📞 ${tenant.tenant_phone}`}
                                                            {tenant.tenant_email && ` | ✉️ ${tenant.tenant_email}`}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.dropdownItem}>
                                                    No tenants found. Try a different search.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Tenant&apos;s Name
                                </label>
                                <input
                                    type="text"
                                    name="tenant_name"
                                    value={formData.tenant_name ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Tenant&apos;s Emirates ID
                                </label>
                                <input
                                    type="text"
                                    name="tenant_emirates_id"
                                    value={formData.tenant_emirates_id ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                     License No (Incase of a Company)
                                </label>
                                <input
                                    type="text"
                                    name="tenantlicense_no"
                                    value={formData.tenantlicense_no ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Licensing Authority (Incase of a Company)
                                </label>
                                <input
                                    type="text"
                                    name="tenant_licensing_authority"
                                    value={formData.tenant_licensing_authority ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Tenant&apos;s Email
                                </label>
                                <input
                                    type="text"
                                    name="tenant_email"
                                    value={formData.tenant_email ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Tenant&apos;s Phone No.
                                </label>
                                <input
                                    type="text"
                                    name="tenant_phone"
                                    value={formData.tenant_phone ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <h3 className={styles.sectionHeader} id="property">
                                Property Information{" "}
                            </h3>

                            <div className={styles.container}>
                                <label className={styles.label}>
                                    Property Usage
                                </label>
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioLabel}>
                                        <input
                                            className={styles.radioInput}
                                            type="radio"
                                            name="property_usage"
                                            value="Industrial"
                                            checked={
                                                formData.property_usage ===
                                                "Industrial"
                                            }
                                            onChange={handleInputChange}
                                        />
                                        Industrial
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            className={styles.radioInput}
                                            type="radio"
                                            name="property_usage"
                                            value="Commercial"
                                            checked={
                                                formData.property_usage ===
                                                "Commercial"
                                            }
                                            onChange={handleInputChange}
                                        />
                                        Commercial
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            className={styles.radioInput}
                                            type="radio"
                                            name="property_usage"
                                            value="Residential"
                                            checked={
                                                formData.property_usage ===
                                                "Residential"
                                            }
                                            onChange={handleInputChange}
                                        />
                                        Residential
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Plot No</label>
                                <input
                                    type="text"
                                    name="plot_no"
                                    value={formData.plot_no ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Makani No
                                </label>
                                <input
                                    type="text"
                                    name="Makani_no"
                                    value={formData.Makani_no ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Building Name
                                </label>
                                <input
                                    type="text"
                                    name="building_name"
                                    value={formData.building_name ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Property No
                                </label>
                                <input
                                    type="text"
                                    name="property_no"
                                    value={formData.property_no ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Property Type
                                </label>
                                <input
                                    type="text"
                                    name="property_type"
                                    value={formData.property_type ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Property Areas (Sq meter) <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="property_area"
                                    value={formData.property_area ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Premises No (DEWA )
                                </label>
                                <input
                                    type="text"
                                    name="premises_no"
                                    value={formData.premises_no ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>

                            <h3 className={styles.sectionHeader} id="contact">
                                Contract Information{" "}
                            </h3>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Contract Period From <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    name="agreement_period_from"
                                    value={formData.agreement_period_from ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Contract Period To <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    name="agreement_period_to"
                                    value={formData.agreement_period_to ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Payment Mode
                                </label>
                                <input
                                    type="text"
                                    name="payment_mode"
                                    value={formData.payment_mode ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Annual Rent <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    name="annual_rent"
                                    value={formData.annual_rent ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="Enter amount in AED"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Security Deposit Amount <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    name="security_deposit_amount"
                                    value={formData.security_deposit_amount ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="Enter amount in AED"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Contract Value (in AED) <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    name="agreement_value"
                                    value={formData.agreement_value ||""}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    required
                                    placeholder="Enter amount in AED"
                                />
                            </div>
                        </div>

                        <h3 className={styles.sectionHeader} id="term">
                            Addtional Term And Contition
                        </h3>

                        <div className={styles.additionalTerm}>
                            <label className={styles.label}>
                                Additional Term 1
                            </label>
                            <textarea
                                className={styles.textarea}
                                name="additionalTerm1"
                                value={formData.additionalTerm1 ||""} 
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.additionalTerm}>
                            <label className={styles.label}>
                                Additional Term 2
                            </label>
                            <textarea
                                className={styles.textarea}
                                name="additionalTerm2"
                                value={formData.additionalTerm2 ||""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.additionalTerm}>
                            <label className={styles.label}>
                                Additional Term 3
                            </label>
                            <textarea
                                className={styles.textarea}
                                name="additionalTerm3"
                                value={formData.additionalTerm3 ||""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.additionalTerm}>
                            <label className={styles.label}>
                                Additional Term 4
                            </label>
                            <textarea
                                className={styles.textarea}
                                name="additionalTerm4"
                                value={formData.additionalTerm4 ||""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.additionalTerm}>
                            <label className={styles.label}>
                                Additional Term 5
                            </label>
                            <textarea
                                className={styles.textarea}
                                name="additionalTerm5"
                                value={formData.additionalTerm5 ||""}
                                onChange={handleInputChange}
                            />
                        </div>
                     <div className={styles.buttonGroup}>
                     <button
                            type="button"
                            onClick={handelSave}
                            className={styles.button}
                            disabled={isPending}
                            
                        >
                            <Save className="w-5 h-5" />
                            Save
                        </button>
                     <button
                            type="button"
                            onClick={generatePDF}
                            className={styles.button}
                            
                        >
                            <FileDown className="w-5 h-5" />
                            Generate PDF
                        </button>
                    
                     </div>
                    </form>
                </div>
            </div>

            <div className={styles.previewSection}>
                <div className={styles.previewContainer}>
                    {isLoading && (
                        <div className={styles.previewLoading}>
                            Loading preview...
                        </div>
                    )}
                    {pdfUrl && (
                        <iframe
                            src={pdfUrl}
                            className={styles.previewFrame}
                            title="PDF Preview"
                        />
                    )}
                </div>
            </div>
        </div>
        </section>
        </div>
    );
};

export default TenancyContract;
