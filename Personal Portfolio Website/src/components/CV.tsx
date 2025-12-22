import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

export function CV() {
  const experience = [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Innovation Inc.',
      period: '2022 - Present',
      description: 'Leading development of scalable web applications using React, Node.js, and AWS. Mentoring junior developers and implementing best practices.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions Co.',
      period: '2020 - 2022',
      description: 'Developed and maintained multiple client projects using modern JavaScript frameworks. Improved application performance by 40%.',
    },
    {
      title: 'Frontend Developer',
      company: 'StartUp Studio',
      period: '2018 - 2020',
      description: 'Built responsive web applications with React and TypeScript. Collaborated with designers to implement pixel-perfect UIs.',
    },
  ];

  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Technology',
      period: '2014 - 2018',
      description: 'Focused on software engineering, algorithms, and data structures.',
    },
  ];

  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js',
    'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
    'Git', 'REST APIs', 'GraphQL', 'Figma', 'UI/UX Design'
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

        {/* Skills */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-blue-600" size={28} />
            <h3 className="text-3xl">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-base">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
