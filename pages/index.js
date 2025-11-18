export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zoho CRM API for GPT</h1>
      <p>Your API is running! Use the following endpoint from your GPT:</p>
      <code style={{ background: '#f4f4f4', padding: '10px', display: 'block', marginTop: '10px' }}>
        GET /api/search-contact?searchTerm=John
      </code>
      <p style={{ marginTop: '20px' }}>
        <strong>Example:</strong> Search for a contact by first name, last name, or email
      </p>
    </div>
  );
}
