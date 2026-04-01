import React from 'react'

const Btn1 = (props) => {
  return (
    <button className='bg-purple-700 text-white px-4 py-2 whitespace-nowrap flex items-center justify-center rounded-xl font-semibold'>
        {props.text}
    </button>
  )
}

export default Btn1