import React from 'react';

const TaxPolicy = () => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      lineHeight: 1.6,
      maxWidth:"70%",
      marginLeft:"230px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      marginTop:"10px",
      marginBottom: "60px",
      padding: '20px',
      color: '#333'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '10px'
      }}>
        Tax Policy
      </h1>

      <p style={{ margin: '15px 0' }}>
        <strong style={{ color: '#2c3e50' }}>Effective Date:</strong> October 2025<br />
        <strong style={{ color: '#2c3e50' }}>Last Updated:</strong> October 2025
      </p>

      <p style={{ margin: '15px 0' }}>
        This <strong style={{ color: '#2c3e50' }}>Tax Policy</strong> explains how <strong style={{ color: '#2c3e50' }}>Elfinic Commerce Pvt Ltd (India)</strong>
        and <strong style={{ color: '#2c3e50' }}>Elfinic Commerce LLC (USA)</strong> ("Elfinic," "we," "our," or "us")
        apply, calculate, and collect taxes on purchases made through
        <strong style={{ color: '#2c3e50' }}> Elfinic.com</strong> and our <strong style={{ color: '#2c3e50' }}>mobile application</strong>, in compliance with the
        laws of each respective country where our customers reside.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        1. Purpose :
      </h1>

      <p style={{ margin: '15px 0' }}>
        Elfinic operates as a global e-commerce platform selling a variety of
        products to customers both within India and internationally.<br />
        This policy outlines how applicable <strong style={{ color: '#2c3e50' }}>taxes, duties, and levies</strong> are
        calculated, displayed, and collected based on the <strong style={{ color: '#2c3e50' }}>country of purchase,
        billing address, and delivery destination</strong>.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        2. Taxes for Orders Within India :
      </h1>

      <h6 style={{
        color: '#2c3e50',
        marginTop: '20px'
      }}>
        a) Goods and Services Tax (GST)
      </h6>

      <p style={{ margin: '15px 0' }}>
        All prices listed on <strong style={{ color: '#2c3e50' }}>Elfinic.com (India)</strong> are <strong style={{ color: '#2c3e50' }}>inclusive of GST</strong>,
        unless otherwise stated.<br />
        GST is applied as per the <strong style={{ color: '#2c3e50' }}>Government of India's Goods and Services Tax
        Act, 2017</strong>, and may vary depending on product category.
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
            }}>Category</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>Applicable GST Rate (Approx.)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Apparel & Footwear</td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>5% -- 12%</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Beauty & Personal Care</td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>18%</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Electronics & Accessories</td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>18%</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Food & Grocery Products</td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>5%</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Others</td>
            <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>As applicable under GST Act</td>
          </tr>
        </tbody>
      </table>

      <h6 style={{
        color: '#2c3e50',
        marginTop: '20px'
      }}>
        b) State and Local Taxes
      </h6>

      <p style={{ margin: '15px 0' }}>
        In certain states or Union Territories, <strong style={{ color: '#2c3e50' }}>SGST/CGST</strong> or <strong style={{ color: '#2c3e50' }}>IGST</strong> may
        apply depending on the customer's delivery location:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>Intra-state sales:</strong> CGST + SGST</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>Inter-state sales:</strong> IGST</li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        These taxes are automatically calculated during checkout.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        3. Taxes for International Orders :
      </h1>

      <h6 style={{
        color: '#2c3e50',
        marginTop: '20px'
      }}>
        a) Import Duties and VAT
      </h6>

      <p style={{ margin: '15px 0' }}>
        For orders shipped outside India, <strong style={{ color: '#2c3e50' }}>import duties, customs fees, and
        Value Added Tax (VAT)</strong> may be imposed by the destination country's
        customs authorities.<br />
        These charges are <strong style={{ color: '#2c3e50' }}>not included</strong> in Elfinic's listed product prices or
        checkout total unless otherwise specified.
      </p>

      <p style={{ margin: '15px 0' }}>
        Customers are responsible for:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Paying any <strong style={{ color: '#2c3e50' }}>local import duties or taxes</strong> upon delivery;</li>
        <li style={{ margin: '8px 0' }}>Complying with the <strong style={{ color: '#2c3e50' }}>customs policies</strong> of their country; and</li>
        <li style={{ margin: '8px 0' }}>Providing accurate contact and identification details to avoid customs
        delays.</li>
      </ul>

      <h6 style={{
        color: '#2c3e50',
        marginTop: '20px'
      }}>
        b) Country-Specific Notes
      </h6>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>United States:</strong> Sales tax may apply based on state regulations at
        checkout.</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>European Union:</strong> VAT rates vary by member country and are applied
        as per EU directives.</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>United Kingdom:</strong> VAT at 20% is applied for eligible orders under UK
        import rules.</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>Australia & Canada:</strong> GST/VAT is charged as per local e-commerce tax
        frameworks.</li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        If applicable, these taxes will appear in your <strong style={{ color: '#2c3e50' }}>order summary</strong> before
        completing checkout.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        4. Display of Taxes on Website & App :
      </h1>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Taxes (GST, VAT, or others) are <strong style={{ color: '#2c3e50' }}>transparently displayed</strong> at
        checkout.</li>
        <li style={{ margin: '8px 0' }}>The total price shown during checkout includes all applicable taxes
        for your region.</li>
        <li style={{ margin: '8px 0' }}>Customers receive a <strong style={{ color: '#2c3e50' }}>tax invoice</strong> with a detailed tax breakdown via
        email and in their account dashboard after successful purchase.</li>
      </ul>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        5. Tax Invoices :
      </h1>

      <p style={{ margin: '15px 0' }}>
        Elfinic issues an official <strong style={{ color: '#2c3e50' }}>tax invoice</strong> for every order, containing:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}>Invoice Number and Date</li>
        <li style={{ margin: '8px 0' }}>Customer Details (Name, Address, GST/VAT number if applicable)</li>
        <li style={{ margin: '8px 0' }}>Product Details</li>
        <li style={{ margin: '8px 0' }}>GST/IGST/CGST/SGST or VAT applied</li>
        <li style={{ margin: '8px 0' }}>Total Amount Payable</li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        Customers in India may use this invoice for <strong style={{ color: '#2c3e50' }}>input tax credit (ITC)</strong>
        if they are registered businesses, subject to GST laws.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        6. Compliance and Filing :
      </h1>

      <p style={{ margin: '15px 0' }}>
        Elfinic Commerce Pvt Ltd complies with:
      </p>

      <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>GST Act (India, 2017)</strong> and amendments</li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>Income Tax Act, 1961 (India)</strong></li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>Local state and federal tax laws (USA)</strong></li>
        <li style={{ margin: '8px 0' }}><strong style={{ color: '#2c3e50' }}>International tax treaties and customs regulations</strong></li>
      </ul>

      <p style={{ margin: '15px 0' }}>
        Our tax filings and collections are performed in accordance with
        government-mandated digital invoicing and e-way bill systems where
        applicable.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        7. Currency and Conversion :
      </h1>

      <p style={{ margin: '15px 0' }}>
        All prices are displayed in the local currency of the browsing country
        (e.g., INR, USD, GBP, EUR, AUD).<br />
        Currency conversion rates are managed by our payment partners at
        prevailing exchange rates, which may include minimal conversion fees.
      </p>

      <h1 style={{
        color: '#2c3e50',
        marginTop: '30px',
        borderLeft: '4px solid #3498db',
        paddingLeft: '10px'
      }}>
        8. Tax Changes :
      </h1>

      <p style={{ margin: '15px 0' }}>
        Tax laws are dynamic and may change periodically.<br />
        Elfinic reserves the right to update product pricing and tax rates in
        accordance with new legal or regulatory changes in any jurisdiction.
      </p>
    </div>
  );
};

export default TaxPolicy;