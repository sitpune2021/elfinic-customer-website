import React from 'react';

const VendorPaymentPolicy = () => {
  return (
    <div style={{
       fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
        maxWidth: "70%",
        marginLeft: "230px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        marginTop: "10px",
        marginBottom: "60px",
        padding: "20px",
        color: "#333"
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px'
      }}>
        Elfinic Vendor Payment & Payout Policy
      </h1>

      <p style={{ margin: '15px 0' }}>
        <strong style={{ color: '#2c3e50' }}>Effective Date:</strong> October 2025<br />
        <strong style={{ color: '#2c3e50' }}>Last Updated:</strong> October 2025
      </p>

      <p style={{ margin: '15px 0' }}>
        This <strong style={{ color: '#2c3e50' }}>Vendor Payment & Payout Policy</strong> ("Policy") defines the terms and
        procedures under which <strong style={{ color: '#2c3e50' }}>Elfinic Commerce Pvt Ltd (India)</strong> and
        <strong style={{ color: '#2c3e50' }}> Elfinic Commerce LLC (USA)</strong> (collectively referred to as "Elfinic")
        process and release payments to registered <strong style={{ color: '#2c3e50' }}>vendors and sellers</strong>
        ("Vendors") for transactions conducted on <strong style={{ color: '#2c3e50' }}>Elfinic.com</strong> and the
        Elfinic mobile application.
      </p>

      <p style={{ margin: '15px 0' }}>
        This policy forms an integral part of the <strong style={{ color: '#2c3e50' }}>Elfinic Seller Agreement</strong>
        and must be read in conjunction with the <strong style={{ color: '#2c3e50' }}>Seller & Vendor Policy</strong>,
        <strong style={{ color: '#2c3e50' }}> Tax Policy</strong>, and <strong style={{ color: '#2c3e50' }}>Return Policy</strong>.
      </p>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        1. Scope
      </h2>

      <p style={{ margin: '15px 0' }}>
        This Policy applies to:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>All verified vendors and sellers operating on <strong style={{ color: '#2c3e50' }}>Elfinic.com</strong> or its
        associated digital marketplaces.</li>
        <li style={{ margin: '8px 0' }}>All completed and delivered orders that have successfully cleared the
        <strong style={{ color: '#2c3e50' }}> return or dispute window</strong>.</li>
        <li style={{ margin: '8px 0' }}>Both <strong style={{ color: '#2c3e50' }}>domestic (India)</strong> and <strong style={{ color: '#2c3e50' }}>international</strong> transactions.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        2. Payment Terms Overview
      </h2>

      <p style={{ margin: '15px 0' }}>
        Elfinic follows a <strong style={{ color: '#2c3e50' }}>plan-based and order-type-based settlement system</strong>
        to ensure timely and transparent payouts.
      </p>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0'
      }}>
        <thead>
          <tr>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Order Type</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Settlement Timeline</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Conditions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Prepaid (Online Payment)</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Within <strong style={{ color: '#2c3e50' }}>7 business days</strong> after successful delivery
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Based on the vendor's selected payout plan
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>COD (Cash on Delivery)</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Within <strong style={{ color: '#2c3e50' }}>10 business days</strong> after successful delivery
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Subject to courier reconciliation and confirmation
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>High-Value / Bulk Orders</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Within <strong style={{ color: '#2c3e50' }}>12 business days</strong> after delivery
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              May include additional verification checks
            </td>
          </tr>
        </tbody>
      </table>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Payouts are processed <strong style={{ color: '#2c3e50' }}>automatically</strong> to the registered bank account
        on file once the settlement cycle is completed.</li>
        <li style={{ margin: '8px 0' }}>Weekends and public holidays are excluded from business day
        calculations.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        3. Payout Frequency
      </h2>

      <p style={{ margin: '15px 0' }}>
        Vendors may choose from the following payout cycles at onboarding or
        through the Vendor Dashboard:
      </p>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0'
      }}>
        <thead>
          <tr>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Plan Type</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Cycle</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Applicable Vendors</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Standard Plan</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Weekly (Every Monday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Default for all vendors
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Express Plan</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              3-Day Rolling Cycle
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              For vendors with consistent dispatch compliance and premium status
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Enterprise Plan</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Custom (Negotiated)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              For high-volume partners or exclusive brands
            </td>
          </tr>
        </tbody>
      </table>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        4. Payment Method
      </h2>

      <p style={{ margin: '15px 0' }}>
        All payouts are made through <strong style={{ color: '#2c3e50' }}>secure electronic transfers</strong> only:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>India:</strong> NEFT / IMPS / RTGS transfers to registered bank accounts.</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>International Vendors:</strong> SWIFT / Wire transfers in USD or local
        currency (based on vendor country).</li>
        <li style={{ margin: '8px 0' }}>Vendors must ensure accurate bank details are updated in the <strong style={{ color: '#2c3e50' }}>Vendor
        Dashboard</strong>.</li>
        <li style={{ margin: '8px 0' }}>Any failed transfer due to incorrect details may delay settlements and
        incur administrative charges.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        5. Deductions & Adjustments
      </h2>

      <p style={{ margin: '15px 0' }}>
        Before payout, the following deductions (if applicable) will be made
        automatically:
      </p>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0'
      }}>
        <thead>
          <tr>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Type of Deduction</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Commission Fees</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              As per agreed category-based commission structure.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Payment Gateway Charges</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              Applicable on prepaid online transactions.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Logistics / Shipping Fees</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              For forward and reverse logistics handled by Elfinic.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Return / Refund Adjustments</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              For customer returns or refunds initiated during the settlement window.
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Penalties / Non-Compliance Fees</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              As per Vendor Policy (late dispatch, defective products, etc.).
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              <strong style={{ color: '#2c3e50' }}>Promotional / Campaign Fees</strong>
            </td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>
              If vendor has opted for paid marketing, offers, or visibility campaigns.
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ margin: '15px 0' }}>
        All deductions will be displayed in detail under the <strong style={{ color: '#2c3e50' }}>Payout
        Statement</strong> section of the Vendor Dashboard.
      </p>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        6. Return & Refund Adjustments
      </h2>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Returns and refunds initiated within the <strong style={{ color: '#2c3e50' }}>return window (7--10
        days)</strong> are automatically adjusted from the next payout cycle.</li>
        <li style={{ margin: '8px 0' }}>If the returned product is deemed <strong style={{ color: '#2c3e50' }}>unsellable or vendor-faulted</strong>,
        the corresponding amount is <strong style={{ color: '#2c3e50' }}>deducted from the next settlement</strong>.</li>
        <li style={{ margin: '8px 0' }}>If the return is <strong style={{ color: '#2c3e50' }}>courier-faulted or fraudulent</strong>, Elfinic may
        reimburse or share the cost as per the <strong style={{ color: '#2c3e50' }}>Vendor Return Policy</strong>.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        7. Minimum Payout Threshold
      </h2>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>The minimum payout amount for automatic disbursement is <strong style={{ color: '#2c3e50' }}>₹1,000</strong>
        (India) or <strong style={{ color: '#2c3e50' }}>$50 USD</strong> (International).</li>
        <li style={{ margin: '8px 0' }}>Balances below this threshold are carried forward to the next cycle
        automatically.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        8. Payment Reporting & Dashboard Access
      </h2>

      <p style={{ margin: '15px 0' }}>
        Vendors can track and download:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Order-wise payment reports</li>
        <li style={{ margin: '8px 0' }}>Settlement summaries</li>
        <li style={{ margin: '8px 0' }}>Commission and deduction details</li>
        <li style={{ margin: '8px 0' }}>Return and refund adjustments</li>
        <li style={{ margin: '8px 0' }}>Pending and released amounts</li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        These reports are available in the <strong style={{ color: '#2c3e50' }}>Elfinic Vendor Dashboard</strong> under
        the "<strong style={{ color: '#2c3e50' }}>Payments & Payouts</strong>" section.
      </p>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        9. Penalties & Withholding
      </h2>

      <p style={{ margin: '15px 0' }}>
        Elfinic reserves the right to <strong style={{ color: '#2c3e50' }}>withhold or delay payouts</strong> if:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>There are unresolved disputes, legal claims, or compliance issues.</li>
        <li style={{ margin: '8px 0' }}>Vendor's account is under investigation for policy violation.</li>
        <li style={{ margin: '8px 0' }}>Repeated customer complaints or quality issues are reported.</li>
        <li style={{ margin: '8px 0' }}>Pending documentation (GST, tax filing, or KYC verification) exists.</li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        In such cases, withheld amounts will be released after the issue is
        resolved and verified by Elfinic's finance team.
      </p>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        10. Taxation & Compliance
      </h2>

      <h3 style={{
        color: '#2c3e50',
        marginTop: '20px'
      }}>
        a) Indian Vendors
      </h3>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>All invoices and commissions are subject to <strong style={{ color: '#2c3e50' }}>GST</strong> as per the GST
        Act, 2017.</li>
        <li style={{ margin: '8px 0' }}>Vendors must provide valid GSTIN to claim Input Tax Credit (ITC).</li>
        <li style={{ margin: '8px 0' }}>Elfinic will issue GST-compliant service invoices for commissions and
        fees.</li>
      </ul>

      <h3 style={{
        color: '#2c3e50',
        marginTop: '20px'
      }}>
        b) International Vendors
      </h3>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Payments are made post-deduction of applicable <strong style={{ color: '#2c3e50' }}>withholding taxes</strong>
        (if any) under the <strong style={{ color: '#2c3e50' }}>DTAA (Double Taxation Avoidance Agreement)</strong>
        between the vendor's country and India/USA.</li>
        <li style={{ margin: '8px 0' }}>Vendors must provide a <strong style={{ color: '#2c3e50' }}>Tax Residency Certificate (TRC)</strong> to avail of
        reduced tax benefits under DTAA.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        11. Settlement Discrepancies
      </h2>

      <p style={{ margin: '15px 0' }}>
        If a vendor identifies a discrepancy in payout:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>A claim must be raised to <strong style={{ color: '#2c3e50' }}>accounts@elfinic.com</strong> within <strong style={{ color: '#2c3e50' }}>7 business
        days</strong> of receiving the payout.</li>
        <li style={{ margin: '8px 0' }}>All claims must include the relevant invoice, order ID, and
        discrepancy proof.</li>
        <li style={{ margin: '8px 0' }}>Verified claims will be resolved and adjusted in the next payout
        cycle.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        12. Currency Conversion
      </h2>

      <p style={{ margin: '15px 0' }}>
        For international vendors, currency conversion rates are applied at the
        prevailing <strong style={{ color: '#2c3e50' }}>bank or payment partner rate</strong> at the time of settlement.<br />
        Conversion charges, if any, are borne by the vendor unless otherwise
        specified in the onboarding agreement.
      </p>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        13. Termination & Final Payout
      </h2>

      <p style={{ margin: '15px 0' }}>
        Upon termination or suspension of a vendor account:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>All pending settlements will be processed after deducting any pending
        refunds, claims, or penalties.</li>
        <li style={{ margin: '8px 0' }}>The final payout will be made within <strong style={{ color: '#2c3e50' }}>15 business days</strong> from the
        date of closure confirmation.</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        14. Dispute Resolution
      </h2>

      <p style={{ margin: '15px 0' }}>
        Any disputes related to payouts or deductions will be:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>First addressed through written communication and reconciliation
        between the parties.</li>
        <li style={{ margin: '8px 0' }}>If unresolved, subject to arbitration under the jurisdiction mentioned
        in the Seller Agreement.</li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        <strong style={{ color: '#2c3e50' }}>Jurisdiction:</strong>
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>India:</strong> Mumbai, Maharashtra</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>International Vendors:</strong> Montana, USA</li>
      </ul>

      <h2 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        15. Policy Updates
      </h2>

      <p style={{ margin: '15px 0' }}>
        Elfinic reserves the right to amend or update this policy periodically
        based on business requirements, taxation rules, or legal obligations.<br />
        All updates will be communicated via email and the Vendor Dashboard.
      </p>
    </div>
  );
};

export default VendorPaymentPolicy;