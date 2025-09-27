import { useState, useEffect } from "react";
import { FileDown, Save } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import styles from "./TenancyContracts.module.css";
import SectionTop from "../../ui/SectionTop";
import useSaveTanance from "../../features/Contract/useSaveTanance";
import { useAgreements } from "../../features/Contract/useAgrement";
import { useSearchParams } from "react-router-dom";

function LeaseContract() {
    const [formData, setFormData] = useState({
        agrm_no:"",
        orn: "",
        company_name: "",
        broker_name: "",
        brn: "",
        commerciallicense_no: "",
        broker_email: "",
        broker_phone: "",
        broker_address: "",
        broker_mobile: "",
        tenant_name: "",
        tenant_emirates_id: "",
        tenant_passportno: "",
        tenant_nationality: "",
        tenant_expiredate: "",
        tenant_pobox: "",
        tenant_email: "",
        tenant_phone: "",
        tenant_mobile: "",
        tenant_address: "",
        villaChecked: "",
        apartmentChecked: "",
        shopChecked: "",
        officeChecked: "",
        warehouseChecked: "",
        property_area: "",
        Approximate_rent: "",
        service_info: "",
        agreement_period_from: "",
        agreement_period_to: "",
        commission: "",
        paybyowner: "",
        paybytenes: "",
        or1: "",
        or2: "",
        contract_date: "",
        f_name: "",
        f_title: "",
        f_date: "",
        fsig_stap: "",
        s_name: "",
        s_title: "",
        s_date: "",
        ssig_stap: "",
    });
 
    const [pdfUrl, setPdfUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
const [searchParams] = useSearchParams();
    const did = searchParams.get('id');
   const isdownload = did ? true:false
const {data, status} = useAgreements({agreement_id:did});

useEffect(() => {
    if (status === "pending") {
        setIsLoading(true);  
    } else {
        setIsLoading(false); 
    }
    if (data?.pages && data.pages.length > 0) {
        const agreementData = data.pages[0].agreements;
        console.log(agreementData);
        agreementData?.forEach((data)=>{
            setFormData(data); 
            updatePDFPreview(data);
        })
       
    }
}, [data, status]);  
    const handleInputChange = async (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            const newFormData = {
                ...formData,
                [name]: checked,
            };

            setFormData(newFormData);
            await updatePDFPreview(newFormData);
        } else {
            const newFormData = {
                ...formData,
                [name]: value,
            };
            setFormData(newFormData);
            await updatePDFPreview(newFormData);
        }
    };

    const updatePDFPreview = async (currentFormData) => {
        try {
          setIsLoading(true);
          const existingPdfBytes = await fetch("/lease.pdf").then((res) =>
            res.arrayBuffer()
          );
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const form = pdfDoc.getForm();
      
          // Helper function to ensure all values are strings before setting text
          const setTextField = (fieldName, value) => {
            form.getTextField(fieldName)?.setText(String(value || ""));
          };
      
          // Setting all text fields with String conversion
          setTextField("Text1", currentFormData.orn);
          setTextField("Text2", currentFormData.company_name);
          setTextField("Text3", currentFormData.commerciallicense_no);
          setTextField("Text4", currentFormData.brn);
          setTextField("Text5", currentFormData.broker_name);
          setTextField("Text6", currentFormData.broker_mobile);
          setTextField("Text7", currentFormData.broker_phone);
          setTextField("Text8", currentFormData.agrm_no);
          setTextField("Text9", currentFormData.broker_address);
          setTextField("Text10", currentFormData.broker_email);
          setTextField("Text11", currentFormData.tenant_name);
          setTextField("Text12", currentFormData.tenant_emirates_id);
          setTextField("Text17", currentFormData.tenant_nationality);
          setTextField("Text13", currentFormData.tenant_expiredate);
          setTextField("Text16", currentFormData.tenant_passportno);
          setTextField("Text14", currentFormData.tenant_mobile);
          setTextField("Text15", currentFormData.tenant_pobox);
          setTextField("Text18", currentFormData.tenant_phone);
          setTextField("Text19", currentFormData.tenant_address);
          setTextField("Text20", currentFormData.tenant_email);
          setTextField("Text21", currentFormData.property_area);
          setTextField("Text22", currentFormData.Approximate_rent);
          setTextField("Text23", currentFormData.service_info);
          setTextField("Text27", currentFormData.commission);
          setTextField("Text28", currentFormData.f_name);
          setTextField("Text29", currentFormData.f_title);
          setTextField("Text30", currentFormData.s_name);
          setTextField("Text31", currentFormData.s_title);
          setTextField("Text33", currentFormData.fsig_stap);
          setTextField("Text32", currentFormData.ssig_stap);
          setTextField("Date39_af_date", currentFormData.agreement_period_from);
          setTextField("Date40_af_date", currentFormData.agreement_period_to);
          setTextField("Date41_af_date", currentFormData.f_date);
          setTextField("Date42_af_date", currentFormData.s_date);
          setTextField("To be Paid by Owner  Amount  AED", currentFormData.paybyowner);
          setTextField("To be Paid by Tenant  Amount  AED", currentFormData.paybytenes);
          setTextField("or", currentFormData.or1);
          setTextField("or_2", currentFormData.or2);
      
          // Setting checkbox values (ensure boolean or string 'check')
          form.getCheckBox("Check Box34")?.check(currentFormData.villaChecked);
          form.getCheckBox("Check Box35")?.check(currentFormData.apartmentChecked);
          form.getCheckBox("Check Box36")?.check(currentFormData.shopChecked);
          form.getCheckBox("Check Box37")?.check(currentFormData.officeChecked);
          form.getCheckBox("Check Box38")?.check(currentFormData.warehouseChecked);
      
          // Set all fields as read-only
          const fields = form.getFields();
          fields.forEach((field) => {
            field.enableReadOnly();
          });
      
          // Save the modified PDF
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
      
          // Revoke old URL and set the new one
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
          }
          setPdfUrl(url);
      
        } catch (error) {
          console.error("Error updating PDF preview:", error);
        } finally {
          setIsLoading(false);
        }
      };
      

    const generatePDF = async () => {
        try {
            const existingPdfBytes = await fetch("/lease.pdf").then((res) =>
                res.arrayBuffer()
            );
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            const field = form.getFields();
            field.forEach((field) => {
                console.log(field.getName());
            });
            await updatePDFPreview(formData);

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

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);
    const { saveTanance, isPending }=useSaveTanance()
    const handelSave = ()=>{

        const payload = {
         ...formData,
         agreement_period_from: formData.agreement_period_from ? `${formData.agreement_period_from}T00:00:00Z` : null,
         agreement_period_to: formData.agreement_period_to ? `${formData.agreement_period_to}T00:00:00Z` : null,
         agreement_type:"lease"
     
     };
     saveTanance(payload)
     }

    return (
        <div className="sectionContainer">
            <SectionTop heading="Lease Brokerage Contact Form" />
            <section className="sectionStyles">
                <div className={styles.mainContainer}>
                    <div className={styles.formSection}  style={{ display: isdownload ? "none" : "block" }}>
                        <div className={styles.formContainer} >
                            <h2 className={styles.title}>
                                Lease Information Form
                            </h2>

                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            Agrement No.
                                        </label>
                                        <input
                                            type="text"
                                            name="agrm_no"
                                            value={formData.agrm_no}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    {/* Lessor Information */}
                                    <h3
                                        className={styles.sectionHeader}
                                        id="owner"
                                    >
                                        BROKER DETAILS
                                    </h3>

                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            ORN
                                        </label>
                                        <input
                                            type="text"
                                            name="orn"
                                            value={formData.orn}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Commercial License Number
                                        </label>
                                        <input
                                            type="text"
                                            name="commerciallicense_no"
                                            value={
                                                formData.commerciallicense_no
                                            }
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
                                            name="brn"
                                            value={formData.brn}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Broker Name
                                        </label>
                                        <input
                                            type="text"
                                            name="broker_name"
                                            value={formData.broker_name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Broker Email
                                        </label>
                                        <input
                                            type="text"
                                            name="broker_email"
                                            value={formData.broker_email}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Broker Phone No.
                                        </label>
                                        <input
                                            type="text"
                                            name="broker_phone"
                                            value={formData.broker_phone}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Broker Address
                                        </label>
                                        <input
                                            type="text"
                                            name="broker_address"
                                            value={formData.broker_address}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Broker Mobile No.
                                        </label>
                                        <input
                                            type="text"
                                            name="broker_mobile"
                                            value={formData.broker_mobile}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <h3
                                        className={styles.sectionHeader}
                                        id="tenant"
                                    >
                                        Tenant DETAILS
                                    </h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Tenant’s Name
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_name"
                                            value={formData.tenant_name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Tenant’s Emirates ID
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_emirates_id"
                                            value={formData.tenant_emirates_id}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Nationality
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_nationality"
                                            value={formData.tenant_nationality}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            name="tenant_expiredate"
                                            value={formData.tenant_expiredate}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Passport No.
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_passportno"
                                            value={formData.tenant_passportno}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            P.O.BOX
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_pobox"
                                            value={formData.tenant_pobox}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Tenant’s Email
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_email"
                                            value={formData.tenant_email}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Tenant’s Phone No.
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_phone"
                                            value={formData.tenant_phone}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Tenant’s Mobile No.
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_mobile"
                                            value={formData.tenant_mobile}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Tenant’s Address
                                        </label>
                                        <input
                                            type="text"
                                            name="tenant_address"
                                            value={formData.tenant_address}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <h3
                                        className={styles.sectionHeader}
                                        id="property"
                                    >
                                        Property DETAILS{" "}
                                    </h3>
                                    <div className={styles.form_group}>
                                        <label>Property Type:</label>
                                        <div className={styles.checkbox_group}>
                                            {[
                                                "villa",
                                                "apartment",
                                                "shop",
                                                "office",
                                                "warehouse",
                                            ].map((propertyType) => (
                                                <label key={propertyType}>
                                                    <input
                                                        type="checkbox"
                                                        name={`${propertyType}Checked`} // Use individual checkbox names
                                                        checked={
                                                            formData[
                                                                `${propertyType}Checked`
                                                            ]
                                                        } // Access each checkbox state directly
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    {propertyType
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        propertyType.slice(
                                                            1
                                                        )}{" "}
                                                    {/* Capitalize the first letter */}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Approximate Rental budget
                                        </label>
                                        <input
                                            type="text"
                                            name="Approximate_rent"
                                            value={formData.Approximate_rent}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Property Areas
                                        </label>
                                        <input
                                            type="text"
                                            name="property_area"
                                            value={formData.property_area}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Services and General information
                                        </label>
                                        <input
                                            type="text"
                                            name="service_info"
                                            value={formData.service_info}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <h3
                                        className={styles.sectionHeader}
                                        id="contact"
                                    >
                                        Commission & period Agreement{" "}
                                    </h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Agreement Period From
                                        </label>
                                        <input
                                            type="date"
                                            name="agreement_period_from"
                                            value={
                                                formData.agreement_period_from
                                            }
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Agreement Period To
                                        </label>
                                        <input
                                            type="date"
                                            name="agreement_period_to"
                                            value={formData.agreement_period_to}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Commission
                                        </label>
                                        <input
                                            type="text"
                                            name="commission"
                                            value={formData.commission}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Paid by Owner
                                        </label>
                                        <input
                                            type="text"
                                            name="paybyowner"
                                            value={formData.paybyowner}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            OR1
                                        </label>
                                        <input
                                            type="text"
                                            name="or1"
                                            value={formData.or1}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Paid by Tenant
                                        </label>
                                        <input
                                            type="text"
                                            name="paybytenes"
                                            value={formData.paybytenes}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            OR2
                                        </label>
                                        <input
                                            type="text"
                                            name="or2"
                                            value={formData.or2}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <h3
                                        className={styles.sectionHeader}
                                        id="term"
                                    >
                                        SIGNATURE OF THE PARTIES (FIRST PARTY [
                                        THE BROKER OFFICE ])
                                    </h3>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="f_name"
                                            value={formData.f_name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="f_title"
                                            value={formData.f_title}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Sign
                                        </label>
                                        <input
                                            type="text"
                                            name="fsig_stap"
                                            value={formData.fsig_stap}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            date
                                        </label>
                                        <input
                                            type="date"
                                            name="f_date"
                                            value={formData.f_date}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <h3
                                        className={styles.sectionHeader}
                                        id="term"
                                    >
                                        SIGNATURE OF THE PARTIES (SECOND PARTY (
                                        Tenant ))
                                    </h3>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="s_name"
                                            value={formData.s_name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="s_title"
                                            value={formData.s_title}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Sign
                                        </label>
                                        <input
                                            type="text"
                                            name="ssig_stap"
                                            value={formData.ssig_stap}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            date
                                        </label>
                                        <input
                                            type="date"
                                            name="s_date"
                                            value={formData.s_date}
                                            onChange={handleInputChange}
                                            className={styles.input}
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
}

export default LeaseContract;
