//Component/About/AboutUs.jsx
const AboutUs = ({ data, dir }) => {
  const isRTL = dir === "rtl";

  const cardClass = `
    bg-[var(--bg-main)]
    ${isRTL ? "border-r-[5px]" : "border-l-[5px]"}
    border-[var(--bg-color-header)]
    rounded-[8px] p-[1.5rem]
    shadow-[0_3px_8px_rgba(0,0,0,0.05)]
    mb-6
    [&_h2]:text-[var(--text-accent)] [&_h2]:mb-3 [&_h2]:font-bold [&_h2]:text-[24px]
    [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mt-2
  `;

  return (
    <main dir={dir} className="max-w-[900px] mx-auto my-8 px-4">
      <section className={cardClass}>
        <h2>{data.vision.title}</h2>
        <p>{data.vision.text}</p>
      </section>

      <section className={cardClass}>
        <h2>{data.mission.title}</h2>
        <p>{data.mission.text}</p>
      </section>

      <section className={cardClass}>
        <h2>{data.aims.title}</h2>
        <ul>
          {data.aims.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section className={cardClass}>
        <h2>{data.methodology.title}</h2>
        <p>{data.methodology.text}</p>
        <ul>
          {data.methodology.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </section>

      <section className={cardClass}>
        <h2>{data.bio.title}</h2>
        <p>{data.bio.text}</p>
      </section>

      <div
        className="
        bg-[var(--bg-main)] rounded-[8px] p-5 mt-8
        italic shadow-[0_2px_5px_rgba(0,0,0,0.05)]
        text-center text-[1.05rem]
      "
      >
        {data.dua}
      </div>
    </main>
  );
};

export default AboutUs;
