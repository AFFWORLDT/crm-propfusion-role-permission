import styles from "./PricingDetails.module.css";
import { Helmet } from "react-helmet";

const Pricing = () => {
    const PriceList = [
        {
            id: "1",
            heading: "Basic Plan:",
            content:
                "AED 999/month Ideal for small to medium-sized businesses or individual real estate agents Includes:",
            ulList: [
                // "Basic Package: $500 per campaign",
                // "Ideal for small-scale promotions",
                // "Includes selection and management of one influencer.",
                // "Campaign duration: Up to 1 week.",
                // "Standard Package: $1,500 per campaign",
                // "Suitable for medium-scale promotions.",
                // "Includes selection and management of up to three influencers.",
                // "Campaign duration: Up to 2 weeks.",
                // "Premium Package: $3,000 per campaign",
                // "Perfect for large-scale promotions.",
                // "Includes selection and management of up to five influencers.",
                // "Campaign duration: Up to 1 month.",
                "Lead and contact management.",
                "Property listing management.",
                "Basic team collaboration tools.",
                "Email integration.",
                "Third-party integrations (included).",
                "Up to 3 users.",
            ],
            anchorList: [],
        },
        {
            id: "2",
            heading: "Elite Plan:",
            content:
                "AED 1,299/month Designed for growing real estate businesses Includes:",
            ulList: [
                // "Monthly Subscription: $1,000 per month",
                // "Ongoing influencer management and contract negotiations.",
                // "Continuous support and performance tracking.",
                // "Annual Subscription: $10,000 per year",
                // "All benefits of the monthly subscription with a discounted rate.",
                // "Priority support and exclusive insights",
                "All features from the Basic Plan",
                "Enhanced team collaboration",
                "Customizable property management tools",
                " Advanced lead tracking and reporting",
                "  Third-party integrations (included)",
                "Up to 10 users",
                "Priority support",
            ],
            anchorList: [],
        },
        {
            id: "3",
            heading: "Titanium Plan:",
            content:
                "AED 1,599/month Perfect for larger real estate agencies or teams looking for advanced features and scalabilityIncludes:",
            ulList: [
                //  "Local Ad Space: $200 per week",
                //   "Target a specific city or region.",
                //   "Suitable for localized campaigns",
                //   "National Ad Space: $1,000 per week",
                //   "Reach audiences across the country.",
                //   "Ideal for national promotions.",
                //   "International Ad Space: $5,000 per week",
                //   "Global reach to multiple countries.",
                //   "Perfect for international campaigns.",
                " All features from the Elite Plan",
                "Unlimited user accounts",
                "Custom workflows and automation",
                "Advanced analytics and reporting",
                "Dedicated account manager",
                "Premium support",
                "Third-party integrations (included)",
            ],
            anchorList: [],
        },
        {
            id: "4",
            heading: "Yearly Subscription Plans (Discounted)",
            content: "",
            ulList: [],
            anchorList: [
              
            ],
        },
        // {
        //     id: "4",
        //     heading: "Custom Ad Space Packages:",
        //     content: "Contact us at",
        //     ulList: [],
        //     anchorList: [
        //         {
        //             path: "mailto:adspace@Propfusion.com",
        //             pathName: "adspace@Propfusion.com",
        //         },
        //     ],
        // },
        {
            id: "5",
            heading: "Basic Plan (Yearly): ",
            content: "AED 10,000/year Save on monthly payments while enjoying all the features of the Basic Plan.",
            ulList: [],
            anchorList: [
            ],
        },
        {
            id: "6",
            heading: "Elite Plan (Yearly):  ",
            content: "AED 12,500/year Save on monthly payments with all the benefits of the Elite Plan.",
            ulList: [],
            anchorList: [
            ],
        },
        {
            id: "7",
            heading: "Titanium Plan (Yearly):  ",
            content: " AED 15,000/year Save on monthly payments and access premium features with the Titanium Plan.",
            ulList: [],
            anchorList: [
            ],
        },
        {
            id: "8",
            heading: "Enterprise Plans for Large Companies ",
            content: " For large enterprises or real estate corporations looking for a fully customized CRM solution, we offer tailored enterprise-level packages.",
            ulList: [],
            anchorList: [
            ],
        },
        {
            id: "9",
            heading: "Pricing",
            content: " Custom Includes personalized CRM features based on your specific business needs, such as:",
            ulList: [
             " Unlimited users and custom workflows",
"Advanced reporting and analytics",
"Custom integrations (e.g., with real estate portals and third-party services)",
"Dedicated customer support and account management",
"Priority on all updates and feature requests",
"Please contact our sales team to discuss your enterprise requirements and receive a custom quote:",
            ],
            anchorList: [
              {
                path: "mailto:sales@Propfusion.com",
              pathName: "sales@Propfusion.com",
              }
            ],
        },
      
        {
            id: "10",
            heading: "Other Services",
            content: "",
            ulList: [],
            anchorList: [],
        },
        {
            id: "7",
            heading: "Consulting Services",
            content: "",
            ulList: [
                // "Basic Consultation: $250 per hour",
                // "Marketing strategy sessions.",
                // "Campaign planning and advice.",
                // "Comprehensive Consultation: $2,000 per month",
                // "Includes up to 10 hours of consultation.",
                // "Detailed campaign analysis and ongoing support.",
            ],
            anchorList: [],
        },
        {
            id: "11",
            heading: "Basic Consultation: ",
            content: "AED 250 per hour Marketing strategy sessions, campaign planning, and advice.",
            ulList: [
               
            ],
            anchorList: [],
        },
        {
            id: "12",
            heading: "Comprehensive Consultation: ",
            content: "AED 2,000 per month Includes up to 10 hours of consultation, detailed campaign analysis, and ongoing support.",
            ulList: [
               
            ],
            anchorList: [],
        },
        {
            id: "13",
            heading: "Custom Solutions:",
            content:
                "If your business requires a more tailored solution, please contact us to discuss custom CRM features.",
            ulList: [],
            anchorList: [
                {
                    path: "mailto:sales@Propfusion.com",
                    pathName: "sales@Propfusion.com",
                },
            ],
        },
        {
            id: "14",
            heading: "Agreements and Terms",
            content: "",
            ulList: [],
            anchorList: [],
        },
        {
            id: "15",
            heading: "Fixed Fees:",
            content:
                "All services are provided at fixed fees, ensuring transparency and predictability.",
            ulList: [],
            anchorList: [],
        },
        // {
        //     id: "10",
        //     heading: "Agreements:",
        //     content:
        //         "We have agreements in place on both sides (clients and influencers/advertisers) to ensure clarity and mutual understanding of terms.",
        //     ulList: [],
        //     anchorList: [],
        // },
        {
            id: "16",
            heading: "Payment Terms:",
            content: "",
            ulList: [
                "Payment is required upfront for all fixed-fee services. For subscription services, payment is due at the beginning of each billing cycle.",
            ],
            anchorList: [],
        },
        {
            id: "17",
            heading: "Refund Policy:",
            content:
                "Please refer to our Cancellation and Refund Policy for details on refund eligibility and procedures.",
            ulList: [],
            anchorList: [],
        },
        {
            id: "18",
            heading: "Contact Us",
            content:
                "For more information about our pricing or to request a custom quote, please contact us:",
            ulList: [],
            anchorList: [
                {
                    path: "mailto:pricing@Propfusion.io",
                    pathName: "pricing@Propfusion.io",
                },
                {
                    path: "tel:+971542997582",
                    pathName: "+971542997582",
                },
            ],
        },
    ];

    return (
        <>
            <Helmet>
                <title>Pricing Details | Propfusion Policies</title>
                <meta
                    name="description"
                    content="Explore Propfusion.io's transparent pricing details for our IT services. Find affordable solutions tailored to your business needs with clear and competitive pricing."
                />
                <meta
                    name="keywords"
                    content="Propfusion.io pricing details, IT service pricing, affordable solutions, transparent pricing, cost-effective IT services, pricing plans, service costs, Propfusion, Propfusion pricing details"
                />
            </Helmet>

            <div className={`container-fluid ${styles.pricingContent}`}>
                <h1>Pricing Plans at PropFusion CRM</h1>
                <p>
                    At PropFusion CRM, we offer transparent pricing with
                    fixed-fee structures, ensuring that you know exactly what
                    you are paying for with no hidden costs. Below are the
                    details for our CRM subscription plans designed for real
                    estate professionals, agencies, and large companies.
                </p>

                <h2>CRM Subscription Plans</h2>
                {PriceList.map((item, index) => (
                    <div key={index}>
                        <h2>{item.heading}</h2>
                        <p>{item.content}</p>
                        {item.ulList.length > 0 && (
                            <ul>
                                {item.ulList.map((ulItem, ulIndex) => (
                                    <li key={ulIndex}>{ulItem}</li>
                                ))}
                            </ul>
                        )}
                        {item.anchorList.length > 0 && (
                            <ul>
                                {item.anchorList.map(
                                    (anchorItem, anchorIndex) => (
                                        <li key={anchorIndex}>
                                            {" "}
                                            <a
                                                href={anchorItem.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {anchorItem.pathName}
                                            </a>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Pricing;
