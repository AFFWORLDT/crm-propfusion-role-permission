import styles from "./PrivacyPolicy.module.css";
import { Helmet } from "react-helmet";
import SectionTop from "../../../ui/SectionTop";

const Privacy = () => {
   const PrivacyList = [
   { 
    heading:"",
     headingContent : [
      {
        childHeading:"Introduction",
        childP : "  Propfusion Technology ('we,' 'our,' or 'us'), we are committed to safeguarding your privacy. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you visit our website or use our services. By accessing our services, you agree to the collection and use of information as described in this policy.",
        childList:"",
        childLink : "", 
      }
     ]
   },
   {
    heading : "Information We Collect",
    headingContent : [
      {
        childHeading : "Personal Information",
        childP : "We may collect personal information that you voluntarily provide to us, including:",
        childList:["Name","Email address","Contact number","Billing information","Any other information you voluntarily provide"],
        childLink : "",
      },
      {
        childHeading:"Non-Personal Information",
        childP : "We may also collect non-personal information about your interactions with our website and services, such as:",
        childList:["IP address","Browser type and version","Operating system","Browsing behavior (e.g., pages visited, time spent on pages)","Cookies and similar tracking technologies"],
        childLink : "",
      },
    ]
   },
   {
    heading : "How We Use Your Information",
    headingContent : [
      {
        childHeading:"Personal Information",
        childP:"We use the personal information we collect for the following purposes.",
        childList:["To provide and manage our services","To process transactions","To communicate with you","To personalize your experience on our website","To send promotional materials, newsletters, and updates (only with your consent)","To respond to inquiries and provide customer support"],
        childLink : "",
      },
      {
        childHeading : "Non-Personal Information",
        childP :"Non-personal information is used for the following purposes.",
        childList : ["To improve the functionality and user experience of our website and services","To analyze usage patterns and trends","To administer and maintain our website"],
        childLink : "",
      },
    
    ]
   },
   {
    heading : "How We Share Your Information",
    headingContent : [
      {
        childHeading : "Third-Party Service Providers",
        childP : "We may share your information with trusted third-party service providers to help us deliver our services, such as.",
        childList : ["Payment processors","Email marketing services","Hosting providers","These third parties are obligated to maintain the confidentiality of your information and are not permitted to use it for any other purpose."],
        childLink : "",
      },
      {
        childHeading : "Legal Requirements",
        childP : "We may disclose your information if required to do so by law or in response to a legal process, such as a subpoena or court order.",
        childList :"",
        childLink : "",
      },
      {
        childHeading : "Business Transfers",
        childP : "In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner of the business.",
        childList :"",
        childLink : "",
      },
      {
        childHeading : "Security of Your Information",
        childP : " We take reasonable administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
        childList : "",
        childLink : "",
      }
    ]
   },
   {
    heading : "Your Choices",
    headingContent : [
      {
        childHeading : "Opt-out Options",
        childP : "You have the right to opt out of sharing your information with third-party service providers by following the instructions provided by each service provider. You can also unsubscribe from promotional emails at any time by clicking the unsubscribe link in the email.",
        childList : "",
        childLink : "",
      },
      {
        childHeading : "Access and Correction",
        childP : "  You can request access to or correction of your personal information by contacting us at.",
        childList: "",
        childLink : [
         {
           path:"mailto:privacy@Propfusion.io",
          pathName:"privacy@Propfusion.io"
         }
        ],
      },
      {
        childHeading : "Cookies",
        childP : "We use cookies to enhance your experience on our website. You can set your browser to refuse cookies or alert you when cookies are being sent. However, some features of our website may not function properly without cookies.",
        childList : "",
        childLink : "", 
      }
    ]
   
   },
   {
    heading : "Changes to This Privacy Policy",
    headingContent : [
      {
      childHeading : "",
      childP : "We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised policy will be effective immediately upon posting. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.",
      childList : "",
      childLink : "", 
      
      }
    ]
   },
   {
    heading : "Contact Us",
    headingContent : [
      {
        childHeading : "",
        childP : "If you have any questions or concerns about this Privacy Policy, please contact us at.",
        childList : "",
        childLink : [
          {
            path: "mailto:privacy@Propfusion.io",
            pathName : "privacy@Propfusion.io"
          },
          {
            path : "tel:+971542997582",
            pathName : "+971542997582"
          }
        ], 

      }
    ]
   }

   ]
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Propfusion Policies</title>
        <meta
          name="description"
          content="Read Propfusion.io's Privacy Policy to understand how we collect, use, and protect your personal information. Your privacy and data security are our top priorities."
        />
        <meta
          name="keywords"
          content="Propfusion.io privacy policy, data protection, personal information, privacy practices, information security, data collection, user privacy, data privacy policy, Propfusion, Propfusion privacy policy"
        />
      </Helmet>
  
        <div className="sectionContainer">
          <SectionTop heading="Privacy Policy"/>
          <div className="sectionStyles">

         
       <h1>PRIVACY POLICY</h1>
       <pre>

       </pre>
       {PrivacyList.map((item,index)=><div key={index}> 
        {item.heading && <h2>{item.heading}</h2>}  
        <pre></pre>
        {item.headingContent && item.headingContent.map((itemContent,ContentIndex)=><div key={ContentIndex}>
             {itemContent.childHeading && <h3>{itemContent.childHeading}</h3>}
             <pre></pre>
              {itemContent.childP && <p>{itemContent.childP}</p>} 
              {itemContent.childList && itemContent.childList.map((childItem,childIndex)=><ul key={childIndex}>
                                                                                           <li>{childItem}</li>
                                                                                           </ul>)}
                                                                                          
              {itemContent.childLink && itemContent.childLink.map((LinkItem,LinkIndex)=><ul key={LinkIndex}>
                                                                                         <li><a href={LinkItem.path}>{LinkItem.pathName}</a> </li>
                                                                                        </ul>)}  
                                                                                                                                                               
        </div>) }
       </div>)}
       </div>
       </div>
    </>
  );
};

export default Privacy;
