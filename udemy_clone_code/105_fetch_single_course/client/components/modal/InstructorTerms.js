import { Modal } from "antd";
import { RollbackOutlined } from "@ant-design/icons";

const InstructorTerms = ({ showModal, setShowModal }) => {
  return (
    <>
      <Modal
        title="Instructor Terms & Conditions"
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        // width={720}
        footer={null}
      >
        <ol>
          <li>
            You can create either free or paid courses. Paid courses will use
            USD as default currency.
          </li>
          <li>
            You are free to decide the sale price for your course as long as it
            meets the minimum price requirement which is $1.99.
          </li>
          <li>
            Make sure you are from stripe supported countries.{" "}
            <a href="https://stripe.com/global" target="_blank">
              Click here
            </a>{" "}
            to learn more.
          </li>
          <li>
            For each course sale, you will receive 70% of total sale revenue.
            That means if your course sale price is $10.00, you will recieve
            $7.00 (approximately) for each sale.
          </li>
          <li>
            Your revenu will be paid out to your bank details directly by Stripe
            based on the scheduled payout timeframe (usually between 1-4 weeks).
          </li>
          <li>
            We (Code Continue) will not be responsible by any means for the loss
            of revenue, course materials, students engagements and all other
            platform related issues.
          </li>
          <li>
            We (Code Continue) will not be responsible for any issues caused by
            software/hardware related issues.
          </li>
          <li>
            We (Code Continue) will not be responsible for any copyright related
            issues.
          </li>
          <li>
            We (Code Continue) hold the right to update the terms and conditions
            at any time and it will come to effect immidately.
          </li>
        </ol>
      </Modal>
    </>
  );
};

export default InstructorTerms;
