import React from 'react'
import Card from '../../components/Card';
const data = [
  {
    title: "Register Members",
    desc: "Effectively register the members of the RPF family community into defined categories.",
    icon: ".➕",
    href : "/members/create/"
  },
  {
    title: "View Members",
    desc: "Display and view all the registered members and be able to analyse them",
    icon: ".🪟",
    href : "/members/view/"
  },
]

const MembersHome = () => {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center py-32 px-5">
      <div className="head">
        <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed text-center">
          Effective management and manipulation of the members 
        </p>
      </div>
      <div className="cardsx grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((item) => (
          <Card
            title={item.title}
            desc={item.desc}
            icon={item.icon}
            href={item.href}
            className="transform hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>
    </div>
  )
}

export default MembersHome;
