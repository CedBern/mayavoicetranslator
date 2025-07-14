import Link from 'next/link';

const Navigation = () => (
  <nav className="w-full flex justify-between items-center py-4 px-8 bg-white/80 shadow-md fixed top-0 left-0 z-50">
    <div className="font-bold text-xl text-indigo-700">MayaVoiceTranslator</div>
    <ul className="flex gap-6 text-gray-700">
      <li><Link href="/" className="hover:text-indigo-600">Accueil</Link></li>
      <li><Link href="/multimodal" className="hover:text-indigo-600">Multimodal</Link></li>
      <li><Link href="/translate" className="hover:text-indigo-600">Traduction</Link></li>
      <li><Link href="/feedback" className="hover:text-indigo-600">Feedback</Link></li>
      <li><Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link></li>
      <li><Link href="/profile" className="hover:text-indigo-600">Profil</Link></li>
      <li><Link href="/docs" className="hover:text-indigo-600">Docs</Link></li>
      <li><Link href="/onboarding" className="hover:text-indigo-600">Onboarding</Link></li>
      <li><Link href="/legal" className="hover:text-indigo-600">Légal</Link></li>
      <li><Link href="/admin" className="hover:text-indigo-600">Admin</Link></li>
      <li><Link href="/stats" className="hover:text-indigo-600">Stats</Link></li>
      <li><Link href="/contact" className="hover:text-indigo-600">Contact</Link></li>
      <li><Link href="/faq" className="hover:text-indigo-600">FAQ</Link></li>
    </ul>
  </nav>
);

export default Navigation;
