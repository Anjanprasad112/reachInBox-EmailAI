// /pages/index.tsx
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Page = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get('/api/emails');
      setEmails(response.data.messages || []);
      console.log('Fetched emails:', response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmails();

    // Set interval for automatic refresh every 30 seconds
    const intervalId = setInterval(fetchEmails, 3000);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div>
      <Link href="#" onClick={fetchEmails}>
        Fetch Unread Emails
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {emails.length > 0 ? (
        <ul>
          {emails.map((email, index) => (
            <li key={index} className='border-y-2 border-red-600'>
              <h3>Subject: {email.subject}</h3>
              <p>Snippet: {email.snippet}</p>
              <h4>Labels: {email.labelIds ? email.labelIds.join(', ') : 'None'}</h4>
              <p className='text-yellow-500'>Classification: {email.classification}</p>
              {email.response && (
                <div>
                  <h4>Response:</h4>
                  <p>{email.response}</p>
                </div>
              )}
              <pre>
                {email.content}
              </pre>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No unread emails found</p>
      )}
    </div>
  );
};

export default Page;
