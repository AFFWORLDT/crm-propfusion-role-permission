import { Helmet } from "react-helmet";
import styles from "./TermsAndCondition.module.css";
import SectionTop from "../../../ui/SectionTop";

const TermsAndCondition = () => {
  const ListTerms = [
    {
      id: 1,
      heading: "Introduction",
      contentPTag: "These Terms and Conditions (\"Terms\") govern your use of the Propfusion Technology website and services. By accessing or using our website or services, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our services.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 2,
      heading: "Eligibility",
      contentPTag: "You must be at least 18 years old to use our services.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 3,
      heading: "Account Registration",
      contentPTag: "To access certain services, you may be required to create an account. By registering, you agree to provide accurate, complete, and up-to-date information and to maintain the accuracy of your account details. You are responsible for all activities under your account.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 4,
      heading: "Prohibited Activities",
      contentPTag: "You agree not to engage in any unlawful, harmful, or prohibited activities, including but not limited to:",
      ulList: ["Violating any applicable laws, rules, or regulations", "Infringing on the rights of others", "Using our services to distribute spam, malware, or other harmful software", "Attempting to gain unauthorized access to our systems, networks, or accounts"],
      anchorPath: ""
    },
    {
      id: 5,
      heading: "Intellectual Property",
      contentPTag: "All content on our website, including text, graphics, logos, images, software, and other materials (\"Content\"), is the property of Propfusion Technology or its licensors and is protected by copyright and other intellectual property laws. You agree not to reproduce, distribute, or create derivative works from any of the Content without prior written consent.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 6,
      heading: "Service Availability",
      contentPTag: "We strive to provide uninterrupted access to our services, but we do not guarantee continuous availability or error-free performance. Maintenance, upgrades, or unforeseen events may cause temporary disruptions in service.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 7,
      heading: "Accuracy of Information",
      contentPTag: "We make reasonable efforts to ensure that the information provided on our website is accurate. However, we do not guarantee the accuracy, completeness, or reliability of any information, and we are not liable for any errors or omissions.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 8,
      heading: "Third-Party Links",
      contentPTag: "Our website may contain links to third-party websites. These links are provided for your convenience. Propfusion Technology does not endorse or take responsibility for the content or practices of these third-party websites.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 9,
      heading: "Limitation of Liability",
      contentPTag: "In no event shall Propfusion Technology be liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to damages for loss of profits, data, or other intangible losses, arising out of or in connection with your use of our services, even if we have been advised of the possibility of such damages.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 10,
      heading: "Indemnification",
      contentPTag: "You agree to indemnify, defend, and hold harmless Propfusion Technology, its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses, including attorney's fees, arising out of or in connection with your use of our services or violation of these Terms.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 11,
      heading: "Governing Law",
      contentPTag: "These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 12,
      heading: "Changes to These Terms",
      contentPTag: "We may update these Terms from time to time. Any changes will be posted on this page with the updated effective date. Your continued use of our services after any changes to these Terms will constitute your acceptance of the new Terms.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 13,
      heading: "Effective Date",
      contentPTag: "These Terms are effective as of 01/08/2024.",
      ulList: "",
      anchorPath: ""
    },
    {
      id: 14,
      heading: "Contact Us",
      contentPTag: "For any questions or concerns regarding these Terms, please contact us:",
      ulList: "",
      anchorPath: [
        {
          path: "mailto:support@Propfusion.io",
          pathName: "support@Propfusion.io"
        },
        {
          path: "tel:+971542997582",
          pathName: "+971542997582"
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Propfusion Policies</title>
        <meta
          name="description"
          content="Review Propfusion.io's Terms and Conditions to understand the rules and guidelines governing our services. Ensure a clear and fair understanding of our terms."
        />
        <meta
          name="keywords"
          content="Propfusion.io terms and conditions, service terms, user agreement, legal terms, company policies, usage guidelines, terms of service, service rules, Propfusion, Propfusion terms and conditions"
        />
      </Helmet>
      
      <div className={"sectionContainer"}>
        <SectionTop heading="Terms and Conditions"/>
        <div className="sectionStyles">
        <h1>Terms and Conditions</h1>
        
        <div className={styles.termsContainer}>
          {ListTerms.map((item, index) => (
            <div key={index} className={styles.termSection}>
              <h3>{item.heading}</h3>
              
              <p>{item.contentPTag}</p>
              
              {item.ulList && (
                <ul className={styles.termsList}>
                  {item.ulList.map((listItem, keyIndex) => (
                    <li key={keyIndex}>{listItem}</li>
                  ))}
                </ul>
              )}
              
              {item.anchorPath && (
                <ul className={styles.contactList}>
                  {item.anchorPath.map((anchorList, anchorkey) => (
                    <li key={anchorkey}>
                      <a href={anchorList.path}>
                        {anchorList.pathName}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        </div>
        </div>

    </>
  );
};

export default TermsAndCondition;