import React from "react";
import { Link } from "react-router-dom";

const Terms: React.FC = () => {
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
            Terms of Use
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Terms and conditions for using the Islamic Dataset Interface
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  By accessing and using the Islamic Dataset Interface, you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  2. Use License
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the
                  Islamic Dataset Interface for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>
                    Use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    Attempt to reverse engineer any software contained in the
                    application
                  </li>
                  <li>
                    Remove any copyright or other proprietary notations from the
                    materials
                  </li>
                  <li>
                    Transfer the materials to another person or "mirror" the
                    materials on any other server
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  3. Disclaimer
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  The materials on the Islamic Dataset Interface are provided on
                  an 'as is' basis. The application makes no warranties,
                  expressed or implied, and hereby disclaims and negates all
                  other warranties including without limitation, implied
                  warranties or conditions of merchantability, fitness for a
                  particular purpose, or non-infringement of intellectual
                  property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  4. Limitations
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  In no event shall the Islamic Dataset Interface or its
                  suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to
                  business interruption) arising out of the use or inability to
                  use the materials, even if the application or an authorized
                  representative has been notified orally or in writing of the
                  possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  5. Accuracy of Materials
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  The materials appearing on the Islamic Dataset Interface could
                  include technical, typographical, or photographic errors. The
                  application does not warrant that any of the materials on the
                  application are accurate, complete, or current. The
                  application may make changes to the materials contained on the
                  application at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  6. Links
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  The Islamic Dataset Interface has not reviewed all of the
                  sites linked to its application and is not responsible for the
                  contents of any such linked site. The inclusion of any link
                  does not imply endorsement by the application of the site. Use
                  of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  7. Modifications
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  The Islamic Dataset Interface may revise these terms of use
                  for its application at any time without notice. By using this
                  application, you are agreeing to be bound by the then current
                  version of these Terms and Conditions of Use.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  8. Governing Law
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with the laws and you irrevocably submit to the
                  exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
                  9. Contact Information
                </h2>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  If you have any questions about these Terms of Use, please
                  contact us:
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Email:</strong> begumsabina81193@gmail.com
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

export default Terms;
