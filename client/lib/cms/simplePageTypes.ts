// Simple content page type – used for Privacy Policy, Terms & Conditions, Complaints

export interface SimplePageContent {
  title: string;
  body: string; // Rich text / HTML
}

export const defaultPrivacyPolicyContent: SimplePageContent = {
  title: "Privacy Policy",
  body: `<p>At Liberty Law, P.C., we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.</p>
<h3>Information Collection</h3>
<p>We collect information that you voluntarily provide to us via contact forms, email, or telephone. This may include your name, phone number, email address, and a brief description of your legal matter.</p>
<h3>Use of Information</h3>
<p>We use the information you provide to contact you regarding your inquiry and to determine if we can assist with your legal needs. By submitting your information, you consent to receive communications from us via phone call, text message (SMS), or email. We do not sell, rent, or lease your personal data to third parties.</p>
<h3>Data Security</h3>
<p>We utilize commercially reasonable security measures to protect the information you submit. However, please note that data transmission over the internet or via email is never 100% secure. Avoid sending sensitive or confidential information (such as Social Security numbers) through unencrypted web forms.</p>
<h3>Changes to This Policy</h3>
<p>Liberty Law, P.C. reserves the right to update this policy at any time. Any changes will be posted on this page.</p>`,
};

export const defaultTermsContent: SimplePageContent = {
  title: "Terms and Conditions",
  body: `<h3>1. Acceptance of Terms</h3>
<p>By accessing and using the Liberty Law, P.C. website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.</p>
<h3>2. No Legal Advice</h3>
<p>The materials on this website have been prepared by Liberty Law, P.C. for informational purposes only and are not legal advice. You should not act upon this information without seeking professional counsel.</p>
<h3>3. Intellectual Property</h3>
<p>All content on this website, including text, graphics, logos, and images, is the property of Liberty Law, P.C. or its content suppliers and is protected by United States and international copyright laws.</p>
<h3>4. Limitation of Liability</h3>
<p>Liberty Law, P.C. expressly disclaims all liability in respect to actions taken or not taken based on any or all the contents of this website.</p>
<h3>5. Governing Law</h3>
<p>These terms and conditions are governed by the laws of the State of Illinois.</p>`,
};

export const defaultComplaintsContent: SimplePageContent = {
  title: "Complaints Process",
  body: `<p>At Liberty Law, P.C., we strive to provide the highest quality legal representation and client service. If you are dissatisfied with any aspect of our service, we want to address it immediately.</p>
<h3>How to Report a Concern</h3>
<p>If you have a concern or complaint, please contact our office directly at <a href="tel:6304494800">(630) 449-4800</a> or via email at <a href="mailto:info@libertylawfirm.net">info@libertylawfirm.net</a>. We take all feedback seriously and will review your matter promptly to ensure a fair resolution.</p>
<h3>Client Rights</h3>
<p>Clients also have the right to contact the Attorney Registration &amp; Disciplinary Commission of the Supreme Court of Illinois (ARDC) if they believe ethical standards have been violated.</p>`,
};
