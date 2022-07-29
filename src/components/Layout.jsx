import { useNavigate } from "react-router-dom";
import { menuclick } from "../libs/utils";
import sjcm from "../assets/sjcm.png"

export default function Layout({click, children}) {
    const navigation = useNavigate()

    return (
    <div className="min-w-screen h-screen flex flex-row">
        <div className="w-64 h-full bg-gray-100 border-r border-gray-300 flex flex-col py-5" >
            <div className="px-5">
                <h3 className="text-[#FF2D78] font-medium text-2xl mb-10">청춘온</h3>
                <img src={sjcm} />
                <h3 className="font-medium text-xl mt-5 mb-10">성주군 치매안심센터</h3>
            </div>
            <div  className="flex flex-col space-y-3">
                <div onClick={() => navigation('/statistics')} className={menuclick("px-5 py-2 flex flex-row space-x-3 cursor-pointer w-full", click === "회원 통계" ? "bg-white": null )}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">회원 통계</span>
                    </div>
                <div onClick={() => navigation('/manage')} className={menuclick("px-5 py-2 flex flex-row space-x-3 cursor-pointer w-full", click === "회원 관리" ? "bg-white": null )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
</svg>
                    <span className="text-gray-600">회원 관리</span>
                </div>
                <div onClick={() => navigation('/activity')} className={menuclick("px-5 py-2 flex flex-row space-x-3 cursor-pointer w-full", click === "활동 통계" ? "bg-white": null )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    <span className="text-gray-600">활동 통계</span>
                </div>
                <div onClick={() => navigation('/rank')} className={menuclick("px-5 py-2 flex flex-row space-x-3 cursor-pointer w-full", click === "순위 정보" ? "bg-white": null )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path d="M12 14l9-5-9-5-9 5 9 5z" />
  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
<path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
</svg>
                    <span className="text-gray-600">순위 정보</span>
                </div>
                <div onClick={() => navigation('/notice')} className={menuclick("px-5 py-2 flex flex-row space-x-3 cursor-pointer w-full", click === "공지 관리" ? "bg-white": null )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
</svg>
                    <span className="text-gray-600">공지 관리</span>
                </div>
            </div>
        </div>
        <div className="flex flex-col w-full h-full justify-start p-5">
            {children}
        </div>
    </div>
    )
}