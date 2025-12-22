import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Github } from 'lucide-react';
import { ImageWithFallback } from './utils/ImageWithFallback';

export function Projects() {
  const projects = [
    {
      title: 'COVID-19 Detection in Noisy Audio Environments',
      description: 'A deep learning pipeline for detecting COVID-19 from cough audio recordings, combining U-Net-based audio denoising with machine learning classifiers (SVM, MLP). The project addresses the challenge of poor-quality audio recordings by first denoising the audio, then performing classification on the cleaned signals.',
      image: '/projects/covid.png',
      tags: ['Torch', 'Numpy', 'Pandas', 'Matplotlib', 'Python'],
      githubUrl: 'https://github.com/RizkiPutra660/COVID-19-Detection-in-Noisy-Audio',
    },
    {
      title: 'Personal Blogging System',
      description: 'A comprehensive personal article blogging system that enables users to create accounts, write articles, and engage through comments. The system features a web application built using HTML, CSS, Svelte, JavaScript, Node.js, and Express.js, with SQL database, complemented by a Java-based desktop admin interface.',
      image: '/projects/blog.png',
      tags: ['Svelte', 'Node.js', 'Express.js', 'SQL', 'Java', 'JavaScript'],
      githubUrl: 'https://github.com/RizkiPutra660/Cheery-Cats-Anime',
    },
    {
      title: 'Image Encryption Implementation for Vehicle Registration Certificate Extension Feature Development Based on Mobile Application',
      description: 'An Android-based application built with Flutter that is used to extend Vehicle Registration Certificates. The data, especially images sent to the MongoDB database, are encrypted using Henon and Arnold\'s cat map algorithm.',
      image: '/projects/stnk.png',
      tags: ['Flutter', 'MongoDB', 'Image Encryption', 'Android', 'Python'],
      githubUrl: 'https://github.com/RizkiPutra660/AplikasiPerpanjanganSTNK',
    },
    {
      title: 'Sentiment-Analysis-Twitter-Indonesia',
      description: 'A web-based application built with the Flask framework that analyzes Twitter’s user opinion about certain topics using the Support Vector Machine algorithm.',
      image: '/projects/twitter.png',
      tags: ['Flask', 'Python'],
      githubUrl: 'https://github.com/RizkiPutra660/Sentiment-Analysis-Twitter-Indonesia',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center mb-4">Projects</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects that showcase my skills and experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => {
            const isLast = index === projects.length - 1;
            return (
              <div
                key={index}
                className={isLast ? "md:col-span-2 md:justify-self-center lg:col-start-2" : undefined}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl mb-3">{project.title}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </a>
                </div>
              </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
