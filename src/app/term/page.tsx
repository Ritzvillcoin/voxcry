export const metadata = {
  title: "Terms of Service — VoxCry",
  description: "Terms of Service for VoxCry AI-powered creator screening.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-gray-400">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-invert mt-8 space-y-6">
        <p>
          Welcome to VoxCry. By using our website or services, you agree to these Terms of
          Service. If you do not agree, please do not use the platform.
        </p>

        <h2>1. Overview</h2>
        <p>
          VoxCry provides AI-powered creator screening to help brands evaluate UGC creators
          based on publicly available content such as TikTok profile screenshots.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old to use our Services. Agencies must have permission
          or legitimate interest when evaluating creators.
        </p>

        <h2>3. Use of the Service</h2>
        <p>You agree not to misuse VoxCry, including by:</p>
        <ul>
          <li>Uploading illegal or harmful content</li>
          <li>Scraping, copying, or reverse-engineering our system</li>
          <li>Using reports to harass or discriminate against creators</li>
        </ul>

        <h2>4. Your Data</h2>
        <p>
          You retain rights to the screenshots and information you upload. You confirm you have
          permission to analyze the data you submit.
        </p>

        <h2>5. AI-Generated Output</h2>
        <p>
          AI-generated insights may contain errors. All outputs should be reviewed by a human
          before making decisions.
        </p>

        <h2>6. Payments & Refunds</h2>
        <p>
          Payments for reports, credits, or subscriptions are non-refundable except as required
          by law.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          All platform technology, designs, and analysis logic belong to VoxCry and may not be
          copied or resold.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          VoxCry is not liable for indirect or consequential damages. Total liability is limited
          to the amount paid in the last 30 days.
        </p>

        <h2>9. Contact</h2>
        <p>
          If you have questions, email <span className="underline">hello@voxcry.com</span>.
        </p>
      </div>
    </section>
  );
}
