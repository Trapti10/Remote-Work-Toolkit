import React from 'react'

const Btn1 = (props) => {
  return (
    <button className='bg-purple-700 text-white p-2 w-30 whitespace-nowrap flex items-center justify-center rounded-xl font-semibold'>
        {props.text}
    </button>
  )
}

export default Btn1