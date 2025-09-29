import styles from "./Overview.module.css";
import { CiMemoPad } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { MdRoundaboutRight } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { IoPricetagOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function Overview() {
  const OverViewList = [
    {
      id: 1,
      Icons: <CiMemoPad className={styles.oLogo} />,
      heading: "Terms and Conditions",
      path: "terms-and-conditions"
    },
    {
      id: 2,
      Icons: <HiOutlineReceiptRefund className={styles.oLogo} aria-label="Cancellation and Refund" />,
      heading: "Privacy Policy",
      path: "privacy-policy"
    },
    {
      id: 3,
      Icons: <RiCustomerService2Line className={styles.oLogo} aria-label="Customer Support" />,
      heading: "Customer Support",
      path: "customer-support"
    },
    {
      id: 4,
      Icons: <MdRoundaboutRight className={styles.oLogo} aria-label="About Us" />,
      heading: "About Us",
      path: "about-us"
    },
    {
      id: 5,
      Icons: <IoPricetagOutline className={styles.oLogo} aria-label="Pricing Details" />,
      heading: "Pricing Details",
      path: "pricing-details"
    }
  ]
  return (
    <>
      <Helmet>
        <title>Overview | ONEX Properties Policies</title>
        <meta
          name="description"
          content="Overview of ONEX Properties policies including terms, privacy, and support information."
        />
        <meta
          name="keywords"
          content="ONEX Properties, policies, terms and conditions, privacy policy, refund policy, cancellation policy, customer support, pricing details"
        />
      </Helmet>

      <section className={styles.content}>

        <h3>Overview</h3>

        <div className={`${styles.cardContainer} container-fluid text-center`}>
          <div className="flex flex-wrap justify-center gap-6">
            {
              OverViewList.map((item, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2 flex justify-center">
                  <div className={styles.card} >
                    <Link to={item.path}>
                      {item.Icons}
                      <span>{item.heading}</span>
                    </Link>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </>
  );
}

export default Overview;
