import { Github, Linkedin, Mail } from 'lucide-react';

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl mb-6">
            Hi, I'm <span className="text-blue-600">Muhammad Athallah Rizki Putra</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            Data Science, Artificial Intelligence, and Cloud Computing Enthusiast
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Passionate about building intelligent, data-driven solutions that solve real-world problems. With expertise in AI Integrations, Machine Learning Algorithms, Cloud Services, and keen on deploying scalable applications.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="https://github.com/RizkiPutra660" target="_blank" rel="noopener noreferrer" 
               className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/athallahrizki/" target="_blank" rel="noopener noreferrer"
               className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md">
              <Linkedin size={24} />
            </a>
            <a href="mailto:mathallahrizkip@gmail.com"
               className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
