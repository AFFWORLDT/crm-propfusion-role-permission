import { useState, useEffect } from "react";
import { FileDown, Save } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import toast from "react-hot-toast";
import styles from "./TenancyContracts.module.css";
import SectionTop from "../../ui/SectionTop";
import useSaveTanance from "../../features/Contract/useSaveTanance";
import useAllDetails from "../../features/all-details/useAllDetails";
import { useSearchParams } from "react-router-dom";
import { useAgreements } from "../../features/Contract/useAgrement";

function AgentContract() {
    const [formData, setFormData] = useState({
        Image1_af_image: null,
        Name_of_Establishment: "",
        Address: "",
        POBox: "",
        Phone: "",
        Fax: "",
        Email: "",
        ORN: "",
        DEDLicense: "",
        NameRegisteredAgent: "",
        BRN: "",
        DateIssued: "",
        Mobile: "",
        EmailAgent: "",
        PropertyAddress: "",
        MasterDeveloper: "",
        MasterProject: "",
        BuildingName: "",
        ListedPrice: "",
        Name_of_EstablishmentB: "",
        AddressB: "",
        POBoxB: "",
        PhoneB: "",
        FaxB: "",
        EmailB: "",
        ORNB: "",
        DEDLicenseB: "",
        NameRegisteredAgentB: "",
        BRNB: "",
        DateIssuedB: "",
        MobileB: "",
        EmailAgentB: "",
        fsig_a: "",
        ssig_b: "",
        date: "",
        agenta: "",
        agentb: "",
        clientName: "",
        cemail: "",
        cwebsite: "",
        clocation: "",
        hasClientContactedListingAgent: "",
        isBuyer: false,
        isSeller: false,
        isLandlord: false,
        isTenant: false,
    });

    const { data: companyData } = useAllDetails();
    const [searchParams] = useSearchParams();
    const did = searchParams.get('id');
    const isdownload = did ? true : false;
    const { data, status } = useAgreements({ agreement_id: did });

    const [pdfUrl, setPdfUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log('AgentContract Debug:', { did, isdownload, data, status });

    useEffect(() => {
        if (status === "pending") {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
        if (data?.pages && data.pages.length > 0) {
            const pageData = data.pages[0];
            console.log('First page data:', pageData);
            
            let agreementData;
            if (pageData.agreements) {
                agreementData = Array.isArray(pageData.agreements) ? pageData.agreements : [pageData.agreements];
            } else if (pageData.data) {
                agreementData = Array.isArray(pageData.data) ? pageData.data : [pageData.data];
            } else {
                agreementData = [pageData];
            }
            
            console.log('Processed agreement data:', agreementData);
            
            if (!agreementData || agreementData.length === 0) {
                console.log('No agreements found in the response');
                return;
            }
            
            agreementData?.forEach((data) => {
                const mappedData = {
                    Name_of_Establishment: data.agent_a_name || "",
                    Address: data.agent_a_address || "",
                    POBox: data.agent_a_pobox || "",
                    Phone: data.agent_a_phone || "",
                    Fax: data.agent_a_fax || "",
                    Email: data.agent_a_email || "",
                    ORN: data.agent_a_orn || "",
                    DEDLicense: data.agent_a_ded_license || "",
                    NameRegisteredAgent: data.agent_a_registered_agent || "",
                    BRN: data.agent_a_brn || "",
                    DateIssued: data.agent_a_date_issued ? data.agent_a_date_issued.split('T')[0] : "",
                    Mobile: data.agent_a_mobile || "",
                    EmailAgent: data.agent_a_email || "",
                    
                    Name_of_EstablishmentB: data.agent_b_name || "",
                    AddressB: data.agent_b_address || "",
                    POBoxB: data.agent_b_pobox || "",
                    PhoneB: data.agent_b_phone || "",
                    FaxB: data.agent_b_fax || "",
                    EmailB: data.agent_b_email || "",
                    ORNB: data.agent_b_orn || "",
                    DEDLicenseB: data.agent_b_ded_license || "",
                    NameRegisteredAgentB: data.agent_b_registered_agent || "",
                    BRNB: data.agent_b_brn || "",
                    DateIssuedB: data.agent_b_date_issued ? data.agent_b_date_issued.split('T')[0] : "",
                    MobileB: data.agent_b_mobile || "",
                    EmailAgentB: data.agent_b_email || "",
                    
                    PropertyAddress: data.property_address || "",
                    MasterDeveloper: data.master_developer_name || "",
                    MasterProject: data.master_project_name || "",
                    BuildingName: data.building_name || "",
                    ListedPrice: data.agreement_value || "",
                    
                    clientName: data.client_name || "",
                    hasClientContactedListingAgent: data.client_contacted_listing_agent ? "Yes" : "No",
                    
                    agenta: data.agent_a_type || "",
                    agentb: data.agent_b_type || "",
                    
                    fsig_a: data.party_a_signature || "",
                    ssig_b: data.party_b_signature || "",
                    
                    date: data.created_at ? data.created_at.split('T')[0] : "",
                    
                    Image1_af_image: null,
                    cemail: "",
                    cwebsite: "",
                    clocation: "",
                    isBuyer: false,
                    isSeller: false,
                    isLandlord: false,
                    isTenant: false,
                };
                setFormData(mappedData);
                updatePDFPreview(mappedData);
            });
        }
    }, [data, status]);

    const handleInputChange = async (e) => {
        const { name, value, type, checked } = e.target;
        
        // Skip if the input is read-only
        if (e.target.readOnly) {
            return;
        }
        
        let newValue = value;
        if (type === "checkbox") {
            newValue = checked;
        } else if (name === "propertyType") {
            // Handle radio button group for property type
            const updatedData = {
                ...formData,
                isBuyer: value === "Buyer",
                isSeller: value === "Seller",
                isLandlord: value === "Landlord",
                isTenant: value === "Tenant",
            };
            setFormData(updatedData);
            await updatePDFPreview(updatedData);
            return;
        }
        
        const updatedData = {
            ...formData,
            [name]: newValue
        };
        
        setFormData(updatedData);
        
        // Update PDF preview in real-time
        await updatePDFPreview(updatedData);
    };

    useEffect(() => {
        if (companyData?.company_settings) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                cemail: companyData.company_settings.email || "",
                cwebsite: companyData.company_settings.website || "",
                clocation: companyData.company_settings.address || "",
            }));
        }
    }, [companyData]);

    const updatePDFPreview = async (currentFormData) => {
        try {
            setIsLoading(true);
            const existingPdfBytes = await fetch("/Agent.pdf").then((res) =>
                res.arrayBuffer()
            );
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            // Fetch and embed the company logo at a fixed position
            if (companyData?.company_settings?.company_logo_url) {
                try {
                    const imageUrl = companyData.company_settings.company_logo_url;
                    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

                    let image;
                    if (imageUrl.match(/\.(png)$/i)) {
                        image = await pdfDoc.embedPng(imageBytes);
                    } else if (imageUrl.match(/\.(jpe?g|jfif|pjpeg|pjp)$/i)) {
                        image = await pdfDoc.embedJpg(imageBytes);
                    } else {
                        throw new Error("Unsupported image format. Only PNG and JPG are supported.");
                    }
                    const page = pdfDoc.getPage(0);
                    const { width } = page.getSize();
                    
                    const imageDims = image.scale(1);
                    const maxWidth = 100;
                    const scaleFactor = Math.min(1, maxWidth / imageDims.width);
                    
                    const finalWidth = imageDims.width * scaleFactor;
                    const finalHeight = imageDims.height * scaleFactor;
                    
                    const x = (width - finalWidth) / 2;
                    const y = 735;
                    
                    page.drawImage(image, {
                        x,
                        y,
                        width: finalWidth,
                        height: finalHeight
                    });
                } catch (e) {
                    console.warn("Failed to embed company logo:", e);
                }
            } else {
                console.warn("No company logo URL provided");
            }

            const field = form.getFields();
            field.forEach((field) => {
                console.log(`Field: ${field.getName()}`);
            });
            
            const setTextField = (fieldName, value) => {
                try {
                    const field = form.getTextField(fieldName);
                    if (field) field.setText(String(value || ""));
                } catch (e) {
                    console.warn(`Could not find or set text field: ${fieldName}`);
                }
            };

            const setCheckbox = (fieldName, isChecked) => {
                try {
                    const checkbox = form.getCheckBox(fieldName);
                    if (checkbox) {
                        if (isChecked) checkbox.check();
                        else checkbox.uncheck();
                    }
                } catch (e) {
                    console.warn(`Could not find or set checkbox: ${fieldName}`);
                }
            };

            setTextField("DATE", currentFormData.date);

            // Agent A
            setTextField("Name of establishment- A", currentFormData.Name_of_Establishment);
            setTextField("Address of Agent A", currentFormData.Address);
            setTextField("PO - Agent A", currentFormData.POBox);
            setTextField("Phone - Agent A", currentFormData.Phone);
            setTextField("Fax - Agent A", currentFormData.Fax);
            setTextField("Email - Agent A", currentFormData.Email);
            setTextField("ORN - Agent A", currentFormData.ORN);
            setTextField("DED licence- Agent A", currentFormData.DEDLicense);
            setTextField("Name of Registered Agent A", currentFormData.NameRegisteredAgent);
            setTextField("BRN of Agent A", currentFormData.BRN);
            setTextField("Date Issued- Agent A", currentFormData.DateIssued);
            setTextField("Mobile - Agent A", currentFormData.Mobile);
            setTextField("Email _ Registered agent A", currentFormData.EmailAgent);

            // Agent B
            setTextField("Name of establishment - Agent B", currentFormData.Name_of_EstablishmentB);
            setTextField("ADDRESS - Agent B", currentFormData.AddressB);
            setTextField("PO - Agent B", currentFormData.POBoxB);
            setTextField("Phone - agent B", currentFormData.PhoneB);
            setTextField("Fax - Agent B", currentFormData.FaxB);
            setTextField("Email - Agent B", currentFormData.EmailB);
            setTextField("ORN - Agent B", currentFormData.ORNB);
            setTextField("DED License - Agent B", currentFormData.DEDLicenseB);
            setTextField("Name of registered Agent B", currentFormData.NameRegisteredAgentB);
            setTextField("BRN - Agent B", currentFormData.BRNB);
            setTextField("Date Issued - Agent B", currentFormData.DateIssuedB);
            setTextField("Mobile - Agent B", currentFormData.MobileB);
            setTextField("Email- Registered Agent B", currentFormData.EmailAgentB);

            // Property
            setTextField("Property address", currentFormData.PropertyAddress);
            setTextField("Master Developer", currentFormData.MasterDeveloper);
            setTextField("Master Project", currentFormData.MasterProject);
            setTextField("Building name", currentFormData.BuildingName);
            setTextField("Listed Price", currentFormData.ListedPrice);

            // Client
            setTextField("Clientss Name", currentFormData.clientName);
            setCheckbox("Yes check box", currentFormData.hasClientContactedListingAgent === "Yes");
            setCheckbox("No check box", currentFormData.hasClientContactedListingAgent === "No");

            // Commission
            setTextField("Agent A", currentFormData.agenta);
            setTextField("Agent B", currentFormData.agentb);

            // Property Type
            setCheckbox("Buyer Check Box", currentFormData.isBuyer);
            setCheckbox("Seller Check box", currentFormData.isSeller);
            setCheckbox("Landlord check box", currentFormData.isLandlord);
            setCheckbox("Tenant check box", currentFormData.isTenant);

            // Signatures
            setTextField("Party A", currentFormData.fsig_a);
            setTextField("Party B", currentFormData.ssig_b);

            // Company Info - Use API data if available, otherwise use form data
            const companyEmail = companyData?.company_settings?.email || currentFormData.cemail || "";
            const companyWebsite = companyData?.company_settings?.website || currentFormData.cwebsite || "";
            const companyLocation = companyData?.company_settings?.address || currentFormData.clocation || "";
            
            setTextField("Company email", companyEmail);
            setTextField("Company website", companyWebsite);
            setTextField("company location", companyLocation);

            // Finalize PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error updating PDF preview:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = async () => {
        try {
            setIsLoading(true);
            
            const existingPdfBytes = await fetch("/Agent.pdf").then((res) =>
                res.arrayBuffer()
            );
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            // Fetch and embed the company logo at a fixed position
            if (companyData?.company_settings?.company_logo_url) {
                try {
                    const imageUrl = companyData.company_settings.company_logo_url;
                    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

                    let image;
                    if (imageUrl.match(/\.(png)$/i)) {
                        image = await pdfDoc.embedPng(imageBytes);
                    } else if (imageUrl.match(/\.(jpe?g|jfif|pjpeg|pjp)$/i)) {
                        image = await pdfDoc.embedJpg(imageBytes);
                    } else {
                        throw new Error("Unsupported image format. Only PNG and JPG are supported.");
                    }
                    const page = pdfDoc.getPage(0);
                    const { width } = page.getSize();
                    
                    const imageDims = image.scale(1);
                    const maxWidth = 100;
                    const scaleFactor = Math.min(1, maxWidth / imageDims.width);
                    
                    const finalWidth = imageDims.width * scaleFactor;
                    const finalHeight = imageDims.height * scaleFactor;
                    
                    const x = (width - finalWidth) / 2;
                    const y = 735;
                    
                    page.drawImage(image, {
                        x,
                        y,
                        width: finalWidth,
                        height: finalHeight
                    });
                } catch (e) {
                    console.warn("Failed to embed company logo:", e);
                }
            }

            const setTextField = (fieldName, value) => {
                try {
                    const field = form.getTextField(fieldName);
                    if (field) field.setText(String(value || ""));
                } catch (e) {
                    console.warn(`Could not find or set text field: ${fieldName}`);
                }
            };

            const setCheckbox = (fieldName, isChecked) => {
                try {
                    const checkbox = form.getCheckBox(fieldName);
                    if (checkbox) {
                        if (isChecked) checkbox.check();
                        else checkbox.uncheck();
                    }
                } catch (e) {
                    console.warn(`Could not find or set checkbox: ${fieldName}`);
                }
            };

            setTextField("DATE", formData.date);

            // Agent A
            setTextField("Name of establishment- A", formData.Name_of_Establishment);
            setTextField("Address of Agent A", formData.Address);
            setTextField("PO - Agent A", formData.POBox);
            setTextField("Phone - Agent A", formData.Phone);
            setTextField("Fax - Agent A", formData.Fax);
            setTextField("Email - Agent A", formData.Email);
            setTextField("ORN - Agent A", formData.ORN);
            setTextField("DED licence- Agent A", formData.DEDLicense);
            setTextField("Name of Registered Agent A", formData.NameRegisteredAgent);
            setTextField("BRN of Agent A", formData.BRN);
            setTextField("Date Issued- Agent A", formData.DateIssued);
            setTextField("Mobile - Agent A", formData.Mobile);
            setTextField("Email _ Registered agent A", formData.EmailAgent);

            // Agent B
            setTextField("Name of establishment - Agent B", formData.Name_of_EstablishmentB);
            setTextField("ADDRESS - Agent B", formData.AddressB);
            setTextField("PO - Agent B", formData.POBoxB);
            setTextField("Phone - agent B", formData.PhoneB);
            setTextField("Fax - Agent B", formData.FaxB);
            setTextField("Email - Agent B", formData.EmailB);
            setTextField("ORN - Agent B", formData.ORNB);
            setTextField("DED License - Agent B", formData.DEDLicenseB);
            setTextField("Name of registered Agent B", formData.NameRegisteredAgentB);
            setTextField("BRN - Agent B", formData.BRNB);
            setTextField("Date Issued - Agent B", formData.DateIssuedB);
            setTextField("Mobile - Agent B", formData.MobileB);
            setTextField("Email- Registered Agent B", formData.EmailAgentB);

            // Property
            setTextField("Property address", formData.PropertyAddress);
            setTextField("Master Developer", formData.MasterDeveloper);
            setTextField("Master Project", formData.MasterProject);
            setTextField("Building name", formData.BuildingName);
            setTextField("Listed Price", formData.ListedPrice);

            // Client
            setTextField("Clientss Name", formData.clientName);
            setCheckbox("Yes check box", formData.hasClientContactedListingAgent === "Yes");
            setCheckbox("No check box", formData.hasClientContactedListingAgent === "No");

            // Commission
            setTextField("Agent A", formData.agenta);
            setTextField("Agent B", formData.agentb);

            // Property Type
            setCheckbox("Buyer Check Box", formData.isBuyer);
            setCheckbox("Seller Check box", formData.isSeller);
            setCheckbox("Landlord check box", formData.isLandlord);
            setCheckbox("Tenant check box", formData.isTenant);

            // Signatures
            setTextField("Party A", formData.fsig_a);
            setTextField("Party B", formData.ssig_b);

            // Company Info - Use API data if available, otherwise use form data
            const companyEmail = companyData?.company_settings?.email || formData.cemail || "";
            const companyWebsite = companyData?.company_settings?.website || formData.cwebsite || "";
            const companyLocation = companyData?.company_settings?.address || formData.clocation || "";
            
            setTextField("Company email", companyEmail);
            setTextField("Company website", companyWebsite);
            setTextField("company location", companyLocation);

            // Set all fields as read-only
            const fields = form.getFields();
            fields.forEach((field) => {
                field.enableReadOnly();
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Agent_to_Agent_Contract.pdf";
            link.click();
            
            // Clean up the URL
            setTimeout(() => {
                URL.revokeObjectURL(link.href);
            }, 100);
            
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const { saveTanance, isPending } = useSaveTanance();
    
    const handelSave = () => {
        // Get current form values directly from DOM
        const agentANameInput = document.querySelector('input[name="Name_of_Establishment"]');
        const agentAORNInput = document.querySelector('input[name="ORN"]');
        const agentBNameInput = document.querySelector('input[name="Name_of_EstablishmentB"]');
        const agentBORNInput = document.querySelector('input[name="ORNB"]');
        
        // Get values directly from DOM elements
        const agentAName = agentANameInput?.value || '';
        const agentAORN = agentAORNInput?.value || '';
        const agentBName = agentBNameInput?.value || '';
        const agentBORN = agentBORNInput?.value || '';
        
        // Validate required fields using DOM values
        const missingFields = [];
        
        if (!agentAName || agentAName.trim() === '') {
            missingFields.push("Agent A - Name of Establishment");
        }
        
        if (!agentAORN || agentAORN.trim() === '') {
            missingFields.push("Agent A - ORN");
        }
        
        if (!agentBName || agentBName.trim() === '') {
            missingFields.push("Agent B - Name of Establishment");
        }
        
        if (!agentBORN || agentBORN.trim() === '') {
            missingFields.push("Agent B - ORN");
        }
        
        if (missingFields.length > 0) {
            const errorMessage = `Please fill the following required fields:\n${missingFields.join('\n')}`;
            toast.error(errorMessage);
            return;
        }

        const formatDate = (dateString) => {
            if (!dateString || dateString.trim() === "") {
                return null;
            }
            return `${dateString}T00:00:00Z`;
        };

        // Helper function to convert string to number or null
        const parseNumber = (value) => {
            if (!value || value.trim() === '') return null;
            const num = parseFloat(value.replace(/[^\d.-]/g, ''));
            return isNaN(num) ? null : num;
        };

        // Helper function to clean string values
        const cleanString = (value) => {
            return value && value.trim() !== '' ? value.trim() : null;
        };

        // Get all form values from DOM
        const getFormValue = (fieldName) => {
            const input = document.querySelector(`input[name="${fieldName}"]`);
            return input?.value || '';
        };

        const payload = {
            master_developer_name: cleanString(getFormValue("MasterDeveloper")),
            master_project_name: cleanString(getFormValue("MasterProject")),
            agent_a_name: cleanString(agentAName),
            agent_a_establishment: cleanString(agentAName),
            agent_a_address: cleanString(getFormValue("Address")),
            agent_a_pobox: cleanString(getFormValue("POBox")),
            agent_a_phone: cleanString(getFormValue("Phone")),
            agent_a_fax: cleanString(getFormValue("Fax")),
            agent_a_email: cleanString(getFormValue("Email")),
            agent_a_orn: cleanString(agentAORN),
            agent_a_ded_license: cleanString(getFormValue("DEDLicense")),
            agent_a_registered_agent: cleanString(getFormValue("NameRegisteredAgent")),
            agent_a_brn: cleanString(getFormValue("BRN")),
            agent_a_date_issued: formatDate(getFormValue("DateIssued")),
            agent_a_mobile: cleanString(getFormValue("Mobile")),
            agent_b_name: cleanString(agentBName),
            agent_b_establishment: cleanString(agentBName),
            agent_b_address: cleanString(getFormValue("AddressB")),
            agent_b_pobox: cleanString(getFormValue("POBoxB")),
            agent_b_phone: cleanString(getFormValue("PhoneB")),
            agent_b_fax: cleanString(getFormValue("FaxB")),
            agent_b_email: cleanString(getFormValue("EmailB")),
            agent_b_orn: cleanString(agentBORN),
            agent_b_ded_license: cleanString(getFormValue("DEDLicenseB")),
            agent_b_registered_agent: cleanString(getFormValue("NameRegisteredAgentB")),
            agent_b_brn: cleanString(getFormValue("BRNB")),
            agent_b_date_issued: formatDate(getFormValue("DateIssuedB")),
            agent_b_mobile: cleanString(getFormValue("MobileB")),
            party_a_signature: cleanString(getFormValue("fsig_a")),
            party_b_signature: cleanString(getFormValue("ssig_b")),
            agent_a_type: cleanString(getFormValue("agenta")),
            agent_b_type: cleanString(getFormValue("agentb")),
            client_name: cleanString(getFormValue("clientName")),
            client_contacted_listing_agent: getFormValue("hasClientContactedListingAgent") === "Yes",
            declaration_by_agent_a: "",
            declaration_by_agent_b: "",
            agreement_type: "A2A",
            property_address: cleanString(getFormValue("PropertyAddress")),
            building_name: cleanString(getFormValue("BuildingName")),
            agreement_value: parseNumber(getFormValue("ListedPrice")),
        };

        try {
            saveTanance(payload);
            toast.success("Saving contract...");
        } catch (error) {
            console.error("Error saving contract:", error);
            toast.error("Failed to save contract");
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="AgentA And AgentB Contract" />
            <section className="sectionStyles">
                <div className={styles.mainContainer}>
                    <div className={styles.formSection} style={{ display: isdownload ? "none" : "block" }}>
                        <div className={styles.formContainer}>
                            <h2 className={styles.title}>
                                Agent to Agent Contract Form
                            </h2>

                            <form onSubmit={(e) => e.preventDefault()} id="agentContractForm">
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date || ""}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Agent A Information */}
                                    <h3 className={styles.sectionHeader} id="owner">
                                        Agent A
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={`${styles.label} ${styles.required}`}>
                                            Name of Establishment:
                                        </label>
                                        <input
                                            type="text"
                                            name="Name_of_Establishment"
                                            value={formData.Name_of_Establishment}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={`${styles.label} ${styles.required}`}>
                                            ORN
                                        </label>
                                        <input
                                            type="text"
                                            name="ORN"
                                            value={formData.ORN}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            P.O.BOX
                                        </label>
                                        <input
                                            type="text"
                                            name="POBox"
                                            value={formData.POBox}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Phone No.
                                        </label>
                                        <input
                                            type="text"
                                            name="Phone"
                                            value={formData.Phone}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="Address"
                                            value={formData.Address}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="Email"
                                            value={formData.Email}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Fax
                                        </label>
                                        <input
                                            type="text"
                                            name="Fax"
                                            value={formData.Fax}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            DED License:
                                        </label>
                                        <input
                                            type="text"
                                            name="DEDLicense"
                                            value={formData.DEDLicense}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Name of Registered Agent
                                        </label>
                                        <input
                                            type="text"
                                            name="NameRegisteredAgent"
                                            value={formData.NameRegisteredAgent}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            BRN
                                        </label>
                                        <input
                                            type="text"
                                            name="BRN"
                                            value={formData.BRN}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Date Issue
                                        </label>
                                        <input
                                            type="date"
                                            name="DateIssued"
                                            value={formData.DateIssued || ""}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="EmailAgent"
                                            value={formData.EmailAgent}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Mobile No.
                                        </label>
                                        <input
                                            type="text"
                                            name="Mobile"
                                            value={formData.Mobile}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Agent B Information */}
                                    <h3 className={styles.sectionHeader} id="owner">
                                        Agent B
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={`${styles.label} ${styles.required}`}>
                                            Name of Establishment:
                                        </label>
                                        <input
                                            type="text"
                                            name="Name_of_EstablishmentB"
                                            value={formData.Name_of_EstablishmentB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={`${styles.label} ${styles.required}`}>
                                            ORN
                                        </label>
                                        <input
                                            type="text"
                                            name="ORNB"
                                            value={formData.ORNB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            P.O.BOX
                                        </label>
                                        <input
                                            type="text"
                                            name="POBoxB"
                                            value={formData.POBoxB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Phone No.
                                        </label>
                                        <input
                                            type="text"
                                            name="PhoneB"
                                            value={formData.PhoneB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="AddressB"
                                            value={formData.AddressB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="EmailB"
                                            value={formData.EmailB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Fax
                                        </label>
                                        <input
                                            type="text"
                                            name="FaxB"
                                            value={formData.FaxB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            DED License:
                                        </label>
                                        <input
                                            type="text"
                                            name="DEDLicenseB"
                                            value={formData.DEDLicenseB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Name of Registered Agent
                                        </label>
                                        <input
                                            type="text"
                                            name="NameRegisteredAgentB"
                                            value={formData.NameRegisteredAgentB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            BRN
                                        </label>
                                        <input
                                            type="text"
                                            name="BRNB"
                                            value={formData.BRNB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Date Issue
                                        </label>
                                        <input
                                            type="date"
                                            name="DateIssuedB"
                                            value={formData.DateIssuedB || ""}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="EmailAgentB"
                                            value={formData.EmailAgentB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Mobile No.
                                        </label>
                                        <input
                                            type="text"
                                            name="MobileB"
                                            value={formData.MobileB}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Client Information */}
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Client Name
                                        </label>
                                        <input
                                            type="text"
                                            name="clientName"
                                            value={formData.clientName}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Has Client Contacted Listing Agent?
                                        </label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="hasClientContactedListingAgent"
                                                    value="Yes"
                                                    checked={formData.hasClientContactedListingAgent === "Yes"}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Yes
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="hasClientContactedListingAgent"
                                                    value="No"
                                                    checked={formData.hasClientContactedListingAgent === "No"}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                No
                                            </label>
                                        </div>
                                    </div>

                                    {/* Property Type */}
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Property Type</label>
                                        <div className={styles.radioGroup}>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="propertyType"
                                                    value="Buyer"
                                                    checked={formData.isBuyer}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Buyer
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="propertyType"
                                                    value="Seller"
                                                    checked={formData.isSeller}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Seller
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="propertyType"
                                                    value="Landlord"
                                                    checked={formData.isLandlord}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Landlord
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="propertyType"
                                                    value="Tenant"
                                                    checked={formData.isTenant}
                                                    onChange={handleInputChange}
                                                    className={styles.radioInput}
                                                />
                                                Tenant
                                            </label>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <h3 className={styles.sectionHeader} id="property">
                                        Property DETAILS
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Property Address
                                        </label>
                                        <input
                                            type="text"
                                            name="PropertyAddress"
                                            value={formData.PropertyAddress}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Master Developer
                                        </label>
                                        <input
                                            type="text"
                                            name="MasterDeveloper"
                                            value={formData.MasterDeveloper}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Master Project
                                        </label>
                                        <input
                                            type="text"
                                            name="MasterProject"
                                            value={formData.MasterProject}
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
                                            name="BuildingName"
                                            value={formData.BuildingName}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Listed Price
                                        </label>
                                        <input
                                            type="text"
                                            name="ListedPrice"
                                            value={formData.ListedPrice}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Commission */}
                                    <h3 className={styles.sectionHeader} id="term">
                                        THE COMMISSION (split) The following
                                        commission split is agreed between the 2
                                        agents.
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Agent A
                                        </label>
                                        <input
                                            type="text"
                                            name="agenta"
                                            value={formData.agenta}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Agent B
                                        </label>
                                        <input
                                            type="text"
                                            name="agentb"
                                            value={formData.agentb}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Signatures */}
                                    <h3 className={styles.sectionHeader} id="term">
                                        SIGNATURES
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Sign Agent A
                                        </label>
                                        <input
                                            type="text"
                                            name="fsig_a"
                                            value={formData.fsig_a}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Sign Agent B
                                        </label>
                                        <input
                                            type="text"
                                            name="ssig_b"
                                            value={formData.ssig_b}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    {/* Company Information - Auto-filled from API */}
                                    <h3 className={styles.sectionHeader} id="company">
                                        COMPANY INFORMATION
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Company Email
                                        </label>
                                        <input
                                            type="email"
                                            name="cemail"
                                            value={companyData?.company_settings?.email || formData.cemail || ""}
                                            readOnly
                                            className={`${styles.input} ${styles.readOnly}`}
                                            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Company Website
                                        </label>
                                        <input
                                            type="text"
                                            name="cwebsite"
                                            value={companyData?.company_settings?.website || formData.cwebsite || ""}
                                            readOnly
                                            className={`${styles.input} ${styles.readOnly}`}
                                            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Company Location
                                        </label>
                                        <input
                                            type="text"
                                            name="clocation"
                                            value={companyData?.company_settings?.address || formData.clocation || ""}
                                            readOnly
                                            className={`${styles.input} ${styles.readOnly}`}
                                            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <button
                                        type="button"
                                        onClick={handelSave}
                                        className={styles.button}
                                        disabled={isPending}
                                    >
                                        <Save className="w-5 h-5" />
                                        {isPending ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={generatePDF}
                                        className={styles.button}
                                        disabled={isLoading}
                                    >
                                        <FileDown className="w-5 h-5" />
                                        {isLoading ? "Generating..." : "Generate PDF"}
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
}

export default AgentContract;
