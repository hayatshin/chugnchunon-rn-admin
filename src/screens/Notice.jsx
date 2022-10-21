import { gql } from "@apollo/client";
import Layout from "../components/Layout";
import ReactHelmet from "../components/ReactHelmet";

export default function Notice() {
  return (
    <>
      <ReactHelmet title="공지 관리" />
      <Layout click="공지 관리">
        <div className="w-full h-full flex justify-center items-center">
          <span className="font-bold">서비스를 준비 중입니다.</span>
        </div>
      </Layout>
    </>
  );
}
