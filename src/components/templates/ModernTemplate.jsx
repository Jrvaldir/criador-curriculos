import React from 'react';
import { Mail, Phone, Linkedin, MapPin, User, Briefcase, GraduationCap } from 'lucide-react';
import { TemplateWrapper, templateColorOptions } from './TemplateUtils';

function ModernTemplate({ data, color, isPdfExport }) {
    const accentColor = templateColorOptions.find(c => c.id === color)?.hex || '#4F46E5';
    const filledExperience = data.experience.filter(exp => exp.company && exp.role);
    const filledEducation = data.education.filter(edu => edu.institution && edu.degree);
    const filledSkills = data.skills.filter(skill => skill.name);

    return (
        <TemplateWrapper isPdfExport={isPdfExport}>
            <div className="flex font-sans" style={{ minHeight: isPdfExport ? '297mm' : '100%' }}>
                <div className="w-1/3 p-6 sm:p-8 text-white" style={{ backgroundColor: accentColor }}>
                    {data.personalInfo.photo && (
                        <div className="flex justify-center mb-6">
                            <img src={data.personalInfo.photo} alt="Foto de perfil" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/50" />
                        </div>
                    )}
                    <h1 className="text-2xl sm:text-3xl font-bold">{data.personalInfo.fullName || "O Seu Nome"}</h1>
                    <h2 className="text-md sm:text-lg font-light mb-8">{data.personalInfo.jobTitle || "Cargo"}</h2>
                    
                    <section className="mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/50 pb-1">Contacto</h3>
                        <p className="text-xs break-all mb-1">{data.personalInfo.email}</p>
                        <p className="text-xs break-all mb-1">{data.personalInfo.phone}</p>
                        <p className="text-xs break-all mb-1">{data.personalInfo.address}</p>
                        <p className="text-xs break-all">{data.personalInfo.linkedin}</p>
                    </section>

                    {filledSkills.length > 0 && (
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/50 pb-1">Competências</h3>
                            <ul className="text-xs list-disc list-inside">
                                {filledSkills.map(skill => (<li key={skill.id}>{skill.name}</li>))}
                            </ul>
                        </section>
                    )}
                </div>
                <div className="w-2/3 p-6 sm:p-8 text-gray-800">
                    {data.summary && (
                        <section className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Resumo</h3>
                            <p className="text-sm text-gray-700">{data.summary}</p>
                        </section>
                    )}
                    {filledExperience.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Experiência</h3>
                            {filledExperience.map(exp => (
                                <div key={exp.id} className="mb-4">
                                    <h4 className="font-semibold text-base text-gray-800">{exp.role}</h4>
                                    <p className="text-sm text-gray-600">{exp.company} | {exp.startDate} - {exp.endDate || 'Atual'}</p>
                                    <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}
                    {filledEducation.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Formação</h3>
                            {filledEducation.map(edu => (
                                <div key={edu.id} className="mb-4">
                                    <h4 className="font-semibold text-base text-gray-800">{edu.degree}</h4>
                                    <p className="text-sm text-gray-600">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </div>
        </TemplateWrapper>
    );
}

export const details = {
    name: 'Moderno',
    imageUrl: '/images/templates/modern.png'
};

export default ModernTemplate;