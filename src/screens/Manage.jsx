import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { data } from "autoprefixer";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink, CSVDownload } from "react-csv";
import ReactHelmet from "../components/ReactHelmet";

const SEE_ALL_USERS = gql`
  query seeAllUsers {
    seeAllUsers {
      id
      name
      age
      birthyear
      birthday
      gender
      cellphone
      region
      community {
        communityName
      }
      createdAt
    }
  }
`;

export default function Manage() {
  const { data: userData } = useQuery(SEE_ALL_USERS);
  const [loading, setLoading] = useState(false);
  const [tabledata, setTabledata] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date().getTime());
  const [csvdata, setCsvdata] = useState([]);

  function tablemap(data, index) {
    const indexodd = index % 2 == 0;
    const birthDate =
      data.birthday.slice(0, 2) + " / " + data.birthday.slice(2, 4);
    const createdDate = new Date(+data.createdAt)
      .toISOString()
      .substring(0, 10);
    return (
      <tr key={data.id}>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {createdDate}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.name}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.age}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.birthyear}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {birthDate}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.gender}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.cellphone}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.region}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-5 py-1 text-left text-sm`}
        >
          {data.community.communityName}
        </td>
      </tr>
    );
  }

  function csvmap(data) {
    const birthDate =
      data.birthday.slice(0, 2) + " / " + data.birthday.slice(2, 4);
    const createdDate = new Date(+data.createdAt)
      .toISOString()
      .substring(0, 10);
    return [
      createdDate,
      data.name,
      data.age,
      data.birthyear,
      birthDate,
      data.gender,
      data.cellphone,
      data.region,
      data.community.communityName,
    ];
  }

  useEffect(() => {
    if (userData !== undefined && userData !== null) {
      setTabledata(
        [...userData.seeAllUsers].sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
      );
    }
  }, [userData]);

  useEffect(() => {
    setLoading(true);
    setCsvdata(
      [
        [
          "등록일",
          "이름",
          "나이",
          "출생년도",
          "생일",
          "성별",
          "핸드폰 번호",
          "거주 지역",
          "소속 기관",
        ],
      ].concat(tabledata.map((item) => csvmap(item)))
    );
  }, [tabledata]);

  useEffect(() => {
    if (loading && (startDate !== new Date() || endDate !== new Date())) {
      setTabledata(
        [...userData.seeAllUsers]
          .filter(
            (item) =>
              parseInt(item.createdAt) >= startDate &&
              parseInt(item.createdAt) <= endDate
          )
          .sort(function (a, b) {
            return b.createdAt - a.createdAt;
          })
      );
    }
  }, [startDate, endDate]);

  return (
    <>
      <ReactHelmet title="회원 관리" />
      <Layout click="회원 관리">
        <div className="w-full flex flex-row justify-between items-center mb-5">
          <div className="w-60 flex flex-row">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date.setHours(0, 0, 0, 0))}
              className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center mr-3"
            />
            <span className="text-gray-500 font-bold text-lg"> - </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date.setHours(23, 59, 59, 999))}
              className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center ml-3"
            />
          </div>
          <div>
            <CSVLink
              data={csvdata}
              className="bg-gray-500 rounded-md py-2 px-5 text-white font-bold"
            >
              CSV 다운로드
            </CSVLink>
          </div>
        </div>
        <table className="border-collapse min-w-max">
          <tbody>
            <tr>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                등록일
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-2 text-left text-sm">
                이름
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                나이
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                출생년도
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                생일
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                성별
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                핸드폰 번호
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                거주 지역
              </th>
              <th className="border-b-2 border-slate-700 justify-center items-center px-5 py-1 text-left text-sm">
                소속 기관
              </th>
            </tr>
            {loading
              ? tabledata.map((item, index) => tablemap(item, index))
              : null}
          </tbody>
        </table>
      </Layout>
    </>
  );
}
