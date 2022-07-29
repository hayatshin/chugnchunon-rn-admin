import { gql, useQuery } from "@apollo/client";
import { argsToArgsConfig } from "graphql/type/definition";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";

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
      community{
          communityName
      }
      createdAt
      totalPointNumber
      totalLikeNumber
      totalCommentNumber
      totalFeedNumber
      totalPoemNumber
      thisweekPointNumber
      thisweekLikeNumber
      thisweekCommentNumber
      thisweekFeedNumber
      thisweekPoemNumber
      lastweekPointNumber
      lastweekLikeNumber
      lastweekCommentNumber
      lastweekFeedNumber
      lastweekPoemNumber
    }
  }
`;

export default function Rank() {
  const {
    data: alluserdata,
    loading: alluserlaoding,
    refetch: alluserrefetch,
  } = useQuery(SEE_ALL_USERS_QUERY);

  const {register, handleSubmit} = useForm()
  const [period, setPeriod] = useState("전체")
  const [criteria, setCriteria] = useState("점수")
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [searchinput, setSearchinput] = useState("")
  const [csvdata, setCsvdata] = useState([[]])

  function csvmap (data) {
    const birthDate = data.birthday.slice(0,2)+' / '+data.birthday.slice(2,4)
    const createdDate = new Date(+data.createdAt).toISOString().substring(0, 10);
    return (    
        [createdDate, data.name, data.age, data.birthyear,birthDate, data.gender, data.cellphone, data.region, data.community.communityName, data.totalPointNumber || data.thisweekPointNumber || data.lastweekPointNumber, data.totalFeedNumber || data.thisweekFeedNumber || data.lastweekFeedNumber, data.totalPoemNumber || data.thisweekPoemNumber || data.lastweekPoemNumber, data.totalCommentNumber || data.thisweekCommentNumber || data.lastweekCommentNumber, data.totalLikeNumber || data.thisweekLikeNumber || data.lastweekLikeNumber]
    )
}

  useEffect(() => {
    const result = [];
    let index = 1;
    if (alluserdata !== undefined) {       

        if (period === "전체" && criteria=== "점수") {
            const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
              return b.totalPointNumber - a.totalPointNumber;
            });
            for (let n = 0; n < sort.length; ++n) {
              const current = sort[n];
              result.push({
                ...current,
                index,
              });
              // See if the next one (if any) matches this one
              if (
                sort[n + 1]?.totalPointNumber !== current.totalPointNumber
              ) {
                ++index;
              }
            }
            setData(result);
          } else if (period === "전체" && criteria ==="일상") {
            const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
              return b.totalFeedNumber - a.totalFeedNumber;
            });
            for (let n = 0; n < sort.length; ++n) {
              const current = sort[n];
              result.push({
                ...current,
                index,
              });
              // See if the next one (if any) matches this one
              if (sort[n + 1]?.totalFeedNumber !== current.totalFeedNumber) {
                ++index;
              }
            }
            setData(result);
          } else if (period === "전체" && criteria==="댓글") {
            const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
              return b.totalClickNumber - a.totalClickNumber;
            });
            for (let n = 0; n < sort.length; ++n) {
              const current = sort[n];
              result.push({
                ...current,
                index,
              });
              // See if the next one (if any) matches this one
              if (
                sort[n + 1]?.totalClickNumber !== current.totalClickNumber
              ) {
                ++index;
              }
            }
            setData(result);
          } else if (period === "전체" && criteria==="좋아요") {
            const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
              return b.totalLikeNumber - a.totalLikeNumber;
            });
            for (let n = 0; n < sort.length; ++n) {
              const current = sort[n];
              result.push({
                ...current,
                index,
              });
              // See if the next one (if any) matches this one
              if (sort[n + 1]?.thisweekLikeNumber !== current.thisweekLikeNumber) {
                ++index;
              }
            }
            setData(result);
          } else if (period === "전체" && criteria==="시") {
            const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
              return b.totalPoemNumber - a.totalPoemNumber;
            });
            for (let n = 0; n < sort.length; ++n) {
              const current = sort[n];
              result.push({
                ...current,
                index,
              });
              // See if the next one (if any) matches this one
              if (sort[n + 1]?.totalPoemNumber !== current.totalPoemNumber) {
                ++index;
              }
            }
            setData(result);
          } 
      else if (period === "이번주" && criteria==="점수") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.thisweekPointNumber - a.thisweekPointNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (
            sort[n + 1]?.thisweekPointNumber !== current.thisweekPointNumber
          ) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "이번주" && criteria==="일상") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.thisweekFeedNumber - a.thisweekFeedNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.thisweekFeedNumber !== current.thisweekFeedNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "이번주" && criteria==="댓글") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.thisweekCommentNumber - a.thisweekCommentNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (
            sort[n + 1]?.thisweekCommentNumber !== current.thisweekCommentNumber
          ) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "이번주" && criteria==="좋아요") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.thisweekLikeNumber - a.thisweekLikeNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.thisweekLikeNumber !== current.thisweekLikeNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "이번주" && criteria==="시") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.thisweekPoemNumber - a.thisweekPoemNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.thisweekPoemNumber !== current.thisweekPoemNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "저번주" && criteria==="점수") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.lastweekPointNumber - a.lastweekPointNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (
            sort[n + 1]?.lastweekPointNumber !== current.lastweekPointNumber
          ) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "저번주" && criteria==="일상") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.lastweekFeedNumber - a.lastweekFeedNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.lastweekFeedNumber !== current.lastweekFeedNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "저번주" && criteria==="댓글") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.lastweekCommentNumber - a.lastweekCommentNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (
            sort[n + 1]?.lastweekCommentNumber !== current.lastweekCommentNumber
          ) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "저번주" && criteria==="좋아요") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.lastweekLikeNumber - a.lastweekLikeNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.lastweekLikeNumber !== current.lastweekLikeNumber) {
            ++index;
          }
        }
        setData(result);
      } else if (period === "저번주" && criteria==="시") {
        const sort = [...alluserdata.seeAllUsers].sort(function (a, b) {
          return b.lastweekPoemNumber - a.lastweekPoemNumber;
        });
        for (let n = 0; n < sort.length; ++n) {
          const current = sort[n];
          result.push({
            ...current,
            index,
          });
          // See if the next one (if any) matches this one
          if (sort[n + 1]?.lastweekPoemNumber !== current.lastweekPoemNumber) {
            ++index;
          }
        }
        setData(result);
      }
    }
  }, [
    alluserdata,
    period,
    criteria,
    searchinput
  ]);

  useEffect(()=> {
    if(data !== undefined && data!== null & data!==[]){
        setCsvdata([["순위","이름","나이","출생년도","생일","성별","핸드폰 번호","거주 지역","소속 기관", "점수","일상","시","댓글","좋아요",]].concat(data.map(item => csvmap(item))))
        setLoading(true)
    }
  }, [data])


  function tablemap (data, index) {
    const indexodd = index % 2 == 0
    const birthDate = data.birthday.slice(0,2)+' / '+data.birthday.slice(2,4)
    return (
         period === "전체" ? (
        <tr key={data.id}> 
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.index}위</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.name}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.age}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.birthyear}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{birthDate}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.gender}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.cellphone}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.region}</td>
            <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.community.communityName}</td>
            <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.totalPointNumber}</th>
            <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.totalFeedNumber}</th>
            <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.totalPoemNumber}</th>
            <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.totalCommentNumber}</th>
            <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.totalLikeNumber}</th>
            </tr>
            ) : period === "이번주"  ? (
                <tr key={data.id}> 
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.index}위</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.name}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.age}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.birthyear}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{birthDate}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.gender}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.cellphone}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.region}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.community.communityName}</td>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.thisweekPointNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.thisweekFeedNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.thisweekPoemNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.thisweekCommentNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.thisweekLikeNumber}</th>
                </tr>
            ) : period === "저번주" ? (
                <tr key={data.id}> 
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.index}위</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.name}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.age}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.birthyear}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{birthDate}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.gender}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.cellphone}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.region}</td>
                <td className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-left text-sm`}>{data.community.communityName}</td>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.lastweekPointNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.lastweekFeedNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.lastweekPoemNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.lastweekCommentNumber}</th>
                <th className={`${indexodd ? "bg-gray-100" : "bg-white"} border-b-1 border-slate-300 justify-center items-center px-2 py-1 text-center text-sm`}>{data.lastweekLikeNumber}</th>
                </tr>
            ) : null 
    )
}

const onValid = (input) => {
    const searchresult = []
    for(let i = 0; i <data.length; i++) {
       if(data[i].name === input.searchname) {
        searchresult.push(data[i])
       }
    }
    setData(searchresult)
}

    return (
        <Layout click="순위 정보">
            <div className="w-full flex flex-row items-center mb-10 justify-between">
                <div className="w-1/2 flex flex-row items-center">
                    <span className="mr-5 font-bold">기간 설정</span>
                    <select value={period} onChange={(event)=> setPeriod(event.target.value)} className="border border-gray-600 border-collapse text-black py-1 w-32 border-noneoutline-none rounded-md text-center">
                        <option name="total" className="text-gray-600">전체</option>
                        <option name="thisweek" className="text-gray-600">이번주</option>
                        <option name="lastweek" className="text-gray-600">저번주</option>
                    </select>
                    <div className="w-8"></div>
                    <span className="mr-5 font-bold">기준 설정</span>
                    <select value={criteria} onChange={(event)=> setCriteria(event.target.value)} className="border border-gray-600 border-collapse text-black py-1 w-32 border-noneoutline-none rounded-md text-center">
                        <option name="point" className="text-gray-600">점수</option>
                        <option name="feed" className="text-gray-600">일상</option>
                        <option name="poem" className="text-gray-600">시</option>
                        <option name="like" className="text-gray-600">좋아요</option>
                        <option name="comment" className="text-gray-600">댓글</option>
                    </select>
                </div>
                <form onSubmit={handleSubmit(onValid)}>
                    <input
                        {...register("searchname", { required: "이름을 적어주세요." })}
                        onChange={(text)=> setSearchinput(text)}
                        type="text" placeholder="이름을 검색해주세요." className="focus:outline-none focus:border-[#FF2D78] border-2 w-56 border-gray-500 rounded-md py-1 text-center"></input>
                    <button className="bg-gray-300 rounded-md py-1 px-3 ml-2">검색</button>
                </form>
                <div>
                    <CSVLink data={csvdata} className="bg-gray-500 rounded-md py-2 px-5 text-white font-bold">CSV 다운로드</CSVLink>
                </div>
            </div>
            <table className="border-collapse">
                    <tbody>
                        <tr>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">순위</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-2 text-left text-sm">이름</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">나이</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">출생년도</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">생일</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">성별</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">핸드폰 번호</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">거주 지역</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-left text-sm">소속 기관</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">점수</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">일상</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">시</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">댓글</th>
                            <th className="border-b-2 border-slate-700 justify-center items-center px-2 py-1 text-center text-sm">좋아요</th>
                        </tr> 
                       { loading ? data.map((item, index) => tablemap(item, index)) : null}
                    </tbody>
                </table>        
        </Layout>
    )
}