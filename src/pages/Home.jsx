import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Plus, Pencil, MoreVertical, Star, Paperclip, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailInbox = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [emails, setEmails] = useState([]);

  const [accounts, setAccounts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const emailData = {}; // Define any necessary payload data
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/listemail`, emailData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setEmails(response.data.data); // Assuming the response contains the email data in response.data.data
        console.log(response.data.data); // Debugging: See the email data in console

        // Extract accounts from the email data
        // Extract accounts from the email data
        const uniqueAccounts = [...new Set(response.data.data.map(email => email.to_email))];
         setAccounts(uniqueAccounts); // Set unique email accounts

      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };

    fetchEmails();
  }, []);
  const categorizeEmails = (emails) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = (date) => {
      const emailDate = new Date(date);
      return emailDate.toDateString() === today.toDateString();
    };

    const isYesterday = (date) => {
      const emailDate = new Date(date);
      return emailDate.toDateString() === yesterday.toDateString();
    };

    const sortedEmails = emails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const recentEmails = sortedEmails.slice(0, 3);
    const olderEmails = sortedEmails.slice(3);

    const todayEmails = recentEmails.filter((email) => isToday(email.created_at));
    const yesterdayEmails = recentEmails.filter((email) => isYesterday(email.created_at));

    return { todayEmails, yesterdayEmails, olderEmails };
  };

  const { todayEmails, yesterdayEmails, olderEmails } = categorizeEmails(emails);

  const write = () => {
    window.scrollTo(0, 0);
    navigate('/write');
  };

  return (
    <div className="bg-black text-white md:max-w-[30rem] h-screen p-4 font-sans overflow-hidden mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-6"
      >
        <ChevronLeft className="text-blue-500 mr-2" size={24} />
        <span className="text-blue-500 text-lg font-medium">Settings</span>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center mb-6"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex justify-center items-center align-center mr-4 overflow-hidden shadow-lg">
          <Mail />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">All Inboxes</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`bg-gray-800 rounded-full p-2 mb-6 flex items-center ${searchFocused ? 'ring-2 ring-blue-500' : ''}`}
      >
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Search in emails"
          className="bg-transparent outline-none w-full text-sm text-gray-200 placeholder-gray-500"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex gap-5 mb-6"
      >
        {accounts.map((account, index) => (
          <AccountIcon key={account} name={account} count={emails.filter(email => email.to_email === account).length} delay={index * 0.1} />
        ))}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-1 shadow-md">
            <Plus size={24}
              onClick={write}
              className="text-gray-400" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex text-sm mb-6 border-b border-gray-800 pb-2"
      >
        {['Sent Mails',].map((tab, index) => (
          <TabItem key={tab} name={tab} active={index === 0} />
        ))}
      </motion.div>

      <div className="overflow-y-auto h-[calc(100vh-320px)] pr-2 -mr-2 pb-[5rem]">
        {todayEmails.length > 0 && <EmailSection title="Today" emails={todayEmails} navigate={navigate} />}
        {yesterdayEmails.length > 0 && <EmailSection title="Yesterday" emails={yesterdayEmails} navigate={navigate} />}
        {olderEmails.length > 0 && <EmailSection title="Earlier" emails={olderEmails} navigate={navigate} />}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        onClick={write}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-blue-500 rounded-full p-4 shadow-lg cursor-pointer"
      >
        <Pencil size={24} color="white" />
      </motion.div>
    </div>
  );
};

const AccountIcon = ({ name, count, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.3 + delay }}
    className="flex flex-col items-center"
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-1 relative shadow-md cursor-pointer"
    >
      <span className="text-2xl font-semibold uppercase">{name[0]}</span>
      <span className="absolute -top-1 -right-1 bg-blue-500 text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">{count}</span>
    </motion.div>
    <span className="text-xs text-gray-400">
      {`${name.split('@')[0]}`}
    </span>
  </motion.div>
);

const TabItem = ({ name, active }) => (
  <motion.span
    whileHover={{ y: -2 }}
    className={`mr-4 pb-2 cursor-pointer ${active ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {name}
  </motion.span>
);

const EmailSection = ({ title, emails, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.5 }}
    className="mb-6"
  >
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="space-y-4 ">
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          emailId={email.id}
          name={email.sender_name}
          subject={email.subject}
          preview={email.body.replace(/<[^>]+>/g, '')}
          time={new Date(email.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          unread={true}
          starred={false}
          attachment={false}
          navigate={navigate}
        />
      ))}
    </div>
  </motion.div>
);

const EmailItem = ({ emailId, name, subject, preview, time, unread, starred, attachment, navigate }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-start bg-gray-900 rounded-lg p-3 cursor-pointer"
    onClick={() => navigate(`/mail/${emailId}`)}  // Navigating to /mail/{id}
  >
    <div className="w-14 h-14 rounded-full overflow-hidden mr-3 flex-shrink-0">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-1 relative shadow-md cursor-pointer"
      >
        <span className="text-2xl font-semibold uppercase">{name[0]}</span>
      </motion.div>
    </div>
    <div className="flex-grow min-w-0">
      <div className="flex justify-between items-center mb-1">
        <span className={`font-semibold truncate ${unread ? 'text-white' : 'text-gray-400'}`}>{name}</span>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {starred && <Star size={16} className="text-yellow-500 fill-current" />}
          {attachment && <Paperclip size={16} className="text-gray-400" />}
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
      <p className={`text-sm truncate ${unread ? 'font-semibold text-gray-200' : 'text-gray-400'}`}>{subject}</p>
      <p className="text-sm text-gray-500 truncate">{preview}</p>
    </div>
    {unread && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2 flex-shrink-0"></div>}
  </motion.div>
);

export default EmailInbox;
