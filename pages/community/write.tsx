import type { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";

const Write: NextPage = () => {
  return (
    <Layout canGoBack title="Write Post">
      <form className="space-y-4 px-4">
        <TextArea requrid placeholder="Ask a question!" />
        <Button text="submit" />
      </form>
    </Layout>
  );
};

export default Write;
