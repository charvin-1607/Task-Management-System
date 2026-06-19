import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();

  const features = [

    {
      icon: "🚀",
      title: "Fast Workflow",
      desc: "Manage your daily tasks with smooth and optimized performance.",
    },

    {
      icon: "📊",
      title: "Track Progress",
      desc: "Monitor project progress and productivity in real-time.",
    },

    {
      icon: "🤝",
      title: "Team Collaboration",
      desc: "Collaborate with your teammates efficiently and professionally.",
    },

  ];

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#0d1b28] text-white">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-violet-500/20 blur-[120px] rounded-full"></div>

      {/* NAVBAR */}

      <nav className="left-0 w-full z-50 border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent cursor-pointer">

            TaskPilot

          </h1>

          {/* BUTTONS */}

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/login")}
              className="
              px-6 py-3
              rounded-xl
              border border-white/20
              bg-white/5
              hover:bg-white
              hover:text-black
              transition-all duration-300
              font-semibold
              shadow-lg
              cursor-pointer
              "
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="
              px-6 py-3
              rounded-xl
              bg-gradient-to-r from-cyan-500 to-violet-500
              hover:scale-105
              transition-all duration-300
              font-semibold
              shadow-[0_0_25px_rgba(59,130,246,0.45)]
              cursor-pointer
              "
            >
              Signup
            </button>

          </div>

        </div>

      </nav>

      {/* HERO SECTION */}

      <section className="relative min-h-screen flex items-center justify-center px-6 pt-28">

        <div className="max-w-5xl mx-auto text-center">

          {/* SMALL BADGE */}

          <div className="inline-flex items-center px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm font-medium animate-pulse">

            Smart Task Management Platform

          </div>

          <br /><br />

          {/* HEADING */}

          <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight">

            Manage Your Tasks <br />

            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">

              Like A Professional

            </span>

          </h1>

          {/* DESCRIPTION */}

          <p className="mt-8 text-slate-300 text-lg md:text-xl leading-9 max-w-3xl mx-auto">

            Organize projects, boost productivity and collaborate
            with your team using our modern and powerful task
            management system.

          </p>

          {/* HERO BUTTONS */}

          <div className="mt-12 flex flex-wrap justify-center gap-6">

            <button
              onClick={() => navigate("/signup")}
              className="
              px-8 py-4
              rounded-2xl
              bg-gradient-to-r from-cyan-400 to-violet-500
              hover:scale-105
              transition-all duration-300
              text-lg
              font-bold
              shadow-[0_0_35px_rgba(59,130,246,0.45)]
              cursor-pointer
              "
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="
              px-8 py-4
              rounded-2xl
              border border-white/20
              bg-white/5
              hover:bg-white
              hover:text-black
              transition-all duration-300
              text-lg
              font-bold
              shadow-lg
              cursor-pointer
              "
            >
              Login
            </button>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="relative py-32 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <h2 className="text-4xl md:text-5xl font-extrabold">

              Powerful Features

            </h2>

            <p className="mt-5 text-slate-400 text-lg">

              Everything you need to manage work professionally.

            </p>

          </div>

          {/* FEATURE CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

            {features.map((item, index) => (

              <div
                key={index}
                className="
                group
                p-8
                rounded-3xl
                border border-white/10
                bg-white/5
                backdrop-blur-xl
                hover:-translate-y-3
                hover:border-cyan-400/40
                transition-all duration-500
                shadow-lg
                "
              >

                <div className="text-5xl">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-8">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ABOUT */}

      <section className="relative py-32 px-6">

        <div className="max-w-6xl mx-auto">

          <div
            className="
            rounded-[40px]
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            p-10 md:p-20
            text-center
            shadow-xl
            "
          >

            <h2 className="text-4xl md:text-5xl font-extrabold">

              Why Choose TaskFlow?

            </h2>

            <p className="mt-8 text-slate-300 text-lg leading-9 max-w-4xl mx-auto">

              TaskFlow helps developers, startups and teams
              manage projects with a modern workflow,
              beautiful interface and productivity-focused tools.
              Designed for speed, simplicity and scalability.

            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="relative py-32 px-6">

        <div className="max-w-5xl mx-auto">

          <div
            className="
            rounded-[40px]
            border border-cyan-400/20
            bg-gradient-to-r from-cyan-500/10 to-violet-500/10
            backdrop-blur-xl
            p-10 md:p-20
            text-center
            shadow-2xl
            "
          >

            <h2 className="text-4xl md:text-5xl font-extrabold">

              Ready To Boost Productivity?

            </h2>

            <p className="mt-6 text-slate-300 text-lg">

              Create your account and start managing smarter today.

            </p>

            <div className="mt-10">

              <button
                onClick={() => navigate("/signup")}
                className="
                inline-block
                px-8 py-4
                rounded-2xl
                bg-gradient-to-r from-cyan-500 to-violet-500
                hover:scale-105
                transition-all duration-300
                text-lg
                font-bold
                shadow-[0_0_35px_rgba(59,130,246,0.45)]
                cursor-pointer
                "
              >
                Create Account
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="py-10 border-t border-white/10 text-center text-slate-500">

        <p>
          © 2026 TaskFlow. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
};

export default LandingPage;