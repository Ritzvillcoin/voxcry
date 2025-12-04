export default function CreatorDirectoryPage() {
  const categories = [
    { title: "Top Fitness Creators", description: "High-performing creators in fitness, wellness, and coaching.", slug: "fitness" },
    { title: "Top Beauty Creators", description: "Cosmetics, skincare, GRWM, and beauty tutorials.", slug: "beauty" },
    { title: "Top Amazon Review Creators", description: "Product reviewers and Amazon finds creators.", slug: "amazon" },
    { title: "Top Comedy & POV Creators", description: "Entertainment, skits, humor, and POV storytelling.", slug: "comedy" },
    { title: "Top Travel Creators", description: "Creators focused on travel, exploring, and lifestyle adventure.", slug: "travel" },
    { title: "Top Food & Cooking Creators", description: "Cooking demos, food reviews, and recipe creators.", slug: "food" },
    { title: "Top Tech & Gadget Creators", description: "Tech reviews, gadgets, setups, and device breakdowns.", slug: "tech" },
    { title: "Top Family & Lifestyle Creators", description: "Daily life, parenting, lifestyle vlogs, and routines.", slug: "lifestyle" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">VoxCry Creator Directory</h1>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore top-performing creators across major niches.  
          Every category is hand-curated and AI-screened using VoxCry’s performance benchmarks.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`/creator-directory/${cat.slug}`}
              className="block bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold mb-2">{cat.title}</h2>
              <p className="text-gray-500 text-sm mb-3">{cat.description}</p>
              <span className="text-blue-600 font-medium">View creators →</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
