
// Component/About/AboutUs.jsx

const AboutUs = ({ data, dir }) => {
   return (
    <main className="container" dir={dir}>
      <section className="card">
        <h2>{data.vision.title}</h2>
        <p>{data.vision.text}</p>
      </section>

      <section className="card">
        <h2>{data.mission.title}</h2>
        <p>{data.mission.text}</p>
      </section>

      <section className="card">
        <h2>{data.aims.title}</h2>
        <ul>
          {data.aims.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>{data.methodology.title}</h2>
        <p>{data.methodology.text}</p>
        <ul>
          {data.methodology.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>{data.bio.title}</h2>
        <p>{data.bio.text}</p>
      </section>

      <div className="dua-section">{data.dua}</div>
    </main>
  );
};

export default AboutUs;
