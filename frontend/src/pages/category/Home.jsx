import React from 'react'
import Card from '../../components/Card';
const data = [
  {
    title: "Register Category",
    desc: "Effectively register the categories of that the members are going to be part of.",
    icon: ".➕",
    href : "/category/create/"
  },
  {
    title: "View Category",
    desc: "Display and view all the registered categories and be able to analyse them",
    icon: ".🪟",
    href : "/category/view/"
  },
]
const CategoryHome = () => {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center py-32 px-5">
      <div className="head">
        <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed text-center">
          Effective management and manipulation of the members categories
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
  );
}

export default CategoryHome