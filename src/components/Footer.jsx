import { FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 py-8 dark:border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-slate-500 sm:flex-row sm:text-left dark:text-white/45">
        <div className="flex items-center gap-2">
          <FiMapPin className="text-teal-600 dark:text-teal-300" />
          <span>
            <strong className="font-display text-slate-700 dark:text-white/70">Talk2Trip</strong> — AI Powered Trip Architect Implemented By <a href="https://github.com/Eswar1312"><b>Eswar</b></a>
          </span>
        </div>
        <p>Structured itineraries. Interactive dashboards.</p>
      </div>
    </footer>
  );
}
