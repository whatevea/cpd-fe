import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen text-black bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl  font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: 2025-11-20</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            ChessPuzzleDirectory ("we", "our", "us") respects your privacy. This Privacy Policy explains how we
            collect, use, and protect information when you use our website and puzzle platform hosted on chesspuzzledirectory.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Information We Do Not Collect</h2>
          <p className="text-gray-700 mb-4">We do not collect:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Personal information (name, email, phone, address)</li>
            <li>Account or login data</li>
            <li>Payment information</li>
            <li>Any player-identifiable data</li>
          </ul>
          <p className="text-gray-700">
            All puzzles on ChessPuzzleDirectory are accessible without registration or personal data input.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Information That May Be Collected Automatically</h2>
          <p className="text-gray-700 mb-4">
            Like most websites, basic technical data may be collected automatically through your browser
            or analytics tools. This may include:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>IP address (anonymized if analytics supports it)</li>
            <li>Browser type and version</li>
            <li>Device type (desktop/mobile)</li>
            <li>Pages visited and time spent</li>
            <li>Referring websites</li>
          </ul>
          <p className="text-gray-700">
            We use this data only to improve site performance, debug issues, and understand usage patterns.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
          <p className="text-gray-700">
            Some features or analytics services may use cookies to improve functionality or track basic usage
            statistics. You may disable cookies in your browser settings if you prefer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">We may use third-party tools such as:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            <li>Web hosting providers</li>
            <li>Analytics platforms (e.g., Google Analytics or privacy-focused alternatives)</li>
          </ul>
          <p className="text-gray-700">
            These services may process minimal technical information as described in their own policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. No Sharing or Selling of Data</h2>
          <p className="text-gray-700">
            We do not sell, share, or transfer any user information to third parties for marketing or advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Security</h2>
          <p className="text-gray-700">
            We take reasonable measures to protect the website and any data processed by third-party services.
            However, no system can be guaranteed 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700">
            ChessPuzzleDirectory does not knowingly collect any personal information from children under 13.
            All puzzles are educational and do not require personal data to play.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. External Links</h2>
          <p className="text-gray-700">
            Our website may contain links to external websites. We are not responsible for their content or privacy practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy occasionally. Changes will be posted on this page with a new "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
          <p className="text-gray-700 mb-4">If you have questions about this Privacy Policy, contact us at:</p>
          <p className="text-gray-700">
            <a href="mailto:contact@chesspuzzledirectory.com" className="font-semibold text-blue-600 hover:text-blue-800">
              contact@chesspuzzledirectory.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
