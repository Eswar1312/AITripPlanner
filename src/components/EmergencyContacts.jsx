import { motion } from 'framer-motion';
import { FiPhoneCall } from 'react-icons/fi';

export default function EmergencyContacts({ emergency }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-200">
        <FiPhoneCall />
        Emergency Contacts
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {emergency.map((contact, index) => (
          <a
            key={`${contact.name}-${index}`}
            href={`tel:${contact.number.replace(/\s/g, '')}`}
            className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 transition hover:bg-rose-500/20"
          >
            <p className="font-semibold text-slate-900 dark:text-white">{contact.name}</p>
            <p className="mt-1 text-sm text-rose-700 dark:text-rose-100/80">{contact.number}</p>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
