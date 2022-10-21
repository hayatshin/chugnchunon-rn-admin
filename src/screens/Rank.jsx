import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import { useMemo } from "react";

const SEE_ALL_USERS_QUERY = gql`
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

const SEE_ADMIN_FEED = gql`
  query seeAdminAllFeeds {
    seeAdminAllFeeds {
      id
      user {
        id
      }
      createdAt
    }
  }
`;

const SEE_ADMIN_POEM = gql`
  query seeAdminAllPoems {
    seeAdminAllPoems {
      id
      user {
        id
      }
      createdAt
    }
  }
`;

const SEE_ADMIN_FPLIKES = gql`
  query seeAdminAllLikes {
    seeAdminAllLikes {
      id
      user {
        id
      }
      createdAt
    }
  }
`;

const SEE_ADMIN_FPCOMMENTS = gql`
  query seeAdminAllComments {
    seeAdminAllComments {
      id
      user {
        id
      }
      createdAt
    }
  }
`;

const SEE_ADMIN_PEDOMETERS = gql`
  query seeAdminAllPedometers {
    seeAdminAllPedometers {
      id
      user {
        id
      }
      stepCount
      createdAt
    }
  }
`;

export default function Rank() {
  const { register, handleSubmit } = useForm();
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  const { data: userData } = useQuery(SEE_ALL_USERS_QUERY);
  const { data: feedData } = useQuery(SEE_ADMIN_FEED);
  const { data: poemData } = useQuery(SEE_ADMIN_POEM);
  const { data: fpLikesData } = useQuery(SEE_ADMIN_FPLIKES);
  const { data: fpCommentsData } = useQuery(SEE_ADMIN_FPCOMMENTS);
  const { data: pedometerData } = useQuery(SEE_ADMIN_PEDOMETERS);

  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState("점수");
  let datasumArray = [];
  const [keyword, setKeyword] = useState("");

  function csvmap(data, index) {
    const birthDate =
      data.birthday.slice(0, 2) + " / " + data.birthday.slice(2, 4);
    const createdDate = new Date(+data.createdAt)
      .toISOString()
      .substring(0, 10);
    return [
      `${index + 1}위`,
      data.name,
      data.age,
      data.birthyear,
      birthDate,
      data.gender,
      data.cellphone,
      data.region,
      data.community.communityName,
      data.point,
      data.feed,
      data.poem,
      data.comment,
      data.like,
      data.pedometer,
    ];
  }

  // 1. userData + point~pedometer 추가
  function userDataFormat(userData) {
    return userData.map((element) => ({
      ...element,
      point: 0,
      feed: 0,
      poem: 0,
      like: 0,
      comment: 0,
      pedometer: 0,
    }));
  }

  // 2. 점수 및 각 영역별 카운트 (new)
  function resultDateFunc(perioddata) {
    let updateInitialuser = userDataFormat(initialuser);

    for (let i = 0; i < perioddata.length; ++i) {
      let certainUserIndex = updateInitialuser.findIndex(
        (element) => element.id === perioddata[i].user.id
      );
      if (perioddata[i].__typename === "Feed") {
        updateInitialuser[certainUserIndex].point += 10;
        ++updateInitialuser[certainUserIndex].feed;
      } else if (perioddata[i].__typename === "Poem") {
        updateInitialuser[certainUserIndex].point += 10;
        ++updateInitialuser[certainUserIndex].poem;
      } else if (perioddata[i].__typename === "Comment") {
        updateInitialuser[certainUserIndex].point += 2;
        ++updateInitialuser[certainUserIndex].comment;
      } else if (perioddata[i].__typename === "Like") {
        updateInitialuser[certainUserIndex].point += 1;
        ++updateInitialuser[certainUserIndex].like;
      } else if (perioddata[i].__typename === "Pedometer") {
        updateInitialuser[certainUserIndex].point += Math.floor(
          perioddata[i].stepCount / 1000
        );
        updateInitialuser[certainUserIndex].pedometer +=
          perioddata[i].stepCount;
      }
    }
    return updateInitialuser;
  }

  // 3. 정렬
  function criteriaSortFunc(resultData) {
    if (criteria === "점수") {
      let pointSort = resultData.sort(function (a, b) {
        return b.point - a.point;
      });
      return pointSort;
    } else if (criteria === "일상") {
      let feedSort = resultData.sort(function (a, b) {
        return b.feed - a.feed;
      });
      return feedSort;
    } else if (criteria === "시") {
      let poemSort = resultData.sort(function (a, b) {
        return b.poem - a.poem;
      });
      return poemSort;
    } else if (criteria === "댓글") {
      let commentSort = resultData.sort(function (a, b) {
        return b.comment - a.comment;
      });
      return commentSort;
    } else if (criteria === "좋아요") {
      let likeSort = resultData.sort(function (a, b) {
        return b.like - a.like;
      });
      return likeSort;
    } else if (criteria === "걸음수") {
      let pedometerSort = resultData.sort(function (a, b) {
        return b.pedometer - a.pedometer;
      });
      return pedometerSort;
    }
  }

  const initialuser = useMemo(() => {
    if (userData?.seeAllUsers !== null && userData?.seeAllUsers !== undefined) {
      return userDataFormat(userData?.seeAllUsers);
    }
  }, [userData?.seeAllUsers]);

  const datasum = useMemo(() => {
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
      return datasumArray;
    }
  }, [feedData, poemData, fpLikesData, fpCommentsData, pedometerData]);

  const perioddata = useMemo(() => {
    if (datasum !== null && datasum !== undefined) {
      return datasum.filter(
        (data) =>
          parseInt(data.createdAt) >= startDate.getTime(0, 0, 0, 0) &&
          parseInt(data.createdAt) <= endDate.getTime(23, 59, 59, 999)
      );
    }
  }, [datasum, startDate, endDate]);

  const resultdata = useMemo(() => {
    if (
      perioddata !== null &&
      perioddata !== undefined &&
      initialuser !== undefined &&
      keyword !== ""
    ) {
      return searchFunc(keyword, criteriaSortFunc(resultDateFunc(perioddata)));
    } else if (
      perioddata !== null &&
      perioddata !== undefined &&
      initialuser !== undefined &&
      keyword === ""
    ) {
      return criteriaSortFunc(resultDateFunc(perioddata));
    }
  }, [perioddata, initialuser, keyword]);

  useEffect(() => {
    if (resultdata !== null && resultdata !== undefined) {
      setLoading(true);
    }
  }, [resultdata]);

  const csvdata = useMemo(() => {
    if (resultdata !== null && resultdata !== undefined) {
      return [
        [
          "순위",
          "이름",
          "나이",
          "출생년도",
          "생일",
          "성별",
          "핸드폰 번호",
          "거주 지역",
          "소속 기관",
          "점수",
          "일상",
          "시",
          "댓글",
          "좋아요",
          "걸음수",
        ],
      ].concat(resultdata.map((item, index) => csvmap(item, index)));
    }
  }, [resultdata]);

  function tablemap(data, index) {
    const indexodd = index % 2 == 0;
    const birthDate =
      data.birthday.slice(0, 2) + " / " + data.birthday.slice(2, 4);
    return (
      <tr key={data.id}>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {index + 1}위
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.name}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.age}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.birthyear}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {birthDate}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.gender}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.cellphone}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.region}
        </td>
        <td
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}
        >
          {data.community.communityName}
        </td>
        <th
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}
        >
          {data?.point}
        </th>
        <th
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}
        >
          {data?.feed}
        </th>
        <th
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}
        >
          {data?.poem}
        </th>
        <th
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}
        >
          {data?.comment}
        </th>
        <th
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}
        >
          {data?.like}
        </th>
        <th
          className={`${
            indexodd ? "bg-gray-100" : "bg-white"
          } border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}
        >
          {data?.pedometer}
        </th>
      </tr>
    );
  }

  const onValid = (input) => {
    console.log("input", input);
    setKeyword(input?.searchname);
  };

  function searchFunc(keyword, data) {
    let searchresult = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].name.includes(keyword)) {
        searchresult.push(data[i]);
      }
    }
    return searchresult;
  }

  return (
    <Layout click="순위 정보">
      <div className="w-full flex flex-row items-start mb-10 justify-between">
        <div className="w-1/2 flex flex-col">
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
          <div className="h-5"></div>
          <div className="flex flex-row items-start">
            <span className="mr-5 font-bold">정렬 기준 설정</span>
            <select
              value={criteria}
              onChange={(event) => setCriteria(event.target.value)}
              className="border border-gray-600 border-collapse text-black py-1 w-32 border-noneoutline-none rounded-md text-center"
            >
              <option name="point" className="text-gray-600">
                점수
              </option>
              <option name="feed" className="text-gray-600">
                일상
              </option>
              <option name="poem" className="text-gray-600">
                시
              </option>
              <option name="like" className="text-gray-600">
                좋아요
              </option>
              <option name="comment" className="text-gray-600">
                댓글
              </option>
              <option name="comment" className="text-gray-600">
                걸음수
              </option>
            </select>
          </div>
        </div>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("searchname", {
              onChange: (text) => {
                setKeyword(text);
              },
            })}
            type="text"
            placeholder="이름을 검색해주세요."
            className="focus:outline-none focus:border-[#FF2D78] border-2 w-56 border-gray-500 rounded-md py-1 text-center"
          ></input>
          <button className="bg-gray-300 rounded-md py-1 px-3 ml-2">
            검색
          </button>
        </form>
        <div>
          {loading ? (
            <CSVLink
              data={csvdata}
              className="bg-gray-500 rounded-md py-2 px-5 text-white font-bold"
            >
              CSV 다운로드
            </CSVLink>
          ) : null}
        </div>
      </div>
      <table className="border-collapse">
        <tbody>
          <tr>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              순위
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-2 text-left text-sm">
              이름
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              나이
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              출생년도
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              생일
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              성별
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              핸드폰 번호
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              거주 지역
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">
              소속 기관
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">
              점수
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">
              일상
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">
              시
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">
              댓글
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">
              좋아요
            </th>
            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">
              걸음수
            </th>
          </tr>
          {loading
            ? resultdata.map((item, index) => tablemap(item, index))
            : null}
        </tbody>
      </table>
    </Layout>
  );
}
