import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — VoxCry",
  description: "Privacy Policy for VoxCry AI-powered creator screening.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-gray-400">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-invert mt-8 space-y-6">

        {/* ... content ... */}

        <h2>8. Contact</h2>
        <p>
          For privacy-related questions, please{" "}
          <Link href="/#contact" className="underline hover:text-gray-300">
            contact us
          </Link>.
        </p>

      </div>
    </section>
  );
}
