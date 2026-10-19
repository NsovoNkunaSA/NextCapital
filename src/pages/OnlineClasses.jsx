import { useState } from "react";

const topics = ["All topics", "Money basics", "Business", "Investing"];

const courses = [
  { id: "budget", title: "Build a budget that works", topic: "Money basics", duration: "12 min", lessons: 4, description: "Map income, fixed costs and flexible spending into a plan you can maintain." },
  { id: "cashflow", title: "Understand your cash flow", topic: "Business", duration: "16 min", lessons: 5, description: "See when money comes in, when it goes out and how to plan for the gaps." },
  { id: "payments", title: "Digital payments for small business", topic: "Business", duration: "10 min", lessons: 3, description: "Compare payment options, fees and simple ways to reconcile transactions." },
  { id: "interest", title: "Interest and the cost of borrowing", topic: "Money basics", duration: "14 min", lessons: 4, description: "Learn how rates, repayment periods and fees affect the total you repay." },
  { id: "risk", title: "Investing: risk, time and goals", topic: "Investing", duration: "18 min", lessons: 6, description: "Connect your time horizon and comfort with risk to an investment plan." },
  { id: "fraud", title: "Spot common payment scams", topic: "Business", duration: "9 min", lessons: 3, description: "Recognise suspicious proof of payment, impersonation and urgent requests." },
];

export default function OnlineClasses() {
  const [topic, setTopic] = useState("All topics");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState([]);
  const visibleCourses = courses.filter((course) => {
    const matchesTopic = topic === "All topics" || course.topic === topic;
    const searchText = `${course.title} ${course.description} ${course.topic}`.toLowerCase();
    return matchesTopic && searchText.includes(query.trim().toLowerCase());
  });

  function toggleCompleted(courseId) {
    setCompleted((current) => current.includes(courseId)
      ? current.filter((id) => id !== courseId)
      : [...current, courseId]);
  }

  return (
    <main className="page-shell learning-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">LEARN AT YOUR PACE</p>
          <h1>Online classes</h1>
          <p>Short, practical lessons for everyday money decisions and growing a business.</p>
        </div>
        <div className="learning-progress" aria-live="polite">
          <strong>{completed.length} <span>/ {courses.length}</span></strong>
          <span>classes completed</span>
        </div>
      </section>

      <section className="learning-controls" aria-label="Find a class">
        <label className="search-field">
          <span className="field-label">Search classes</span>
          <input className="field-control" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try cash flow or payments" />
        </label>
        <div className="topic-filters" role="group" aria-label="Filter classes by topic">
          {topics.map((item) => (
            <button className={`filter-button ${topic === item ? "selected" : ""}`} type="button" key={item} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>
          ))}
        </div>
      </section>

      <section className="course-grid" aria-live="polite">
        {visibleCourses.map((course) => {
          const isCompleted = completed.includes(course.id);
          return (
            <article className={`course-card ${isCompleted ? "course-complete" : ""}`} key={course.id}>
              <div className="course-card-top"><span className="course-topic">{course.topic}</span><span>{course.duration}</span></div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <div className="course-card-bottom">
                <span>{course.lessons} short lessons</span>
                <button className="course-toggle" type="button" aria-pressed={isCompleted} onClick={() => toggleCompleted(course.id)}>
                  {isCompleted ? "Completed ✓" : "Mark complete"}
                </button>
              </div>
            </article>
          );
        })}
        {visibleCourses.length === 0 && (
          <p className="empty-state">No classes match that search. Try another phrase or choose a different topic.</p>
        )}
      </section>
    </main>
  );
}