import React from 'react';

export function PrivacyPolicyContent() {
  return (
    <>
      <div className="text-center mb-8">
        <p className="text-body text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">1. Information We Collect</h3>
        <p className="text-body mb-4">
          We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
        </p>
        
        <h4 className="heading-5 mb-3">Personal Information</h4>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Name and email address</li>
          <li>Profile information and preferences</li>
          <li>Organization details and team information</li>
          <li>Communication preferences</li>
        </ul>

        <h4 className="heading-5 mb-3">Usage Information</h4>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Project and task data you create</li>
          <li>Collaboration activities and team interactions</li>
          <li>Device and browser information</li>
          <li>Log data and analytics information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">2. How We Use Your Information</h3>
        <p className="text-body mb-4">We use the information we collect to:</p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Detect, prevent, and address technical issues</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">3. Information Sharing and Disclosure</h3>
        <p className="text-body mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
        </p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>With your explicit consent</li>
          <li>With other members of your organization (as part of collaboration features)</li>
          <li>With service providers who assist us in operating our platform</li>
          <li>When required by law or to protect our rights</li>
          <li>In connection with a business transfer or acquisition</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">4. Data Security</h3>
        <p className="text-body mb-4">
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Employee training on data protection practices</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">5. Data Retention</h3>
        <p className="text-body mb-4">
          We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We will delete or anonymize your information when it is no longer needed, unless we are required to retain it for legal or regulatory purposes.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">6. Your Rights and Choices</h3>
        <p className="text-body mb-4">You have the right to:</p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Access and update your personal information</li>
          <li>Delete your account and associated data</li>
          <li>Export your data in a portable format</li>
          <li>Opt out of certain communications</li>
          <li>Object to processing of your personal information</li>
          <li>Withdraw consent where applicable</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">7. Cookies and Tracking Technologies</h3>
        <p className="text-body mb-4">
          We use cookies and similar tracking technologies to enhance your experience on our platform. These technologies help us:
        </p>
        <ul className="list-disc list-inside text-body space-y-2 mb-4">
          <li>Remember your preferences and settings</li>
          <li>Provide personalized content and features</li>
          <li>Analyze usage patterns and improve our services</li>
          <li>Ensure security and prevent fraud</li>
        </ul>
        <p className="text-body mb-4">
          You can control cookie settings through your browser preferences, but disabling cookies may affect the functionality of our services.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">8. Third-Party Services</h3>
        <p className="text-body mb-4">
          Our services may contain links to third-party websites or integrate with third-party services. This Privacy Policy does not apply to these external sites or services. We encourage you to review the privacy policies of any third-party services you use.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">9. International Data Transfers</h3>
        <p className="text-body mb-4">
          Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">10. Children's Privacy</h3>
        <p className="text-body mb-4">
          Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">11. Changes to This Privacy Policy</h3>
        <p className="text-body mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="heading-4 mb-4">12. Contact Us</h3>
        <p className="text-body mb-4">
          If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-body">
            <strong>Email:</strong> privacy@boardyet.com<br />
            <strong>Address:</strong> Board Yet Privacy Team<br />
          </p>
        </div>
      </section>
    </>
  );
}
