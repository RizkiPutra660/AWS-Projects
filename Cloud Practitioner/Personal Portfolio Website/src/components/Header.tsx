import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className="text-2xl">Portfolio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('cv')} className="hover:text-blue-600 transition-colors">
              CV
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-blue-600 transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button onClick={() => scrollToSection('about')} className="text-left hover:text-blue-600 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('cv')} className="text-left hover:text-blue-600 transition-colors">
              CV
            </button>
            <button onClick={() => scrollToSection('projects')} className="text-left hover:text-blue-600 transition-colors">
              Projects
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-left hover:text-blue-600 transition-colors">
              Contact
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
