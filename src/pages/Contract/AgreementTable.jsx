import React from 'react';
import styles from './AgreementTable.module.css';
import SectionTop from '../../ui/SectionTop';
import useAllDetails from '../../features/all-details/useAllDetails';
import { useAgreements } from '../../features/Contract/useAgrement'; 
import { useInView } from 'react-intersection-observer';
import { AlertCircle, Briefcase, Building, Eye, FileText, Home, Loader2, Printer, Trash2, User } from 'lucide-react';
import { DeleteModal } from '../../features/SmtpSetting/DeleteModal';
import { useNavigate } from 'react-router-dom';
import useDeleteContract from '../../features/Contract/useDelete';
import { PDFDocument } from "pdf-lib";

const AgreementTable = () => {
  const { data: companyData } = useAllDetails();
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const navigate=useNavigate()
  const handleView = (id) => {
    // Handle view action
    setActiveDropdown(null);
  };
  const { ref, inView } = useInView();
      const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
      const [Id, setId] = React.useState(null);
     const { deleteing, isPending }=useDeleteContract()
      const [activeTab, setActiveTab] = React.useState('all');

      const contracts = [
        {
          id: 'all',
          title: "All Contracts",
          icon: <FileText size={28} color="#3B82F6" />,
        },
        {
          id: 'tenancy',
          title: "Tenancy Contract",
          icon: <Home size={28} color="#3B82F6" />,
        },
        {
          id: 'lease',
          title: "Lease-contract",
          icon: <Briefcase size={28} color="#9CA3AF" />,
        },
        {
          id: 'propertyview',
          title: "Property View Contract",
          icon: <Building size={28} color="#9CA3AF" />,
        },
        {
          id: 'owner',
          title: "Owner-and-Broker",
          icon: <FileText size={28} color="#9CA3AF" />,
        },
        {
          id: 'A2A',
          title: "Agent 2 Agent",
          icon: <User size={28} color="#9CA3AF" />,
        }
      ];

      // New function to directly print and download PDF
      const printAndDownloadContract = async (agreement) => {
        if (!agreement?.id) {
          console.error('Agreement ID is missing');
          return;
        }
      
        console.log('Printing and downloading PDF for agreement:', agreement);
        
        setIsGeneratingPdf(true);
      
        try {
          // Use the agreement data directly since we already have it
          const agreementData = agreement;
          
          let pdfTemplate = '';
          let fileName = '';
          
          // Determine PDF template based on agreement type
          switch (agreement.agreement_type) {
            case 'tenancy':
              pdfTemplate = "/TENANCY CONTRACT_Blank_Dynamic.pdf";
              fileName = "Tenancy_Contract.pdf";
              break;
            case 'lease':
              pdfTemplate = "/lease-brokerage-agreement-between-the-owner-and-broker.pdf";
              fileName = "Lease_Contract.pdf";
              break;
            case 'propertyview':
              pdfTemplate = "/property-viewing-agreement.pdf";
              fileName = "Property_View_Contract.pdf";
              break;
            case 'owner':
              pdfTemplate = "/lease-brokerage-agreement-between-the-owner-and-broker.pdf";
              fileName = "Owner_Broker_Contract.pdf";
              break;
            case 'A2A':
              pdfTemplate = "/Agent.pdf";
              fileName = "Agent_to_Agent_Contract.pdf";
              break;
            default:
              throw new Error('Unknown agreement type');
          }
          
          // Load PDF template
          const existingPdfBytes = await fetch(pdfTemplate).then((res) => res.arrayBuffer());
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          const form = pdfDoc.getForm();
          
          // Add company logo for Agent 2 Agent contracts
          if (agreement.agreement_type === 'A2A' && companyData?.company_settings?.company_logo_url) {
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
              
              // Get image dimensions while maintaining aspect ratio
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
          
          // Fill PDF with agreement data based on type
          if (agreement.agreement_type === 'A2A') {
            // Add helper function for date formatting
            const formatDateForPdf = (dateString) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            };

            // Agent to Agent contract fields
            const setTextField = (fieldName, value) => {
              try {
                const field = form.getTextField(fieldName);
                if (field) field.setText(String(value || ""));
              } catch (e) {
                console.warn(`Could not find or set text field: ${fieldName}`);
              }
            };
            
            setTextField("DATE", formatDateForPdf(agreement.created_at));
            setTextField("Name of establishment- A", agreement.agent_a_name || "");
            setTextField("Address of Agent A", agreement.agent_a_address || "");
            setTextField("PO - Agent A", agreement.agent_a_pobox || "");
            setTextField("Phone - Agent A", agreement.agent_a_phone || "");
            setTextField("Fax - Agent A", agreement.agent_a_fax || "");
            setTextField("Email - Agent A", agreement.agent_a_email || "");
            setTextField("ORN - Agent A", agreement.agent_a_orn || "");
            setTextField("DED licence- Agent A", agreement.agent_a_ded_license || "");
            setTextField("Name of Registered Agent A", agreement.agent_a_registered_agent || "");
            setTextField("BRN of Agent A", agreement.agent_a_brn || "");
            setTextField("Date Issued- Agent A", formatDateForPdf(agreement.agent_a_date_issued));
            setTextField("Mobile - Agent A", agreement.agent_a_mobile || "");
            setTextField("Email _ Registered agent A", agreement.agent_a_email || "");
            
            setTextField("Name of establishment - Agent B", agreement.agent_b_name || "");
            setTextField("ADDRESS - Agent B", agreement.agent_b_address || "");
            setTextField("PO - Agent B", agreement.agent_b_pobox || "");
            setTextField("Phone - agent B", agreement.agent_b_phone || "");
            setTextField("Fax - Agent B", agreement.agent_b_fax || "");
            setTextField("Email - Agent B", agreement.agent_b_email || "");
            setTextField("ORN - Agent B", agreement.agent_b_orn || "");
            setTextField("DED License - Agent B", agreement.agent_b_ded_license || "");
            setTextField("Name of registered Agent B", agreement.agent_b_registered_agent || "");
            setTextField("BRN - Agent B", agreement.agent_b_brn || "");
            setTextField("Date Issued - Agent B", formatDateForPdf(agreement.agent_b_date_issued));
            setTextField("Mobile - Agent B", agreement.agent_b_mobile || "");
            setTextField("Email- Registered Agent B", agreement.agent_b_email || "");
            
            setTextField("Property address", agreement.property_address || "");
            setTextField("Master Developer", agreement.master_developer_name || "");
            setTextField("Master Project", agreement.master_project_name || "");
            setTextField("Building name", agreement.building_name || "");
            setTextField("Listed Price", agreement.agreement_value || "");
            
            setTextField("Clientss Name", agreement.client_name || "");
            
            setTextField("Agent A", agreement.agent_a_type || "");
            setTextField("Agent B", agreement.agent_b_type || "");
            
            setTextField("Party A", agreement.party_a_signature || "");
            setTextField("Party B", agreement.party_b_signature || "");
            
            setTextField("Company email", "propfusion@gmail.com");
            setTextField("Company website", "propfusion.in");
            setTextField("company location", "Prop Fusion ltd , Sector 17, Dubai");
            
          } else if (agreement.agreement_type === 'tenancy') {
            // Add helper function for date formatting
            const formatDateForPdf = (dateString) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            };

            // Tenancy contract fields
            const setTextField = (fieldName, value) => {
              try {
                const field = form.getTextField(fieldName);
                if (field) field.setText(String(value || ""));
              } catch (e) {
                console.warn(`Could not find or set text field: ${fieldName}`);
              }
            };
            
            setTextField("Text1", agreement.owner_name || "");
            setTextField("Text2", agreement.lessor_name || "");
            setTextField("Text3", agreement.lessor_emirates_id || "");
            setTextField("Text4", agreement.ownerlicense_no || "");
            setTextField("Text5", agreement.owner_licensing_authority || "");
            setTextField("Text6", agreement.lessor_email || "");
            setTextField("Text7", agreement.lessor_phone || "");
            setTextField("Text8", agreement.tenant_name || "");
            setTextField("Text9", agreement.tenant_emirates_id || "");
            setTextField("Text10", agreement.tenantlicense_no || "");
            setTextField("Text11", agreement.tenant_licensing_authority || "");
            setTextField("Text12", agreement.tenant_email || "");
            setTextField("Text13", agreement.tenant_phone || "");
            setTextField("Text14", agreement.plot_no || "");
            setTextField("Text15", agreement.property_no || "");
            setTextField("Text17", agreement.building_name || "");
            setTextField("Text18", agreement.property_type || "");
            setTextField("Text19", agreement.Makani_no || "");
            setTextField("Text22", agreement.location || "");
            setTextField("Text23", agreement.property_area || "");
            setTextField("Text24", agreement.premises_no || "");
            setTextField("Text25", formatDateForPdf(agreement.agreement_period_from));
            setTextField("Text26", agreement.annual_rent || "");
            setTextField("Text27", agreement.agreement_value || "");
            setTextField("Text28", agreement.security_deposit_amount || "");
            setTextField("Text29", agreement.payment_mode || "");
            setTextField("Date32_es_:signer:date", formatDateForPdf(agreement.contract_date));
            setTextField("Text43", agreement.additionalTerm1 || "");
            setTextField("Text44", agreement.additionalTerm2 || "");
            setTextField("Text45", agreement.additionalTerm3 || "");
            setTextField("Text46", agreement.additionalTerm4 || "");
            setTextField("Text47", agreement.additionalTerm5 || "");
            setTextField("Date38_es_:signer:date", formatDateForPdf(agreement.agreement_period_to));
            
          } else if (agreement.agreement_type === 'owner') {
            // Add helper function for date formatting
            const formatDateForPdf = (dateString) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            };

            // Owner contract fields
            const setTextField = (fieldName, value) => {
              try {
                const field = form.getTextField(fieldName);
                if (field) field.setText(String(value || ""));
              } catch (e) {
                console.warn(`Could not find or set text field: ${fieldName}`);
              }
            };
            
            setTextField("Text36", agreement.owner_name || "");
            setTextField("Text37", agreement.mobile || "");
            setTextField("Text39", agreement.owner_emirates_id || "");
            setTextField("Text40", agreement.owner_address || "");
            setTextField("Text41", agreement.lessor_email || "");
            setTextField("Text38", agreement.lessor_phone || "");
            setTextField("Text42", agreement.orn || "");
            setTextField("Text43", agreement.company_name || "");
            setTextField("Text44", agreement.commerciallicense_no || "");
            setTextField("Text45", agreement.brn || "");
            setTextField("Text50", agreement.broker_name || "");
            setTextField("Text46", agreement.broker_mobile || "");
            setTextField("Text49", agreement.broker_phone || "");
            setTextField("Text47", agreement.broker_address || "");
            setTextField("Text48", agreement.broker_email || "");
            setTextField("Text51", agreement.status || "");
            setTextField("Text52", agreement.plot_no || "");
            setTextField("Text54", agreement.Makani_no || "");
            setTextField("Text60", agreement.AssociationNo || "");
            setTextField("Text53", agreement.property_area || "");
            setTextField("Text57", agreement.building_no || "");
            setTextField("Text55", agreement.property_Name || "");
            setTextField("Text58", agreement.parking_no || "");
            setTextField("Text56", agreement.Approximate_rent || "");
            setTextField("Text59", agreement.service_info || "");
            setTextField("2", agreement.commission || "");
            setTextField("Text63", agreement.f_name || "");
            setTextField("Text64", agreement.f_title || "");
            setTextField("Text67", agreement.s_name || "");
            setTextField("Text68", agreement.s_title || "");
            setTextField("Text66", agreement.fsig_stap || "");
            setTextField("Text70", agreement.ssig_stap || "");
            setTextField("fill_1", agreement.agrm_no || "");
            setTextField("Text61", formatDateForPdf(agreement.agreement_period_from));
            setTextField("Text62", formatDateForPdf(agreement.agreement_period_to));
            setTextField("Text65", formatDateForPdf(agreement.f_date));
            setTextField("Text69", formatDateForPdf(agreement.s_date));
            setTextField("To be Paid by Owner  Amount  AED", agreement.paybyowner || "");
            setTextField("To be Paid by Tenant  Amount  AED", agreement.paybytenes || "");
            setTextField("or", agreement.or1 || "");
            setTextField("or_2", agreement.or2 || "");
          }
          
          // Set all fields as read-only
          const fields = form.getFields();
          fields.forEach((field) => {
            field.enableReadOnly();
          });
          
          // Generate PDF bytes
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          
          // Create URL for the blob
          const url = URL.createObjectURL(blob);
          
          // Create iframe for printing
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = url;
          document.body.appendChild(iframe);
          
          iframe.onload = () => {
            try {
              // Print the PDF
              iframe.contentWindow.print();
              
              // Also trigger download
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
              
              // Clean up after a delay
              setTimeout(() => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(url);
              }, 2000);
              
              // Show success message
              console.log(`PDF generated successfully: ${fileName}`);
            } catch (error) {
              console.error("Error printing:", error);
              // Fallback: just download
              const link = document.createElement("a");
              link.href = url;
              link.download = fileName;
              link.click();
              
              setTimeout(() => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(url);
              }, 1000);
              
              // Show success message for download
              console.log(`PDF downloaded successfully: ${fileName}`);
            }
          };
          
        } catch (error) {
          console.error("Error printing and downloading contract:", error);
          
          // Show more specific error messages
          let errorMessage = "Error generating PDF. Please try again.";
          if (error.message.includes("Failed to fetch")) {
            errorMessage = "Unable to load PDF template. Please check your internet connection.";
          } else if (error.message.includes("Unknown agreement type")) {
            errorMessage = "Unsupported contract type. Please contact support.";
          } else if (error.message.includes("Unsupported image format")) {
            errorMessage = "Company logo format not supported. Please use PNG or JPG.";
          }
          
          alert(errorMessage);
        } finally {
          setIsGeneratingPdf(false);
        }
      };

      const downloadPdf = (agreement) => {
        if (!agreement?.id) {
          console.error('Agreement ID is missing');
          return;
        }
      
        console.log('Printing and downloading PDF for agreement:', agreement);
        
        // Use the new function to directly print and download
        printAndDownloadContract(agreement);
      };

      const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
      } = useAgreements({
        agreement_type: activeTab === 'all' 
          ? undefined
          : activeTab
      });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const formatDate = (dateString) => {
    if (!dateString) return <span className={styles.placeholder}>-</span>;
    return (
      <span className={styles.dateValue}>
        {new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit'
        })}
      </span>
    );
  };
  const handleDelete = (id) => {
    setId(id);
    setDeleteModalOpen(true);
};

const handleConfirmDelete = () => {
  deleteing(Id)
    setDeleteModalOpen(false);
    setId(null);
};

 

  const formatCurrency = (value) => {
    if (!value) return <span className={styles.placeholder}>-</span>;
    return (
      <span className={styles.currencyValue}>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'AED',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)}
      </span>
    );
  };

  const handleEdit = (id) => {
    console.log(`Edit agreement with ID: ${id}`);
  };

  if (status === 'pending') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.loadingState}>
          <Loader2 className={styles.loadingIcon} />
          <p className={styles.statusMessage}>Loading agreements...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.errorState}>
          <AlertCircle className={styles.errorIcon} />
          <p className={styles.statusMessage}>Unable to load agreements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sectionContainer">
      <SectionTop heading="Contract Table" />
      
      <div className="sectionStyles">
      <div className={styles.tabContainer}>
        {contracts.map((contract) => (
          <button
            key={contract.id}
            className={`${styles.tabButton} ${activeTab === contract.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(contract.id)}
          >
            <span className={styles.tabIcon}>{contract.icon}</span>
            <span className={styles.tabTitle}>{contract.title}</span>
          </button>
        ))}
      </div>
        <div className={styles.container}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader} style={{
                background: companyData?.company_settings?.sidebar_color_code || "#020079",
              }}>
                <tr>
                  <th className={styles.tableHeaderCell}>Contract ID</th>
                  <th className={styles.tableHeaderCell}>
                    {activeTab === 'A2A' ? 'Agent A' : 'Owner'}
                  </th>
                  <th className={styles.tableHeaderCell}>
                    {activeTab === 'A2A' ? 'Agent B' : 'Tenant'}
                  </th>
                  <th className={styles.tableHeaderCell}>
                    {activeTab === 'A2A' ? 'Client' : 'Property Details'}
                  </th>
                  <th className={styles.tableHeaderCell}>Contract Value</th>
                  <th className={styles.tableHeaderCell}>End Date</th>
                  <th className={styles.tableHeaderCell}>Security Deposit</th>
                  <th className={styles.tableHeaderCell}>Annual Rent</th>
                  <th className={styles.tableHeaderCell}>Agreement Type</th>
                  <th className={styles.tableHeaderCell}>Created Info</th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.pages?.map((page) => (
                  page?.agreements?.map((agreement) => (
                    <tr key={agreement.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>{agreement.id}</td>
                      <td className={styles.tableCell}>
                        {agreement.agreement_type === 'A2A' ? (
                          agreement.agent_a_name || <span className={styles.placeholder}>-</span>
                        ) : (
                          agreement.owner_name || <span className={styles.placeholder}>-</span>
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        {agreement.agreement_type === 'A2A' ? (
                          agreement.agent_b_name || <span className={styles.placeholder}>-</span>
                        ) : (
                          agreement.tenant_name || <span className={styles.placeholder}>-</span>
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        {agreement.agreement_type === 'A2A' ? (
                          agreement.client_name ? (
                            <span className={styles.propertyTypeBadge}>
                              Client: {agreement.client_name}
                            </span>
                          ) : (
                            <span className={styles.placeholder}>-</span>
                          )
                        ) : (
                          agreement.property_type || agreement.property_area ? (
                            <span className={styles.propertyTypeBadge}>
                              {agreement.property_type}
                              {agreement.property_area}
                            </span>
                          ) : (
                            <span className={styles.placeholder}>-</span>
                          )
                        )}
                      </td>
                      <td className={styles.tableCell}>
                        {formatCurrency(agreement.agreement_value)}
                      </td>
                      <td className={styles.tableCell}>
                        {formatDate(agreement.agreement_period_to)}
                      </td>
                     
                      <td className={styles.tableCell}>
                        {formatCurrency(agreement.security_deposit_amount)}
                      </td>
                      <td className={styles.tableCell}>
                        {formatCurrency(agreement.annual_rent)}
                      </td>
                      <td className={styles.tableCell}>
                        {agreement.agreement_type ? (
                          <span className={styles.agreementTypeBadge}>
                            {agreement.agreement_type==="tenancy" && ("Tenancy Contract")}
                            {agreement.agreement_type==="lease" && ("Lease Contract")}
                            {agreement.agreement_type==="propertyview" && ("Property  Contract")}
                            {agreement.agreement_type==="owner" && ("Owner Contract")}
                            {agreement.agreement_type==="A2A" && ("Agent 2 Agent")}
                          </span>
                        ) : (
                          <span className={styles.placeholder}>-</span>
                        )}
                      </td>
                      <td className={styles.tableCell}>{formatDate(agreement.created_at)}</td>
                      <td className={styles.tableCell}>
                      <div className={styles.actions}>
                    <button
                      className={styles.dropdownTrigger}
                      onClick={() => setActiveDropdown(activeDropdown === agreement.id ? null : agreement.id)}
                    >
                      •••
                    </button>
                    {activeDropdown === agreement.id && (
                      <div className={styles.dropdownMenu}>
                        <button className={styles.dropdownItem} onClick={() => handleView(agreement.id)}>
                          <Eye /> View Details
                        </button>
                        <button className={styles.dropdownItem}>
                          <FileText /> Supporting Docs
                        </button>
                        <button 
                          className={styles.dropdownItem} 
                          onClick={() => downloadPdf(agreement)}
                          disabled={isGeneratingPdf}
                        >
                          {isGeneratingPdf ? (
                            <>
                              <Loader2 size={16} className={styles.loadingIcon} />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Printer /> Print Contract
                            </>
                          )}
                        </button>
                        <button 
                          className={`${styles.dropdownItem} ${styles.deleteButton}`}
                          onClick={() => handleDelete(agreement.id)}
                        >
                          <Trash2 /> Delete Contract
                        </button>
                      </div>
                    )}
                  </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
            <div ref={ref} className={styles.loaderContainer}>
  {isFetchingNextPage ? (
    <>
      <Loader2 className={styles.loadingIcon} />
      <span className={styles.loadMoreText}>Loading more agreements...</span>
    </>
  ) : hasNextPage ? (
   null
  ) : (
    <span className={styles.loadMoreText}>All agreements loaded</span>
  )}
</div>

          </div>
        </div>
      </div>
      <DeleteModal  isOpen={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title={"Agrement"}
                        isDeleting={isPending}
                        />
    </div>
  );
};

export default AgreementTable;
