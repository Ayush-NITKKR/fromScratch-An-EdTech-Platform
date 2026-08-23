import aboutOne from "../assets/images/aboutus1.webp";
import aboutTwo from "../assets/images/aboutus2.webp";
import aboutThree from "../assets/images/aboutus3.webp";
import foundingStory from "../assets/images/FoundingStory.png";

const stats = [
  { value: "5K+", label: "Active Learners" },
  { value: "120+", label: "Courses" },
  { value: "40+", label: "Expert Mentors" },
  { value: "95%", label: "Completion Satisfaction" },
];

import Footer from "../components/common/Footer";

const About = () => {
  return (
    <div className="w-full flex flex-col font-poppins">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 py-12 text-white flex-grow">
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
              About fromScratch
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
              Building a sharper way to learn skills that move careers forward.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-gray-300">
              fromScratch connects curious learners with practical courses, expert instructors, and a focused learning dashboard. Our goal is simple: make technical education easier to start, easier to finish, and easier to apply in real projects.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <img src={aboutOne} alt="Students learning together" className="h-48 w-full rounded-lg object-cover" />
            <img src={aboutTwo} alt="Online learning session" className="mt-8 h-48 w-full rounded-lg object-cover" />
            <img src={aboutThree} alt="Instructor mentoring learners" className="col-span-2 h-56 w-full rounded-lg object-cover" />
          </div>
        </section>

        <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold text-[#FACC15]">{item.value}</p>
              <p className="mt-1 text-sm text-gray-400">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="grid items-center gap-10 lg:grid-cols-2">
          <img src={foundingStory} alt="fromScratch founding story" className="h-full max-h-[420px] w-full rounded-lg object-cover" />
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
              Our Story
            </p>
            <h2 className="text-3xl font-bold">From scattered tutorials to guided progress.</h2>
            <p className="text-sm leading-7 text-gray-300">
              We created fromScratch for learners who want structure without losing flexibility. Every course is organized around clear sections, practical lectures, progress tracking, and reviews that help the next learner choose with confidence.
            </p>
            <p className="text-sm leading-7 text-gray-300">
              For instructors, the platform keeps course creation direct and focused, so they can publish content, manage lessons, and reach students without wrestling the tooling.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
