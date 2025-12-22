import { Card } from './ui/card';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';

export function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'mathallahrizkip@gmail.com',
      link: 'mailto:mathallahrizkip@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Auckland, New Zealand',
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/RizkiPutra660',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/athallahrizki',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center mb-4">Get In Touch</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const content = (
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <h3 className="mb-2">{info.label}</h3>
                  <p className="text-gray-700">{info.value}</p>
                </Card>
              );

              return info.link ? (
                <a key={index} href={info.link} className="block">
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}
          </div>

          <Card className="p-8">
            <h3 className="text-2xl mb-6 text-center">Connect With Me</h3>
            <div className="flex justify-center gap-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="text-gray-700 group-hover:text-blue-600 transition-colors" size={28} />
                  </a>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
