import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";


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
    const [graphdata, setGraphdata] = useState([])

const getsamestandard = (beforedata) => {
    const afterdata = beforedata.reduce((a, b, c) => {
        for (let i = 0; i < (c === 0 ? 1 : c); i++){
            if(a.length === 0 || a[i].name !== b) {
                a[c] = {name: b, count: 1}
            } else {
                a[c].count++
            }   
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

const getweek = (date) => {
    var oneJan = new Date(date.getFullYear(),0,1);
    var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil(( date.getDay() + 1 + numberOfDays) / 7);
}


useEffect(() => {
    if(data !== undefined && data !== null) {
        const daydata = data.seeAllUsers.map((item) => (new Date(parseInt(item.createdAt)).toString().substring(0, 15))); 
        setGraphdata(graphrefine(getsamestandard(daydata)))
    }
}, [data, datastandard])

console.log(graphdata)

    return (
            <Layout click="회원 통계">
                <div className="ml-20">
                    <select value={datastandard} onChange={(event)=> setDatastandard(event.target.value)} name="dataStandard" id="data-standard" className="mt-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="day">일간 데이터</option> 
                        <option value="week">주간 데이터</option>   
                        <option value="month">월간 데이터</option>
                    </select>
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
    )
}