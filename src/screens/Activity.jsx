import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const SEE_ALL_USERS = gql`
  query seeAllUsers {
    seeAllUsers {
      id
      createdAt
      totalPointNumber
      totalLikeNumber
      totalCommentNumber
      totalFeedNumber
      totalPoemNumber
    }
  }
`;

export default function Activity() {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date().getTime())
  const {data} = useQuery(SEE_ALL_USERS)
  const [perioddata, setPerioddata] = useState([])
  const [graphdata, setGraphdata] = useState([])
  const [loading, setLoading] = useState(false)
  const [pointdata, setPointdata] = useState([])
  const [feeddata, setFeeddata] = useState([])
  const [poemdata, setPoemdata] = useState([])
  const [commentdata, setCommentdata] = useState([])
  const [likedata, setLikedata] = useState([])

  const getsamestandard = (beforedata) => {
    const afterdata = beforedata.reduce((a, b, c) => {
        if (a.some(element => element.createdAt === b.createdAt)){
            const certainele = a.find(element => element.createdAt === b.createdAt)
            certainele.point = parseInt(certainele.point) + parseInt(b.totalPointNumber) 
            certainele.feed = parseInt(certainele.feed) + parseInt(b.totalFeedNumber) 
            certainele.poem = parseInt(certainele.poem) + parseInt(b.totalPoemNumber) 
            certainele.comment = parseInt(certainele.comment) + parseInt(b.totalCommentNumber) 
            certainele.like = parseInt(certainele.like) + parseInt(b.totalLikeNumber) 

            } else {
                a.push({createdAt: b.createdAt, point: b.totalPointNumber, feed:b.totalFeedNumber, poem: b.totalPoemNumber, like: b.totalLikeNumber, comment: b.totalCommentNumber})
            }
            return a
    }, [])
    return afterdata.sort((a, b) => new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
}

const graphrefine = (beforerefine) => {
        for (let i = 0; i < beforerefine.length; i++) {
          console.log(beforerefine[i].createdAt)
        beforerefine[i].createdAt = `${new Date(parseInt(beforerefine[i].createdAt)).getMonth() +1}월 ${new Date(parseInt(beforerefine[i].createdAt)).getDate()}일`
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
    if(data !== undefined && data  !== null) {
    setPerioddata([...data.seeAllUsers].filter(item => parseInt(item.createdAt) >= startDate && parseInt(item.createdAt) <= endDate).sort( function(a, b) {
        return a.createdAt - b.createdAt
    }))
}
}, [data, startDate, endDate])


useEffect(() => {
  if(perioddata !== []) {
      setGraphdata(graphrefine(getsamestandard(perioddata)))
      getsamestandard(perioddata)
      setLoading(true)
  }
}, [perioddata])

console.log(graphdata)

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
                              <Line type="monotone" dataKey="점수" stroke="#FF2D78" activeDot={{ r: 8 }} strokeWidth={2} />
                              <Line type="monotone" dataKey="일상" stroke="#956BBF" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="시" stroke="#23A621" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="댓글" stroke="#1678BC" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="좋아요" stroke="#FE7F0D" activeDot={{ r: 8 }} />
                              </LineChart>
                          </ResponsiveContainer>
                          : null }
        </Layout>
    )
}