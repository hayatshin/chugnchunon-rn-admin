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
        }
    }
`


export default function Statistics() {
    const [datastandard, setDatastandard] = useState("일간 데이터")
    const {data} = useQuery(SEE_ALL_USERS)
    const [loading, setLoading] = useState(false)
    const [perioddata, setPerioddata] = useState([])
    const [graphdata, setGraphdata] = useState([])
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [endDate, setEndDate] = useState(new Date().getTime())


const getsamestandard = (beforedata) => {
    const afterdata = beforedata.reduce((a, b, c) => {
        if (a.some(element => element.name === b)){
            const certainele = a.find(element => element.name === b)
            certainele.count ++
            } else {
                a.push({name: b, count: 1})
            }
            return a
    }, [])
    return afterdata.sort((a, b) => new Date(a.name).getTime()-new Date(b.name).getTime())
}

const graphrefine = (beforerefine) => {
        for (let i = 0; i < beforerefine.length; i++) {
        beforerefine[i].name = `${new Date(beforerefine[i].name).getMonth() +1}월 ${new Date(beforerefine[i].name).getDate()}일`
        beforerefine[i]['등록자수'] = beforerefine[i]['count']
        delete beforerefine[i]['count']
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
        const daydata = perioddata.map((item) => (new Date(parseInt(item.createdAt)).toString().substring(0, 15))); 
        setGraphdata(graphrefine(getsamestandard(daydata)))
        setLoading(true)
    }
}, [perioddata])

    return   loading ? 
            <Layout click="회원 통계">
                <div className="w-full flex flex-row justify-between items-center mb-5">
                    <div className="w-60 flex flex-row">
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date.setHours(0,0,0,0))} className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center mr-3" />
                        <span className="text-gray-500 font-bold text-lg"> - </span>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date.setHours(23,59,59,999))} className="border border-gray-500 bg-gray-50 text-black py-1 rounded-md font-bold text-center ml-3"/>
                    </div>
                    </div>
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
                    <Line type="monotone" dataKey="등록자수" stroke="#FF2D78" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Layout>
            : null 
      
}