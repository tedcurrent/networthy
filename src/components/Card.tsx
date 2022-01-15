import React, { FC } from 'react'

const Card: FC = ({ children }) => {
  return (
    <div className="rounded bg-slate-700 drop-shadow-md p-3 -mx-3">
      {children}
    </div>
  )
}

export default Card
