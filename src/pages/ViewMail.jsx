import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ViewMail = () => {
    const { id } = useParams();  // Get the email ID from the route
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);  // To store the fetched email details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/viewemail`, { id }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setEmail(response.data.data);  // Assuming response.data.data contains the email data
            } catch (err) {
                setError('Error fetching the email.');
                console.error('Error fetching email:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmail();
    }, [id]);

    const goBack = () => {
        navigate(-1);  // Go back to the previous page
    };

    if (loading) {
        return <div className="text-center text-white">Loading email...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!email) {
        return <div className="text-center text-white">No email found.</div>;
    }

    return (
        <div className="bg-black text-white md:max-w-[30rem] h-screen p-4 font-sans overflow-hidden mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={goBack}
                className="flex items-center mb-6"
            >
                <ChevronLeft className="text-blue-500 mr-2 cursor-pointer" size={24}  />
                <span className="text-blue-500 text-lg cursor-pointer font-medium">Back</span>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gray-900 p-4 rounded-lg shadow-lg"
            >
                <h1 className="text-2xl font-bold mb-4">{email.subject}</h1>

                <div className="mb-3">
                    <p className="text-gray-400">
                        <span className="text-sm font-semibold">{email.sender_name}</span> {' '}
                        <span className='text-sm'>to {`<${email.to_email}>`}</span>
                    </p>
                    <p className="text-gray-500 text-xs">{new Date(email.created_at).toLocaleString()}</p>
                </div>
                <hr className='border-gray-500 mb-3 p-0' />
                <div className="email-body mb-6" dangerouslySetInnerHTML={{ __html: email.body }} />

                {email.attachments && email.attachments.length > 0 && (
                    <div className="attachments">
                        <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                        <ul className="list-disc ml-5 space-y-2">
                            {email.attachments.map((attachment, index) => (
                                <li key={index}>
                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        {attachment.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ViewMail;
