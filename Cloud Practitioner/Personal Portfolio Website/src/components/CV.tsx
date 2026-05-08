import { Card } from './ui/card';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

export function CV() {
  const experience = [
    {
      title: 'Software Intern',
      company: 'Auckland ICT Graduate School',
      period: '2025 - Present',
      description: 'Developing AI Integrated Software Quality Assurance Web App using React Frontend and Flask Backend with SQL Database. Working with developers with diverse backgrounds and implementing best practices.',
    },
    {
      title: 'Network Engineer',
      company: 'PT. Bank Central Asia Tbk',
      period: '2021 - 2024',
      description: 'Managed and maintained network availability and data center network devices for the company’s internal applications. Collaborated in Network Reliability team that is responsible for monitoring and analysing devices’ utilization, which is useful for capacity planning.',
    },
    {
      title: 'Research Intern',
      company: 'PT. Kreasi Rekayasa Indonesia',
      period: '2020',
      description: 'Built Twitter Sentiment Analysis web application using Flask Framework. Created Support Vector Machine (SVM) model which achieved the highest F-score of 0,87.',
    },
  ];

  const education = [
    {
      degree: 'Master of Information Technology',
      school: 'University of Auckland',
      period: '2024 - 2026',
      description: 'Focused on software and web development, data science, and cloud computing.',
    },
    {
      degree: 'Bachelor of Science in Telecomunications Engineering',
      school: 'Bandung Institute of Technology',
      period: '2017 - 2021',
      description: 'Thesis: Front-end Subsystem Design for Vehicle Registration Certificate Application with Image Encryption',
    },
  ];

  const certifications = [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2025',
    },
    {
      name: 'AWS Certified AI Practitioner',
      issuer: 'Amazon Web Services',
      date: '2025',
    },
  ];

  return (
    <section id="cv" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center mb-12">Curriculum Vitae</h2>

        {/* Experience */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-blue-600" size={28} />
            <h3 className="text-3xl">Experience</h3>
          </div>
          <div className="space-y-6">
            {experience.map((job, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h4 className="text-xl mb-1">{job.title}</h4>
                    <p className="text-blue-600">{job.company}</p>
                  </div>
                  <p className="text-gray-600 mt-2 md:mt-0">{job.period}</p>
                </div>
                <p className="text-gray-700">{job.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-blue-600" size={28} />
            <h3 className="text-3xl">Education</h3>
          </div>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h4 className="text-xl mb-1">{edu.degree}</h4>
                    <p className="text-blue-600">{edu.school}</p>
                  </div>
                  <p className="text-gray-600 mt-2 md:mt-0">{edu.period}</p>
                </div>
                <p className="text-gray-700">{edu.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-blue-600" size={28} />
            <h3 className="text-3xl">Certifications</h3>
          </div>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{cert.name}</h4>
                    <p className="text-blue-600">{cert.issuer}</p>
                  </div>
                  <p className="text-gray-600 mt-2 md:mt-0">{cert.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
