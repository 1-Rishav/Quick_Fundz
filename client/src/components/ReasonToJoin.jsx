import React from 'react'
import joinplatform from '../assets/WhytoJoin.jpg'
import GraphCharts from './GraphCharts'

function ReasonToJoin({handleDetail}) {
  return (

    <div className='max-sm:px-2 md:px-8 lg:px-14 xl:px-20  relative top-16 text-3xl flex flex-col items-center justify-center '>
        <div>
        <h1 className='text-5xl font-bold m-5 mb-16'>Our Platform Performance Insights</h1>
        </div>
        {/* <div className='relative top-5 h-[58vh] w-full'>
            <img src={joinplatform} alt="Why P2P" className='rounded-sm h-full w-full'/>
        </div> */}
       <div className=' flex items-center justify-center rounded-xl gradient-bg-services h-full w-full object-contain mt-8'>
        <GraphCharts platformDetail={handleDetail}/>
       </div>
    </div>

  )
}

export default ReasonToJoin