import React from 'react'

const Popup = ({text}) => {
  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
            <p class="text-3xl font-bold text-gray-800 mb-8">
              {text}
            </p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          </div>
        </div>
  )
}

export default Popup