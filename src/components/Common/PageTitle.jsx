import React from 'react'

const PageTitle = ({title}) => {
  return (
    <div className='page-title text-2xl font-semibold mb-4 py-2 w-fit relative'>
        {title}
        <span className='under-bar absolute w-1/3 h-[2px] bg-gray-300 left-0 bottom-0'></span>
        </div>
  )
}

export default PageTitle