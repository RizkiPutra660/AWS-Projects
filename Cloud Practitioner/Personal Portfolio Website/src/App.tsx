import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { CV } from './components/CV';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <CV />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
