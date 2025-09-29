import React from 'react';

export function TermsOfServiceContent() {
  return (
    <>
      <div className="text-center mb-8">
        <p className="text-body text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">1. Acceptance of Terms</h3>
        <p className="text-body mb-4">
          By accessing and using Board Yet ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">2. Description of Service</h3>
        <p className="text-body mb-4">
          Board Yet is a project management platform that allows users to organize tasks, collaborate with teams, and track progress on projects. The service includes but is not limited to:
        </p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Task and project management tools</li>
          <li>Team collaboration features</li>
          <li>Progress tracking and reporting</li>
          <li>Organization management</li>
          <li>Invitation and member management systems</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">3. User Accounts</h3>
        <p className="text-body mb-4">
          To access certain features of the Service, you must register for an account. You agree to:
        </p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and update your account information</li>
          <li>Maintain the security of your password and account</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">4. Acceptable Use</h3>
        <p className="text-body mb-4">You agree not to use the Service to:</p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the rights of others</li>
          <li>Distribute spam, malware, or other harmful content</li>
          <li>Attempt to gain unauthorized access to the Service or other accounts</li>
          <li>Interfere with the proper functioning of the Service</li>
          <li>Use the Service for any illegal or unauthorized purpose</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">5. Intellectual Property</h3>
        <p className="text-body mb-4">
          The Service and its original content, features, and functionality are and will remain the exclusive property of Board Yet and its licensors. The Service is protected by copyright, trademark, and other laws.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">6. Privacy Policy</h3>
        <p className="text-body mb-4">
          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">7. Termination</h3>
        <p className="text-body mb-4">
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">8. Disclaimers</h3>
        <p className="text-body mb-4">
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Board Yet expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">9. Limitation of Liability</h3>
        <p className="text-body mb-4">
          In no event shall Board Yet, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">10. Changes to Terms</h3>
        <p className="text-body mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">11. Contact Information</h3>
        <p className="text-body mb-4">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-body">
            <strong>Email:</strong> legal@boardyet.com<br />
            <strong>Address:</strong> Board Yet Legal Department<br />
          </p>
        </div>
      </section>
    </>
  );
}
