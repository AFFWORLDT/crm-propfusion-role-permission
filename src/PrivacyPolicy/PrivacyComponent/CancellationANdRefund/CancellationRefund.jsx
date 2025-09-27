import styles from "./CancellationRefund.module.css";
import { Helmet } from "react-helmet";

const Cancellation = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation and Refund Policy | Propfusion Policies</title>
        <meta
          name="description"
          content="Learn about Propfusion.io's Cancellation and Refund Policy. Find out how we handle cancellations and refunds to ensure a smooth experience for our customers."
        />
        <meta
          name="keywords"
          content="Propfusion.io cancellation policy, refund policy, cancellation process, refund process, customer support, policy terms, return policy, cancellations and refunds, Propfusion, Propfusion cancellations and refunds"
        />
      </Helmet>
      <div className={styles.cancellationContent}>
        <h2>CANCELLATION AND REFUND POLICY</h2>
        <h3>Introduction</h3>
        <p>
          At Propfusion Technology, we strive to provide the best services to our
          customers. However, we understand that there may be instances where
          you need to cancel a service or request a refund. This policy outlines
          the conditions and procedures for cancellations and refunds.
        </p>
        <h3>Cancellation Policy</h3>
        <h3>Service Cancellation:</h3>
        <h3>Ad Space Purchase:</h3>
        <p>
          Cancellation Window: You can cancel your ad space purchase within 24
          hours of placing the order. Procedure: To cancel, please contact our
          customer support team at{" "}
          <a href="mailto:support@Propfusion.io">support@Propfusion.io</a> with your
          order details.
        </p>
        <h3>Influencer Hiring:</h3>
        <p>
          Cancellation Window: You can cancel the hiring of an influencer within
          48 hours of confirmation. Procedure: To cancel, please contact our
          influencer support team at{" "}
          <a href="mailto:influencers@Propfusion.io">influencers@Propfusion.io</a>{" "}
          with the influencer and contract details.
        </p>
        <h3>Influencer Agent Services:</h3>
        <p>
          Cancellation Window: You can cancel influencer agent services within 7
          days of signing the agreement. Procedure: To cancel, please contact
          our agent services team at{" "}
          <a href="mailto:agentsupport@Propfusion.io">agentsupport@Propfusion.io</a>{" "}
          with the agreement details.
        </p>
        <h3>General Conditions:</h3>
        <p>
          All cancellation requests must be made in writing via email.
          Cancellations are subject to approval based on the time of request and
          the nature of the service. Some services may have specific
          cancellation terms which will be detailed in the service agreement.
          Refund Policy
        </p>
        <h3>Eligibility for Refund:</h3>
        <h3>Ad Space Purchase:</h3>
        <p>
          Refunds are available if the cancellation is made within the specified
          24-hour window. Refunds are processed within 7-10 business days from
          the date of cancellation confirmation.
        </p>
        <h3>Influencer Hiring:</h3>
        <p>
          Refunds are available if the cancellation is made within the specified
          48-hour window. Partial refunds may be available if services have
          already commenced.
        </p>
        <h3>Influencer Agent Services:</h3>
        <p>
          Refunds are available if the cancellation is made within the specified
          7-day window. A pro-rata refund may be issued based on the duration of
          the services used.
          <h3>Non-Refundable Situations:</h3>
          No refunds will be issued for services canceled after the specified
          cancellation windows. No refunds will be issued for services that have
          been fully rendered or completed. How to Request a Refund
        </p>
        <p>
          <h3>
            Send an email to the respective support team based on the service:
          </h3>
          <h3>
            Ad Space:{" "}
            <a href="mailto:support@Propfusion.io">support@Propfusion.io</a>
          </h3>
          <h3>
            Influencer Hiring:{" "}
            <a href="mailto:influencers@Propfusion.io">influencers@Propfusion.io</a>
          </h3>
          <h3>
            Influencer Agent Services:{" "}
            <a href="mailto:agentsupport@Propfusion.io">
              agentsupport@Propfusion.io
            </a>
          </h3>
          <h3>Include the following details in your email:</h3>
          <ul>
            <li>Your full name and contact information.</li>
            <li>The order or agreement numter.</li>
            <li>The reason for the cancellation or refund request.</li>
            <li>Any supporting documents or evidence.</li>
          </ul>
          <h3>Contact Us</h3> If you have any questions about our Cancellation
          and Refund Policy, please contact us at{" "}
          <a href="mailto:support@Propfusion.io">support@Propfusion.io</a> or call
          our customer service hotline at
          <a href="tel:+971542997582">+971542997582</a>.
        </p>
      </div>
    </>
  );
};

export default Cancellation;