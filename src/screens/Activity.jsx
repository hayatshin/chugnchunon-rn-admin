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

const SEE_ADMIN_FEED = gql`
  query seeAdminAllFeeds {
    seeAdminAllFeeds {
      id
      createdAt
    }
  }
`;

const SEE_ADMIN_POEM = gql`
  query seeAdminAllPoems {
    seeAdminAllPoems {
      id
      createdAt
    }
  }
`;

const SEE_ADMIN_FPLIKES = gql`
  query seeAdminAllLikes {
    seeAdminAllLikes {
      id
      createdAt
    }
  }
`;

const SEE_ADMIN_FPCOMMENTS = gql`
  query seeAdminAllComments {
    seeAdminAllComments {
      id
      createdAt
    }
  }
`;

const SEE_ADMIN_PEDOMETERS = gql`
  query seeAdminAllPedometers {
    seeAdminAllPedometers {
      id
      stepCount
      createdAt
    }
  }
`;

export default function Activity() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const { data: feedData } = useQuery(SEE_ADMIN_FEED);
  const { data: poemData } = useQuery(SEE_ADMIN_POEM);
  const { data: fpLikesData } = useQuery(SEE_ADMIN_FPLIKES);
  const { data: fpCommentsData } = useQuery(SEE_ADMIN_FPCOMMENTS);
  const { data: pedometerData } = useQuery(SEE_ADMIN_PEDOMETERS);

  const [datasum, setDatasum] = useState([]);
  let datasumArray = [];

  const [perioddata, setPerioddata] = useState([]);
  const [sameDateArray, setSameDateArray] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      dict.점수 = 0;
      dict.댓글 = 0;
      dict.시 = 0;
      dict.일상 = 0;
      dict.좋아요 = 0;
      dict.걸음수 = 0;
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

      if (sameDateArray[i].__typename === "Point") {
        perioddata[samePeriodIndex].점수 += sameDateArray[i].point;
      } else if (sameDateArray[i].__typename === "Feed") {
        ++perioddata[samePeriodIndex].일상;
      } else if (sameDateArray[i].__typename === "Poem") {
        ++perioddata[samePeriodIndex].시;
      } else if (sameDateArray[i].__typename === "Comment") {
        ++perioddata[samePeriodIndex].댓글;
      } else if (sameDateArray[i].__typename === "Like") {
        ++perioddata[samePeriodIndex].좋아요;
      } else if (sameDateArray[i].__typename === "Pedometer") {
        perioddata[samePeriodIndex].걸음수 += Math.floor(
          sameDateArray[i].stepCount / 1000
        );
      }
    }
    return perioddata;
  };

  useEffect(() => {
    if (
      feedData !== undefined &&
      feedData !== null &&
      poemData !== undefined &&
      poemData !== null &&
      fpLikesData !== undefined &&
      (fpLikesData !== null) & (fpCommentsData !== undefined) &&
      fpCommentsData !== null &&
      pedometerData !== undefined &&
      pedometerData !== null
    ) {
      datasumArray.push(
        ...feedData.seeAdminAllFeeds,
        ...poemData.seeAdminAllPoems,
        ...fpLikesData.seeAdminAllLikes,
        ...fpCommentsData.seeAdminAllComments,
        ...pedometerData.seeAdminAllPedometers
      );
      let createdAtRefind = createdAtRefine(datasumArray);
      setDatasum(createdAtRefind);
    }
  }, [feedData, poemData, fpLikesData, fpCommentsData, pedometerData]);

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

  return (
    <Layout click="활동 통계">
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
      {loading ? (
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
            {/* <Line type="monotone" dataKey="점수" stroke="#FF2D78" activeDot={{ r: 8 }} strokeWidth={2} /> */}
            <Line
              type="monotone"
              dataKey="일상"
              stroke="#9b5de5"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="시"
              stroke="#f15bb5"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="댓글"
              stroke="#fee440"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="좋아요"
              stroke="#00bbf9"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="걸음수"
              stroke="#007200"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </Layout>
  );
}
