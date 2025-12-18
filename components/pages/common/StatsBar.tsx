type StatItem = {
  value: string;
  label: string;
};

const stats: StatItem[] = [
  { value: "64+", label: "Components Created" },
  { value: "20k", label: "Components Created" },
  { value: "64+", label: "Components Created" },
  { value: "20k", label: "Components Created" },
];

export default function StatsBar() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-blue-300 to-blue-900 py-10 transition-colors duration-700">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-3xl font-extrabold text-white md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-100">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
