import './starbound.css';

export const metadata = {
    title: "Project Starbound | ACM at CSULB",
    description:
        "ACM's flagship initiative that helps students launch real, long-term projects with mentorship, milestones, and collaboration.",
};

export default function StarboundPage() {
    return (
        <main className="starbound-page relative min-h-screen text-slate-100">
            {/* 🌌 Starry background layer */}
            <div className="starfield" />

            {/* Hero */}
            <section className="starbound-section relative z-10 px-6 pt-28 pb-16">
                <div className="container mx-auto max-w-5xl starbound-hero text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/40 bg-slate-900/50 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-slate-300">
                        Launch • Build • Thrive
                    </div>
                    <h1 className="mt-6 text-5xl font-bold text-white md:text-6xl">
                        Project Starbound
                    </h1>
                    <p className="mt-5 text-lg text-slate-300 md:text-xl">
                        ACM’s flagship initiative that empowers students to transform their ideas into
                        real, long-term projects through structured guidance, mentorship, and clear milestones.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="starbound-section relative z-10 px-6">
                <div className="container mx-auto max-w-5xl starbound-panel text-center">
                    <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                    <p className="mt-4 text-lg text-slate-300">
                        Starbound helps students take their ideas from concept to completion through guided project development.
                        We provide structure, mentorship, and checkpoints to help every participant learn, grow, and build something meaningful.
                    </p>

                    <div className="mt-12">
                        <MissionAnimation />
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="starbound-section relative z-10 px-6">
                <div className="container mx-auto">
                    <div className="starbound-panel">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Program Highlights</h2>
                                <p className="mt-3 max-w-2xl text-left text-slate-300">
                                    Starbound combines mentorship, checkpoints, and community to help your ideas take flight.
                                    Each track is designed to give you momentum, accountability, and a portfolio-worthy result.
                                </p>
                            </div>
                            <div className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                                Cohort-based • 12 weeks • Demo Day
                            </div>
                        </div>

                        <div className="mt-12 grid gap-8 md:grid-cols-4">
                            {[
                                { title: "Launch", desc: "Turn your ideas into real projects with structured guidance and direction." },
                                { title: "Milestones", desc: "Set goals, track progress, and celebrate your achievements." },
                                { title: "Mentorship", desc: "Receive guidance from experienced ACM mentors." },
                                { title: "Build", desc: "Create projects that showcase your skills and make real impact." },
                            ].map((item, idx) => (
                                <div
                                    key={item.title}
                                    data-i={idx}
                                    className="floating-card rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 text-center"
                                >
                                    <h3 className="text-xl font-semibold text-amber-300 mb-2">{item.title}</h3>
                                    <p className="text-slate-300">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="starbound-section relative z-10 px-6 pb-24">
                <div className="container mx-auto max-w-4xl starbound-panel text-center">
                    <h2 className="text-3xl font-bold text-white">Ready to Launch Your Project?</h2>
                    <p className="mt-4 text-lg text-slate-300">
                        Join Project Starbound and start building something extraordinary with ACM at CSULB.
                    </p>
                    <a href="/contact" className="starbound-button mt-8">
                        Get Involved
                    </a>
                </div>
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
