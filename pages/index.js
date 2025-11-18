export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zoho CRM API for GPT</h1>
      <p>Your API is running! Available endpoints:</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Search Contacts</h3>
        <code style={{ background: '#f4f4f4', padding: '10px', display: 'block', marginTop: '10px' }}>
          GET /api/search-contact?searchTerm=John
        </code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Search Leads</h3>
        <code style={{ background: '#f4f4f4', padding: '10px', display: 'block', marginTop: '10px' }}>
          GET /api/search-lead?searchTerm=Acme
        </code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Get Notes</h3>
        <code style={{ background: '#f4f4f4', padding: '10px', display: 'block', marginTop: '10px' }}>
          GET /api/get-notes?module=Contacts&recordId=123456
        </code>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Send Email</h3>
        <code style={{ background: '#f4f4f4', padding: '10px', display: 'block', marginTop: '10px' }}>
          POST /api/send-email
        </code>
      </div>
    </div>
  );
}
