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
        <p>
          This Privacy Policy describes how VoxCry (“we,” “us”) collects, uses, and protects
          your information when you use our AI-powered creator screening services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect:</p>
        <ul>
          <li>Name, email, and messages you submit</li>
          <li>Creator screenshots or data you upload</li>
          <li>Analytics such as IP address and browser type</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Generate creator screening reports</li>
          <li>Improve our AI accuracy and user experience</li>
          <li>Respond to demo or access requests</li>
          <li>Maintain platform security</li>
        </ul>

        <h2>3. Uploaded Screenshots</h2>
        <p>
          Uploaded images are processed securely and deleted after your report is generated. We
          do not share creator screenshots with third parties.
        </p>

        <h2>4. Payment Information</h2>
        <p>
          Payments are processed by trusted third-party providers such as Stripe or Lemon
          Squeezy. We do not store credit card numbers.
        </p>

        <h2>5. Your Rights</h2>
        <p>You may request access, correction, or deletion of your data at any time.</p>

        <h2>6. Children’s Privacy</h2>
        <p>VoxCry is not intended for children under 13.</p>

        <h2>7. Updates</h2>
        <p>
          We may update this policy periodically. Continued use of the service indicates
          acceptance of changes.
        </p>

        <h2>8. Contact</h2>
        <p>
  For privacy-related questions, please{" "}
  <a href="/#contact" className="underline hover:text-gray-300">
    contact us
  </a>.
</p>

      </div>
    </section>
  );
}
