import React from "react";
import { Link } from "react-router-dom";

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">
            Privacy Policy
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            How we collect, use, and protect your information
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  1. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Personal Information
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      When you use the Islamic Dataset Interface, we may
                      collect:
                    </p>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1 mt-2">
                      <li>Email address (if you create an account)</li>
                      <li>Name (if provided during registration)</li>
                      <li>Usage preferences and settings</li>
                      <li>Favorites and saved items</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Technical Information
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      We automatically collect certain technical information:
                    </p>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1 mt-2">
                      <li>Browser type and version</li>
                      <li>Operating system</li>
                      <li>IP address</li>
                      <li>Pages visited and time spent</li>
                      <li>Search queries and filters used</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-2">
                  <li>To provide and maintain the Islamic Dataset Interface</li>
                  <li>
                    To personalize your experience and save your preferences
                  </li>
                  <li>To improve our services and develop new features</li>
                  <li>To communicate with you about updates and changes</li>
                  <li>To ensure the security and integrity of our platform</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties. We may share information only in
                  the following circumstances:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-2 mt-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>
                    With trusted service providers who assist in operating our
                    platform
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  4. Data Security
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  We implement appropriate security measures to protect your
                  personal information:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-2 mt-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure hosting and infrastructure</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  5. Cookies and Tracking
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your
                  experience:
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Essential Cookies
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">
                      Required for basic functionality, authentication, and
                      security
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Preference Cookies
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">
                      Remember your settings, language preferences, and
                      favorites
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Analytics Cookies
                    </h4>
                    <p className="text-stone-600 dark:text-stone-400 text-sm">
                      Help us understand how users interact with our platform
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  6. Your Rights
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    data
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a
                    structured format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your
                    data
                  </li>
                  <li>
                    <strong>Withdrawal:</strong> Withdraw consent at any time
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  7. Data Retention
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes outlined in this privacy
                  policy, unless a longer retention period is required or
                  permitted by law. Account data is retained until you request
                  deletion or the account becomes inactive.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  8. Children's Privacy
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  The Islamic Dataset Interface is not intended for children
                  under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you are a parent or
                  guardian and believe your child has provided us with personal
                  information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new privacy policy on
                  this page and updating the "Last Updated" date. We encourage
                  you to review this privacy policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  10. Contact Us
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  If you have any questions about this privacy policy or our
                  data practices, please contact us:
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Email:</strong> privacy@islamicdata.com
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>General Contact:</strong> contact@islamicdata.com
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Data Protection Officer:</strong>{" "}
                    dpo@islamicdata.com
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                <strong>Last Updated:</strong> August 2025
                <br />
                <strong>Version:</strong> 1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
