import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const EmailCompose = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [to, setTo] = useState('');
  const [senderName, setSenderName] = useState('');
  const [mailingServer, setMailingServer] = useState('contact@fxcntrl.com');
  const [isSending, setIsSending] = useState(false); // Add this state

  const home = () => {
    window.scrollTo(0, 0);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // Disable the button and show "Sending..."

    const emailData = {
      to,
      sender_name: senderName,
      subject,
      body,
      mailing_server: mailingServer,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}sendemail`, emailData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    } finally {
      setIsSending(false); // Re-enable the button
    }
  };

  return (
    <div className="bg-black h-screen text-white p-4 rounded-lg max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={home}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-blue-500"
        >
          <ChevronDown size={24} />
        </motion.button>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold">New Email</h2>
        </motion.div>
        <div className="flex space-x-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 px-4 py-1 rounded-full text-sm font-medium"
            onClick={handleSubmit}
            disabled={isSending} // Disable the button while sending
          >
            {isSending ? 'Sending...' : 'Send'}
          </motion.button>
        </div>
      </div>

      <motion.div
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="space-y-1"
      >
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-bold px-1">To:</span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`bg-gray-800 rounded-lg mt-1 p-2 mb-2 flex items-center `}
          >
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="email@gmail.com"
              className="bg-transparent outline-none w-full text-sm text-gray-200 placeholder-gray-500"
            />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-bold px-1">Sender Name</span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`bg-gray-800 rounded-lg mt-1 p-2 mb-2 flex items-center `}
          >
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="E.g Microsoft Support"
              className="bg-transparent outline-none w-full text-sm text-gray-200 placeholder-gray-500"
            />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-bold px-1">Email Subject</span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`bg-gray-800 rounded-lg mt-1 p-2 mb-2 flex items-center `}
          >
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter your email subject"
              className="bg-transparent outline-none w-full text-sm text-gray-200 placeholder-gray-500"
            />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400 text-sm font-bold px-1">Mailing Server</span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`bg-gray-800 rounded-lg mt-1 p-2 mb-2 flex items-center `}
          >
            <select
              value={mailingServer}
              onChange={(e) => setMailingServer(e.target.value)}
              className="bg-gray-800 text-sm text-gray-200 placeholder-gray-500 py-4 px-1 rounded-none w-full"
            >
              <option value="contact@fxcntrl.com">Random</option>
              <option value="contact@fxcntrl.com">Contact Server</option>
              <option value="contact@fxcntrl.com">Support Server</option>
              <option value="contact@fxcntrl.com">Help Server</option>
            </select>
          </motion.div>
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-gray-400 text-sm font-bold px-1">Mailing Body</span>
          <ReactQuill
            value={body}
            onChange={setBody}
            className="bg-gray-800 text-white border-none rounded-lg h-full"
            theme="snow"
            placeholder="Type your message here..."
          />
        </div>
      </motion.div>
    </div>
  );
};

export default EmailCompose;
