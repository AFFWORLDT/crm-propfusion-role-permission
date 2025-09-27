import styles from "./CustSupport.module.css";
import { Helmet } from "react-helmet";

const CustSupport = () => {
  const supportList = [
    {
      id: "1",
      heading: "WE'RE HERE TO HELP YOU EVERY STEP OF THE WAY",
      contentPList: [
        {
          headingP: "",
          headingText:
            "At Propfusion Technologies, we prioritize our customers and are committed to providing the best support for all your needs. Whether you have questions, concerns, or feedback, we’re here to assist you. Reach out to us through any of the following channels:",
          anchorList: null,
        },
      ],
    },
    {
      id: "2",
      heading: "Customer Support:",
      contentPList: [
        {
          headingP: "Email:",
          anchorList: {
            path: "mailto:support@Propfusion.io",
            pathName: "support@Propfusion.io",
          },
        },
        {
          headingP: "Phone:",
          anchorList: {
            path: "tel:+971542997582",
            pathName: "+971542997582",
          },
        },
        {
          headingText: "Live Chat: Available on our website ",
          anchorList: {
            path: "https://Propfusion.io/login",
            pathName: "www.Propfusion.io",
          },
        },
      ],
    },
    {
      id: "3",
      heading: "Business Inquiries:",
      contentPList: [
        {
          headingP: "Email:",
          anchorList: {
            path: "mailto:business@Propfusion.io",
            pathName: "business@Propfusion.io",
          },
        },
      ],
    },
    {
      id: "4",
      heading: "Support Inquiries::",
      contentPList: [
        {
          headingP: "Email:",
          anchorList: {
            path: "mailto:Supportcrm@Propfusion.io",
            pathName: "Supportcrm@Propfusion.io",
          },
        },
      ],
    },
    {
      id: "6",
      heading: "Our Offices:",
      contentPList: [
        {
          headingP: "Dubai Office",
          headingText:
            "AffWorld Fz LLC 512 ONYX TOWER 2 , Dubai, UAE",
        },
      ],
    },
    {
      id: "7",
      heading: "India Office:",
      contentPList: [
        {
          headingText:
            "Technology Bhamashah Technhub, 5th Floor, RAJASTHAN INTERNATIONAL CENTRE, Jaipur, Rajasthan 302020, India",
          anchorList: {
            path: "https://maps.app.goo.gl/rwTYWuaD8C9StUMZA",
            pathName: "View on Google Maps",
          },
        },
      ],
    },
    {
      id: "8",
      heading: "Office Hours:",
      contentPList: [
        { headingP: "Monday to Friday: 8:00 AM - 10:00 PM (Local Time)" },
        { headingP: "Saturday: 10:00 AM - 4:00 PM (Local Time)" },
        { headingP: "Sunday: Closed" },
      ],
    },
    {
      id: "9",
      heading: "Follow Us on Social Media:",
      contentPList: [
        {
          headingP: "Facebook:",
          anchorList: {
            path: "https://facebook.com/people/Propfusion-Technologies/61556653426093/",
            pathName: "facebook.com/Propfusion-Technologies",
          },
        },
        {
          headingP: "LinkedIn:",
          anchorList: {
            path: "https://linkedin.com/company/Propfusion-technologies",
            pathName: "linkedin.com/company/Propfusion-technologies",
          },
        },
        {
          headingP: "Instagram:",
          anchorList: {
            path: "https://instagram.com/Propfusion.IO",
            pathName: "instagram.com/Propfusion.IO",
          },
        },
      ],
    },
    {
      id: "10",
      contentPList: [
        {
          headingText:
            "We look forward to connecting with you! Your satisfaction is our top priority, and we are here to ensure you receive the support you deserve.",
        },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Customer Support | Propfusion Policies</title>
        <meta
          name="description"
          content="Get expert assistance with Propfusion.io's Customer Support. Our dedicated team is here to help you with any inquiries, troubleshooting, or technical issues you may have."
        />
        <meta
          name="keywords"
          content="Propfusion.io customer support, tech support, customer service, help center, technical assistance, support team, troubleshooting, customer inquiries, Propfusion, Propfusion customer support"
        />
      </Helmet>

      <div className={`container-fluid ${styles.supportContent}`}>
        <h1>WE ARE HERE TO HELP</h1>
        <pre>

          
        </pre>
        {supportList.map((item) => (
          <div key={item.id}>
            {item.heading && <h2>{item.heading}</h2>}
            {item.contentPList.map((content, index) => (
              <div key={index}>
                {content.headingP && <h3>{content.headingP}</h3>}
                {content.headingText && <p>{content.headingText}</p>}
                {content.anchorList && (
                  <ul>
                    <li>
                      <a href={content.anchorList.path} target="_blank" rel="noopener noreferrer">
                        {content.anchorList.pathName}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default CustSupport;
