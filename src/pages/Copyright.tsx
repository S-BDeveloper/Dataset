import React from "react";
import { Link } from "react-router-dom";

const Copyright: React.FC = () => {
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
            Copyright Notice
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Legal protection and intellectual property rights
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg p-8">
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-200 mb-6">
              © 2024 Islamic Dataset Interface. All rights reserved.
            </h2>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Copyright Protection
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  This application and its contents are protected by copyright
                  laws and international treaties. Unauthorized reproduction,
                  distribution, or modification of this software is strictly
                  prohibited.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Protected Elements
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Code and Software
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>
                        All source code, including React components, TypeScript
                        files, and configuration files
                      </li>
                      <li>Web Workers and optimization algorithms</li>
                      <li>Custom hooks and utility functions</li>
                      <li>CSS styles and design system</li>
                      <li>Build configurations and deployment scripts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Content and Data
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>Islamic data processing and presentation logic</li>
                      <li>Quran and Hadith data integration systems</li>
                      <li>Search and filtering algorithms</li>
                      <li>User interface design and components</li>
                      <li>Documentation and user guides</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Design and Assets
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>Visual design elements and layouts</li>
                      <li>Color schemes and typography</li>
                      <li>Icons, graphics, and visual assets</li>
                      <li>User experience patterns and interactions</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Permitted Uses
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Personal Use
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>
                        Running the application for personal study and research
                      </li>
                      <li>Modifying the code for personal learning purposes</li>
                      <li>Creating derivative works for personal use only</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Educational Use
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>Using the application in educational settings</li>
                      <li>Teaching and demonstrating Islamic knowledge</li>
                      <li>Academic research and scholarly work</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Prohibited Uses
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Commercial Use
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>Selling or licensing the application</li>
                      <li>Using the application in commercial products</li>
                      <li>Monetizing the application without permission</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 dark:text-stone-300">
                      Distribution
                    </h4>
                    <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                      <li>Redistributing the application without permission</li>
                      <li>Sharing modified versions publicly</li>
                      <li>
                        Including the application in other software packages
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Contact Information
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  For licensing inquiries, permissions, or copyright questions,
                  please contact:
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-stone-600 dark:text-stone-400">
                    <strong>Email:</strong> begumsabina81193@gmail.com
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-3">
                  Legal Compliance
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  This copyright notice complies with:
                </p>
                <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 ml-4 space-y-1">
                  <li>
                    Berne Convention for the Protection of Literary and Artistic
                    Works
                  </li>
                  <li>
                    World Intellectual Property Organization (WIPO) standards
                  </li>
                  <li>Digital Millennium Copyright Act (DMCA)</li>
                  <li>International copyright treaties</li>
                </ul>
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

export default Copyright;
