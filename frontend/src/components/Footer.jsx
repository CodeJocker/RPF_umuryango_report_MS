import React from 'react'

const Footer = () => {
  return (
      <div className="bg-slate-900 px-6 py-8 text-center border-t border-slate-700">
        <p className="text-slate-400">
          copyright &copy; {new Date().getFullYear()} RPF Report. All rights reserved.
        </p>
      </div>
  )
}

export default Footer