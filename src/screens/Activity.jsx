import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const SEE_ADMIN_FEED = gql`
  query seeAdminAllFeeds {
    seeAdminAllFeeds {
      id
      createdAt
    }
  }
`

const SEE_ADMIN_POEM = gql`
  query seeAdminAllPoems {
    seeAdminAllPoems {
      id
      createdAt
    }
  }
`

const SEE_ADMIN_FPLIKES = gql`
  query seeAdminAllLikes {
    seeAdminAllLikes {
      id
      createdAt
    }
  }
`

const SEE_ADMIN_FPCOMMENTS = gql`
  query seeAdminAllComments {
    seeAdminAllComments {
      id
      createdAt
    }
  }
`

export default function Activity() {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date().getTime())
  const {data: feedData} = useQuery(SEE_ADMIN_FEED)
  const {data: poemData} = useQuery(SEE_ADMIN_POEM)
  const {data: fpLikesData} = useQuery(SEE_ADMIN_FPLIKES)
  const {data: fpCommentsData} = useQuery(SEE_ADMIN_FPCOMMENTS)
  const [datasum, setDatasum] = useState([])

  const [perioddata, setPerioddata] = useState([])
  const [graphdata, setGraphdata] = useState([])
  const [loading, setLoading] = useState(false)

  const convertData =(date) => `${new Date(parseInt(date)).getMonth() +1}월 ${new Date(parseInt(date)).getDate()}일`

  const getsamestandard = (beforedata) => {
    const afterdata = beforedata.reduce((a, b, c) => {
        if (a.some(element => element.createdAt === convertData(b.createdAt))){
            const certainele = a.find(element => element.createdAt === convertData(b.createdAt))
              if(b.__typename === "Feed"){
                certainele.feed ++
              } else if (b.__typename === "Poem"){
                certainele.poem ++
              } else if (b.__typename === "Feedpoemlike"){
                certainele.like ++
              } else if (b.__typename === "Feedpoemcomment"){
                certainele.comment ++
              }
            } else {
              if(b.__typename === "Feed"){
                a.push({createdAt: convertData(b.createdAt), feed:1, poem: 0, like:0, comment: 0})
              } else if (b.__typename === "Poem"){
                a.push({createdAt:convertData(b.createdAt), feed:0, poem: 1, like:0, comment: 0})
              } else if (b.__typename === "Feedpoemlike"){
                a.push({createdAt: convertData(b.createdAt), feed:0, poem: 0, like:1, comment: 0})
              } else if (b.__typename === "Feedpoemcomment"){
                a.push({createdAt: convertData(b.createdAt), feed:0, poem: 1, like:0, comment: 1})
              }     
            }
            return a
    }, [])
    return afterdata.sort((a, b) => new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
}

const graphrefine = (beforerefine) => {
        for (let i = 0; i < beforerefine.length; i++) {
        beforerefine[i]['name'] = beforerefine[i]['createdAt']
        beforerefine[i]['점수'] = beforerefine[i]['point']
        beforerefine[i]['일상'] = beforerefine[i]['feed']
        beforerefine[i]['시'] = beforerefine[i]['poem']
        beforerefine[i]['댓글'] = beforerefine[i]['comment']
        beforerefine[i]['좋아요'] = beforerefine[i]['like']
        delete beforerefine[i]['createdAt']
        delete beforerefine[i]['point']
        delete beforerefine[i]['feed']
        delete beforerefine[i]['poem']
        delete beforerefine[i]['comment']
        delete beforerefine[i]['like']
    }
    return beforerefine
}

useEffect(() => {
  if(feedData !== undefined && feedData !== null && poemData !== undefined && poemData !== null && fpLikesData !== undefined && fpLikesData !== null & fpCommentsData !== undefined && fpCommentsData !== null) {
    setDatasum((oldArray)=> oldArray.concat(feedData.seeAdminAllFeeds).concat(poemData.seeAdminAllPoems).concat(fpLikesData.seeAdminAllLikes).concat(fpCommentsData.seeAdminAllComments))
  }
}, [feedData, poemData, fpLikesData, fpCommentsData])

useEffect(() => {
    if(datasum !== undefined && datasum  !== null) {
      console.log("datasum", datasum)
    setPerioddata(datasum.filter(item => parseInt(item.createdAt) >= startDate && parseInt(item.createdAt) <= endDate).sort( function(a, b) {
        return a.createdAt - b.createdAt
    }))
}
}, [datasum, startDate, endDate])


useEffect(() => {
  if(perioddata !== []) {
      setGraphdata(graphrefine(getsamestandard(perioddata)))
      setLoading(true)
  }
}, [perioddata])

    return (
        <Layout click="활동 통계">
                <div className="w-full flex flex-row justify-between items-center mb-5">
                    <div className="w-60 flex flex-row">
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date.setHours(0,0,0,0))} className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center mr-3" />
                        <span className="text-gray-500 font-bold text-lg"> - </span>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date.setHours(23,59,59,999))} className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center ml-3"/>
                    </div>
                    </div>
                    {loading? 
                    <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                              width={500}
                              height={300}
                              data={graphdata}
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
                              <Line type="monotone" dataKey="일상" stroke="#FF2D78" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="시" stroke="#23A621" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="댓글" stroke="#1678BC" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="좋아요" stroke="#956BB" activeDot={{ r: 8 }} />
                              </LineChart>
                          </ResponsiveContainer>
                          : null }
        </Layout>
    )
}