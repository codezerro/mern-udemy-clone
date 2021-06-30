import { Modal } from "antd";

const MarkdownCheetcheet = ({
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal,
  extra = false,
}) => {
  return (
    <>
      <Modal
        title="Markdown Tips"
        visible={markdownCheetsheetModal}
        onCancel={() => setMarkdownCheetsheetModal(!markdownCheetsheetModal)}
        // width={720}
        footer={null}
      >
        <ol>
          <li>
            Wrap code blocks using 3 backticks <br />
            <code>
              ```js <br /> console.log('you can post code using markdown'){" "}
              <br />
              ```
            </code>
          </li>
          <li>
            Wrap your words with ** to bold text <br />
            <code>
              **
              <b>bold</b>
              **
            </code>
          </li>
          <li>
            Use dash to write list items <br />
            <code>
              - Item 1 <br /> - Item 2
            </code>
          </li>
          {extra && (
            <li>
              Use ## or ### to write h2 or h3 <br />
              <code>
                ## Heading 2 <br /> ### Heading 3
              </code>
            </li>
          )}
        </ol>
      </Modal>
    </>
  );
};

export default MarkdownCheetcheet;
