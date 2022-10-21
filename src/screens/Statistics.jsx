import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ReactHelmet from "../components/ReactHelmet";

const SEE_ALL_USERS = gql`
  query seeAllUsers {
    seeAllUsers {
      id
      createdAt
    }
  }
`;

export default function Statistics() {
  const [datastandard, setDatastandard] = useState("일간 데이터");
  const { data } = useQuery(SEE_ALL_USERS);
  const [loading, setLoading] = useState(false);

  const [datasum, setDatasum] = useState([]);
  const [perioddata, setPerioddata] = useState([]);
  const [sameDateArray, setSameDateArray] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [graphdata, setGraphdata] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  // const getsamestandard = (beforedata) => {
  //   const afterdata = beforedata.reduce((a, b, c) => {
  //     if (a.some((element) => element.name === b)) {
  //       const certainele = a.find((element) => element.name === b);
  //       certainele.count++;
  //     } else {
  //       a.push({ name: b, count: 1 });
  //     }
  //     return a;
  //   }, []);
  //   return afterdata.sort(
  //     (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
  //   );
  // };

  // const graphrefine = (beforerefine) => {
  //   for (let i = 0; i < beforerefine.length; i++) {
  //     beforerefine[i].name = `${
  //       new Date(beforerefine[i].name).getMonth() + 1
  //     }월 ${new Date(beforerefine[i].name).getDate()}일`;
  //     beforerefine[i]["등록자수"] = beforerefine[i]["count"];
  //     delete beforerefine[i]["count"];
  //   }
  //   return beforerefine;
  // };

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const enumerateDaysBetweenDates = (startDate, endDate) => {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(
        `${new Date(currentDate).getMonth() + 1}/${new Date(
          currentDate
        ).getDate()}`
      );
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  };

  // 같은 날짜 periodData 초기 포맷
  const showDataArray = (periodDays) => {
    let dataArray = [];
    for (let i = 0; i < periodDays.length; ++i) {
      let dict = {};
      dict.name = periodDays[i];
      dict.등록자수 = 0;
      dataArray.push(dict);
    }
    return dataArray;
  };

  // 날짜 '00/00' 표기
  const createdAtRefine = (datasum) => {
    return datasum.map((data) => ({
      ...data,
      createdAt: `${
        new Date(parseInt(data.createdAt)).getMonth() + 1
      }/${new Date(parseInt(data.createdAt)).getDate()}`,
    }));
  };

  // 기간 내 같은 날짜 배열
  const sameDateArrayFunc = (refineCreatedAtDatasum) => {
    let dateArray = perioddata.map((element) => element.name);
    let sameDateArray = [];
    for (let i = 0; i < refineCreatedAtDatasum.length; ++i) {
      if (dateArray.includes(refineCreatedAtDatasum[i].createdAt)) {
        sameDateArray.push(refineCreatedAtDatasum[i]);
      }
    }
    return sameDateArray;
  };

  // 같은 날짜를 가진 periodData 업데이트
  const resultDateFunc = (sameDateArray) => {
    for (let i = 0; i < sameDateArray.length; ++i) {
      let samePeriodIndex = perioddata.findIndex(
        (element) => element.name === sameDateArray[i].createdAt
      );
      ++perioddata[samePeriodIndex].등록자수;
    }
    return perioddata;
  };

  useEffect(() => {
    if (data !== undefined && data !== null) {
      let createdAtRefind = createdAtRefine(data.seeAllUsers);
      setDatasum(createdAtRefind);
    }
  }, [data]);

  useEffect(() => {
    setLoading(false);
    let periodArray = enumerateDaysBetweenDates(startDate, endDate);
    let periodInitialDataset = showDataArray(periodArray);
    setPerioddata(periodInitialDataset);
  }, [datasum, startDate, endDate]);

  useEffect(() => {
    if (perioddata !== []) {
      setSameDateArray(sameDateArrayFunc(datasum));
    }
  }, [perioddata]);

  useEffect(() => {
    const refindperiodData = resultDateFunc(sameDateArray);
    setResultData(refindperiodData);
    setLoading(true);
  }, [sameDateArray]);

  return loading ? (
    <>
      <ReactHelmet title="회원 통계" />
      <Layout click="회원 통계">
        <div className="w-full flex flex-row justify-between items-center mb-5">
          <div className="w-60 flex flex-row">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center mr-3"
            />
            <span className="text-gray-500 font-bold text-lg"> - </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center ml-3"
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={resultData}
            margin={{
              top: 50,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="등록자수"
              stroke="#FF2D78"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Layout>
    </>
  ) : null;
}
