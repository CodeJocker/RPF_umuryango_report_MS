import React from "react";
import Card from "../components/Card";

const Home = () => {
  const features = [
    {
      title: "Manage Categories",
      description:
        "Here you can manage the categories of the members of the RPF family community",
      icon: "⚡",
      href : "/category"
    },
    {
      title: "Manage Members",
      description:
        "Here you can manage members of a certain category group ",
      icon: "📱",
      href : "/members"
    },
    {
      title: "Manage Payment Report",
      description:
        "Here you can effectively manage the payment report making in effective way",
      icon: "🧩",
      href : "/payment-report"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="px-6 py-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to RPF Report
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Rapport y'umusanzu w'umuryango RPF inkotanyi umudugudu wa kadobogo
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What you can do here
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                href={feature.href}
                title={feature.title}
                desc={feature.description}
                icon={feature.icon}
                className="transform hover:scale-105 transition-transform duration-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
