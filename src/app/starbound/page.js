import './starbound.css';

export const metadata = {
    title: "Project Starbound | ACM at CSULB",
    description:
        "ACM's flagship initiative that helps students launch real, long-term projects with mentorship, milestones, and collaboration.",
};

export default function StarboundPage() {
    return (
        <main className="relative min-h-screen bg-black text-white">
            {/* 🌌 Starry background layer */}
            <div className="starfield" />

            {/* Content sits above the stars */}
            <section className="relative z-10 text-center py-24">
                <h1 className="text-5xl font-bold mb-6">Project Starbound</h1>
                <p className="text-lg max-w-3xl mx-auto text-gray-300">
                    ACM’s flagship initiative that empowers students to transform their ideas into
                    real, long-term projects through structured guidance, mentorship, and clear milestones.
                </p>
            </section>

            <section className="relative z-10 py-20 text-center bg-black/80">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg max-w-3xl mx-auto text-gray-300 mb-10">
                    Starbound helps students take their ideas from concept to completion through guided project development.
                    We provide structure, mentorship, and checkpoints to help every participant learn, grow, and build something meaningful.
                </p>

                {/* Mission animation */}
                <MissionAnimation />
            </section>

            <section className="relative z-10 py-16 bg-black/80">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Program Highlights</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: "Launch", desc: "Turn your ideas into real projects with structured guidance and direction." },
                            { title: "Milestones", desc: "Set goals, track progress, and celebrate your achievements." },
                            { title: "Mentorship", desc: "Receive guidance from experienced ACM mentors." },
                            { title: "Build", desc: "Create projects that showcase your skills and make real impact." },
                        ].map((item, idx) => (
                            <div
                                key={item.title}
                                data-i={idx}
                                className="floating-card bg-slate-800/70 border border-slate-700 p-6 rounded-2xl text-center hover:border-amber-400 transition"
                            >
                                <h3 className="text-xl font-semibold text-amber-300 mb-2">{item.title}</h3>
                                <p className="text-gray-300">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 text-center py-20 bg-black/80">
                <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Project?</h2>
                <p className="text-lg text-gray-300 mb-8">
                    Join Project Starbound and start building something extraordinary with ACM at CSULB.
                </p>
                <a
                    href="/contact"
                    className="bg-amber-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-300 transition"
                >
                    Get Involved
                </a>
            </section>
        </main>
    );
}

/* ===== MissionAnimation component ===== */
function MissionAnimation() {
    return (
        <div className="mission-anim mx-auto max-w-5xl">
            {/* Dots + labels */}
            <div className="dot dot-left">
                <span className="dot-label">You</span>
            </div>
            <div className="dot dot-right">
                <span className="dot-label">Dream Project</span>
            </div>

            {/* Path (subtle line) */}
            <svg className="path" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 24 160 C 200 40, 400 40, 576 160" className="path-curve" />
            </svg>


            {/* Rocket */}
            <div className="rocket">
                <svg
                    className="rocket-svg"
                    viewBox="0 0 64 64"
                    aria-label="Project Starbound rocket"
                    role="img"
                >
                    <defs>
                        <linearGradient id="bodyGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#fde68a" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>
                    <g>
                        <path d="M32 4c10 8 14 26 14 26H18S22 12 32 4z" fill="url(#bodyGrad)" />
                        <circle cx="32" cy="24" r="5" fill="#0ea5e9" />
                        <path d="M18 30l-8 8 12-2zM46 30l8 8-12-2z" fill="#9ca3af" />
                        <path d="M24 38l8 10 8-10z" fill="#ef4444" />
                    </g>
                </svg>
                <span className="rocket-tag">Project Starbound</span>
            </div>
        </div>
    );
}
