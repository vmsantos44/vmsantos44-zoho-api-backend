export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alfa Systems Privacy Policy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .meta {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .content {
            padding: 2rem;
        }

        .contact-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 4px;
        }

        .contact-box h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }

        .contact-info {
            display: grid;
            gap: 0.5rem;
        }

        .contact-info p {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .contact-info strong {
            min-width: 100px;
            color: #555;
        }

        section {
            margin: 2.5rem 0;
        }

        h2 {
            color: #667eea;
            font-size: 1.8rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e9ecef;
        }

        h3 {
            color: #764ba2;
            font-size: 1.3rem;
            margin: 1.5rem 0 0.75rem;
        }

        p {
            margin-bottom: 1rem;
            color: #555;
        }

        ul {
            margin: 1rem 0 1rem 2rem;
        }

        li {
            margin-bottom: 0.5rem;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        thead {
            background: #667eea;
            color: white;
        }

        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
        }

        tbody tr:hover {
            background: #f8f9fa;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .badge-yes {
            background: #d4edda;
            color: #155724;
        }

        .badge-no {
            background: #f8d7da;
            color: #721c24;
        }

        .highlight-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 1rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }

        .footer {
            background: #2d3748;
            color: white;
            padding: 2rem;
            text-align: center;
            margin-top: 3rem;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8rem;
            }

            .content {
                padding: 1.5rem;
            }

            table {
                font-size: 0.9rem;
            }

            th, td {
                padding: 0.75rem 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Alfa Systems Privacy Policy</h1>
            <div class="meta">
                <p><strong>Effective Date:</strong> August 3, 2025</p>
                <p><strong>Version:</strong> 2.5</p>
            </div>
        </div>

        <div class="content">
            <div class="contact-box">
                <h3>Contact Information</h3>
                <div class="contact-info">
                    <p><strong>Email:</strong> <a href="mailto:privacy@alfasystems.com">privacy@alfasystems.com</a></p>
                    <p><strong>Phone:</strong> <a href="tel:+13072221996">+1 307 222 1996</a></p>
                    <p><strong>Address:</strong> 30 N Gould St. Suite B, Sheridan, WY 82801, USA</p>
                </div>
            </div>

            <section id="who-we-are">
                <h2>1. Who We Are</h2>
                <p>Alfa Systems LLC ("Alfa Systems", "we", "us", "our") is the provider of <strong>alfaOne</strong>, a talent-evaluation platform (the "Platform") that combines AI review with human expertise to help employers identify qualified candidates.</p>
                <p><strong>Registered address:</strong> 30 N Gould St. Suite B, Sheridan, WY 82801, USA</p>
                <p><strong>Privacy Contact:</strong> <a href="mailto:privacy@alfasystems.com">privacy@alfasystems.com</a></p>
                <p>If you reside in the EU/UK, Alfa Systems LLC is the data controller for the processing described in this policy.</p>
            </section>

            <section id="scope">
                <h2>2. Scope of This Policy</h2>
                <p>This Privacy Policy describes how we collect, use, disclose and protect personal data when you:</p>
                <ul>
                    <li>visit <a href="https://alfasystems.com" target="_blank">https://alfasystems.com</a> (the "Site"),</li>
                    <li>use our alfaOne hiring-assessment platform ("alfaOne" or the "Platform"), or</li>
                    <li>otherwise interact with us (collectively, the "Services").</li>
                </ul>
            </section>

            <section id="data-collected">
                <h2>3. The Data We Collect</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Examples</th>
                            <th>Collected From</th>
                            <th>Mandatory?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Identification</strong></td>
                            <td>name, email, phone, account ID</td>
                            <td>candidates, clients</td>
                            <td><span class="badge badge-yes">Yes</span></td>
                        </tr>
                        <tr>
                            <td><strong>Assessment content</strong></td>
                            <td>video/audio recordings, written answers, code snippets</td>
                            <td>candidates</td>
                            <td><span class="badge badge-yes">Yes</span></td>
                        </tr>
                        <tr>
                            <td><strong>AI review metadata</strong></td>
                            <td>timestamps, language vectors, feature scores</td>
                            <td>generated by Platform</td>
                            <td><span class="badge badge-yes">Yes</span></td>
                        </tr>
                        <tr>
                            <td><strong>Usage data</strong></td>
                            <td>IP, device type, browser, cookies</td>
                            <td>website visitors</td>
                            <td><span class="badge badge-no">No</span></td>
                        </tr>
                        <tr>
                            <td><strong>Client billing data</strong></td>
                            <td>contact name, billing address, VAT, payment tokens</td>
                            <td>clients</td>
                            <td><span class="badge badge-yes">Yes</span></td>
                        </tr>
                        <tr>
                            <td><strong>Support records</strong></td>
                            <td>chat transcripts, tickets, call recordings</td>
                            <td>anyone contacting support</td>
                            <td><span class="badge badge-no">No</span></td>
                        </tr>
                    </tbody>
                </table>
                <p><em>We do not request or knowingly process special-category data (e.g., racial or ethnic origin) unless required by law and with explicit consent.</em></p>
            </section>

            <section id="legal-bases">
                <h2>4. Why We Process Data & Our Legal Bases (GDPR Art 6)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Purpose</th>
                            <th>Legal Basis</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Provide and secure the Services</td>
                            <td>Performance of contract (Art 6 (1)(b))</td>
                            <td>Create candidate workspaces, deliver AI reviews, administer accounts</td>
                        </tr>
                        <tr>
                            <td>Improve accuracy & fairness</td>
                            <td>Legitimate interests (Art 6 (1)(f))</td>
                            <td>Aggregate, anonymise data to refine review models & detect bias</td>
                        </tr>
                        <tr>
                            <td>Handle payments & invoices</td>
                            <td>Performance of contract</td>
                            <td>Process transactions for paid subscriptions</td>
                        </tr>
                        <tr>
                            <td>Marketing to business contacts</td>
                            <td>Consent (opt-in) or Legitimate interests</td>
                            <td>Send product updates; opt-out any time</td>
                        </tr>
                        <tr>
                            <td>Legal & compliance</td>
                            <td>Legal obligation (Art 6 (1)(c))</td>
                            <td>Retain records, respond to lawful requests</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section id="ai-review">
                <h2>5. How Our AI Review Works</h2>
                <ul>
                    <li>The AI review analyses language patterns, topic coverage and time management in assessment responses.</li>
                    <li>It outputs <strong>recommendations only</strong>; qualified human reviewers make all final hiring decisions.</li>
                    <li>Both clients and individual candidates may request an additional manual review at any time. Any fees for such requests are governed by your service agreement.</li>
                </ul>

                <div class="highlight-box">
                    <h3>Right to Contest</h3>
                    <p>You may contest the outcome of an AI review, request human intervention or express your views under GDPR Art 22 and equivalent laws. Contact <a href="mailto:privacy@alfasystems.com">privacy@alfasystems.com</a> to exercise this right.</p>
                </div>
            </section>

            <section id="data-sharing">
                <h2>6. How We Share Data</h2>
                <p><strong>We do not sell personal data.</strong> We share it only:</p>
                <ol>
                    <li>With service providers (e.g., cloud hosting, analytics, email)—all bound by written data-processing agreements.</li>
                    <li>Within the Alfa Systems group (if subsidiaries exist) for legitimate internal purposes.</li>
                    <li>When required by law (court orders, lawful government requests).</li>
                    <li>In business transfers (merger, acquisition) with notice to affected individuals.</li>
                </ol>
                <p>A current list of sub-processors is available at <a href="https://alfasystems.com/subprocessors" target="_blank">https://alfasystems.com/subprocessors</a> and is updated at least 30 days before any new provider gains access.</p>
            </section>

            <section id="international-transfers">
                <h2>7. International Transfers</h2>
                <p>We store data in the <strong>European Economic Area (EEA)</strong> and the <strong>United States</strong>. When we transfer data outside the EEA/UK, we rely on one of the following safeguards:</p>
                <ul>
                    <li>Standard Contractual Clauses (SCCs) approved by the European Commission;</li>
                    <li>UK Addendum to the SCCs;</li>
                    <li>Adequacy decisions (e.g., EU–US Data Privacy Framework).</li>
                </ul>
                <p>Copies of transfer safeguards are available on request.</p>
            </section>

            <section id="data-retention">
                <h2>8. Data Retention</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Data Category</th>
                            <th>Retention Period</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Assessment video/audio</td>
                            <td>180 days after assessment completion (unless client requests shorter/longer)</td>
                        </tr>
                        <tr>
                            <td>AI review metadata</td>
                            <td>2 years, then aggregated & anonymised</td>
                        </tr>
                        <tr>
                            <td>Client account data</td>
                            <td>Duration of contract + 7 years for tax/audit</td>
                        </tr>
                        <tr>
                            <td>Marketing contact info</td>
                            <td>Until you opt-out or 3 years of inactivity</td>
                        </tr>
                    </tbody>
                </table>
                <p><em>We may retain data longer if required by law or to establish, exercise or defend legal claims.</em></p>
            </section>

            <section id="your-rights">
                <h2>9. Your Rights</h2>
                <p>Depending on your location, you have the right to:</p>
                <ul>
                    <li><strong>Access, correct or delete</strong> your personal data;</li>
                    <li><strong>Restrict or object</strong> to processing;</li>
                    <li><strong>Data portability;</strong></li>
                    <li><strong>Withdraw consent</strong> at any time;</li>
                    <li><strong>Lodge a complaint</strong> with a supervisory authority (UK ICO for UK residents).</li>
                </ul>
                <p>To exercise any right, email <a href="mailto:privacy@alfasystems.com">privacy@alfasystems.com</a>. We will respond within <strong>30 days</strong>.</p>
            </section>

            <section id="security">
                <h2>10. Security</h2>
                <p>We employ technical and organisational measures including:</p>
                <ul>
                    <li>TLS/SSL encryption in transit and AES-256 at rest;</li>
                    <li>Multi-factor authentication for admin accounts;</li>
                    <li>Role-based access controls;</li>
                    <li>Annual penetration testing and SOC 2 Type II audits.</li>
                </ul>
            </section>

            <section id="cookies">
                <h2>11. Cookies & Similar Technologies</h2>
                <p>We use:</p>
                <ul>
                    <li><strong>Essential cookies</strong> for session authentication;</li>
                    <li><strong>Analytics cookies</strong> (Google Analytics 4) to measure traffic.</li>
                </ul>
                <p>Non-essential cookies are dropped only with your consent. Full details are in our Cookie Policy.</p>
            </section>

            <section id="california">
                <h2>12. California Privacy Notice (CPRA)</h2>
                <p>If you are a California resident, you have the right to:</p>
                <ul>
                    <li>Know what personal information we collect and how we use it;</li>
                    <li>Delete personal information (subject to exceptions);</li>
                    <li>Correct inaccurate information;</li>
                    <li>Opt-out of cross-context behavioural advertising (we do not "sell" personal information);</li>
                    <li>Limit use of sensitive personal information (we only use it to provide the Services).</li>
                </ul>
                <p>To exercise CPRA rights, email <a href="mailto:cpra@alfasystems.com">cpra@alfasystems.com</a> or call <a href="tel:+13072221996">+1 307 222 1996</a>.</p>
            </section>

            <section id="children">
                <h2>13. Children's Privacy</h2>
                <p>The Services are not directed to children under <strong>16</strong>. We do not knowingly collect personal data from children. If we learn we have, we will delete it immediately.</p>
            </section>

            <section id="changes">
                <h2>14. Changes to This Policy</h2>
                <p>We may update this Policy from time to time. We will post the revised version with a new effective date and notify clients via email at least <strong>30 days</strong> before the change takes effect if it materially affects your rights.</p>
            </section>

            <section id="contact">
                <h2>15. Contact Us</h2>
                <p>Questions, requests or complaints?</p>
                <div class="contact-box">
                    <div class="contact-info">
                        <p><strong>Email:</strong> <a href="mailto:privacy@alfasystems.com">privacy@alfasystems.com</a></p>
                        <p><strong>Phone:</strong> <a href="tel:+13072221996">+1 307 222 1996</a></p>
                        <p><strong>General Email:</strong> <a href="mailto:vsantos@alfasystemscv.com">vsantos@alfasystemscv.com</a></p>
                    </div>
                </div>
                <p><em>Your privacy is our priority. We are dedicated to protecting your data while providing you with high-quality services.</em></p>
            </section>
        </div>

        <div class="footer">
            <p>&copy; 2025 Alfa Systems LLC. All rights reserved.</p>
            <p>
                <a href="https://alfasystems.com">Home</a> |
                <a href="https://alfasystems.com/privacy-policy">Privacy Policy</a> |
                <a href="mailto:privacy@alfasystems.com">Contact Privacy Team</a>
            </p>
            <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
                Locations: Nairobi, Dakar, Mindelo, Accra, Addis Ababa, Sheridan WY
            </p>
        </div>
    </div>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
