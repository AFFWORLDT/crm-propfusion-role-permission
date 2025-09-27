import { useState, useEffect } from "react";
import { FileDown, Save } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import styles from "./TenancyContracts.module.css";
import SectionTop from "../../ui/SectionTop";
import useSaveTanance from "../../features/Contract/useSaveTanance";
import { useSearchParams } from "react-router-dom";
import { useAgreements } from "../../features/Contract/useAgrement";

function Owner() {
    const [formData, setFormData] = useState({
        agrm_no: "",
        orn: "",
        company_name: "",
        broker_name: "",
        brn: "",
        commerciallicense_no: "",
        broker_email: "",
        broker_phone: "",
        broker_address: "",
        broker_mobile: "",
        owner_name: "",
        owner_address: "",
        mobile: "",
        owner_emirates_id: "",
        lessor_email: "",
        lessor_phone: "",
        plot_no: "",
        status: "",
        building_no: "",
        AssociationNo: "",
        property_Name: "",
        parking_no: "",
        Makani_no: "",
        property_usage: "",
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
      
          // Fetch the PDF and load it
          const existingPdfBytes = await fetch(
            "/lease-brokerage-agreement-between-the-owner-and-broker.pdf"
          ).then((res) => res.arrayBuffer());
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const form = pdfDoc.getForm();
      
          // Helper function to ensure all values are strings
          const setTextField = (fieldName, value) => {
            form.getTextField(fieldName)?.setText(String(value || ""));
          };
      
          // Set text fields with the correct values (ensuring string conversion)
          setTextField("Text36", currentFormData.owner_name);
          setTextField("Text37", currentFormData.mobile);
          setTextField("Text39", currentFormData.owner_emirates_id);
          setTextField("Text40", currentFormData.owner_address);
          setTextField("Text41", currentFormData.lessor_email);
          setTextField("Text38", currentFormData.lessor_phone);
          setTextField("Text42", currentFormData.orn);
      
          setTextField("Text43", currentFormData.company_name);
          setTextField("Text44", currentFormData.commerciallicense_no);
          setTextField("Text45", currentFormData.brn);
          setTextField("Text50", currentFormData.broker_name);
          setTextField("Text46", currentFormData.broker_mobile);
          setTextField("Text49", currentFormData.broker_phone);
          setTextField("Text47", currentFormData.broker_address);
          setTextField("Text48", currentFormData.broker_email);
          setTextField("Text51", currentFormData.status);
          setTextField("Text52", currentFormData.plot_no);
          setTextField("Text54", currentFormData.Makani_no);
          setTextField("Text60", currentFormData.AssociationNo);
          setTextField("Text53", currentFormData.property_area);
          setTextField("Text57", currentFormData.building_no);
          setTextField("Text55", currentFormData.property_Name);
          setTextField("Text58", currentFormData.parking_no);
          setTextField("Text56", currentFormData.Approximate_rent);
          setTextField("Text59", currentFormData.service_info);
      
          setTextField("2", currentFormData.commission);
          setTextField("Text63", currentFormData.f_name);
          setTextField("Text64", currentFormData.f_title);
          setTextField("Text67", currentFormData.s_name);
          setTextField("Text68", currentFormData.s_title);
          setTextField("Text66", currentFormData.fsig_stap);
          setTextField("Text70", currentFormData.ssig_stap);
          setTextField("fill_1", currentFormData.agrm_no);
          setTextField("Text61", currentFormData.agreement_period_from);
          setTextField("Text62", currentFormData.agreement_period_to);
          setTextField("Text65", currentFormData.f_date);
          setTextField("Text69", currentFormData.s_date);
          setTextField("To be Paid by Owner  Amount  AED", currentFormData.paybyowner);
          setTextField("To be Paid by Tenant  Amount  AED", currentFormData.paybytenes);
          setTextField("or", currentFormData.or1);
          setTextField("or_2", currentFormData.or2);
      
          // Set all fields as read-only
          const fields = form.getFields();
          fields.forEach((field) => {
            field.enableReadOnly();
          });
      
          // Save the modified PDF and create a download URL
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
      
          // Revoke previous URL and update the state with the new one
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
            const existingPdfBytes = await fetch(
                "/lease-brokerage-agreement-between-the-owner-and-broker.pdf"
            ).then((res) => res.arrayBuffer());
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
         agreement_type:"owner"
     
     };
     saveTanance(payload)
     }
    return (
        <div className="sectionContainer">
            <SectionTop heading="Lease Brokerage Contact Form" />
            <section className="sectionStyles">
                <div className={styles.mainContainer}>
                    <div className={styles.formSection} style={{ display: isdownload ? "none" : "block" }}>
                        <div className={styles.formContainer}>
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
                                        id="tenant"
                                    >
                                        Owner DETAILS
                                    </h3>

                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            Owner Name
                                        </label>
                                        <input
                                            type="text"
                                            name="owner_name"
                                            value={formData.owner_name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label
                                            className={`${styles.label} ${styles.required}`}
                                        >
                                            Mobile no.
                                        </label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Emirates ID
                                        </label>
                                        <input
                                            type="text"
                                            name="owner_emirates_id"
                                            value={formData.owner_emirates_id}
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
                                            name="owner_address"
                                            value={formData.owner_address}
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
                                            value={formData.lessor_email}
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
                                            value={formData.lessor_phone}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

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
                                        id="property"
                                    >
                                        Property DETAILS{" "}
                                    </h3>
                                    {/* <div className={styles.form_group}>
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
                                                                                      
                                                                                   </label>
                                                                               ))}
                                                                           </div>
                                                                       </div>
                                   
                                                                       <div className={styles.container}>
                                                                           <label className={styles.label}>
                                                                               Property Usage
                                                                           </label>
                                                                           <div className={styles.radioGroup}>
                                                                               <label
                                                                                   className={styles.radioLabel}
                                                                               >
                                                                                   <input
                                                                                       className={
                                                                                           styles.radioInput
                                                                                       }
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
                                                                               <label
                                                                                   className={styles.radioLabel}
                                                                               >
                                                                                   <input
                                                                                       className={
                                                                                           styles.radioInput
                                                                                       }
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
                                                                               <label
                                                                                   className={styles.radioLabel}
                                                                               >
                                                                                   <input
                                                                                       className={
                                                                                           styles.radioInput
                                                                                       }
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
                                                                       </div> */}

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Plot No
                                        </label>
                                        <input
                                            type="text"
                                            name="plot_no"
                                            value={formData.plot_no}
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
                                            value={formData.Makani_no}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Building No
                                        </label>
                                        <input
                                            type="text"
                                            name="building_no"
                                            value={formData.building_no}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Project Name
                                        </label>
                                        <input
                                            type="text"
                                            name="property_Name"
                                            value={formData.property_Name}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Association No
                                        </label>
                                        <input
                                            type="text"
                                            name="AssociationNo"
                                            value={formData.AssociationNo}
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
                                            status
                                        </label>
                                        <input
                                            type="text"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            Parking No
                                        </label>
                                        <input
                                            type="text"
                                            name="parking_no"
                                            value={formData.parking_no}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                        />
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

export default Owner;
