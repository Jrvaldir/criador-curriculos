import React from 'react';
import { TemplateWrapper, templateColorOptions } from './TemplateUtils';

function MinimalistTemplate({ data, color, isPdfExport }) {
    const accentColor = templateColorOptions.find(c => c.id === color)?.hex || '#475569';
    const filledExperience = data.experience.filter(exp => exp.company && exp.role);
    const filledEducation = data.education.filter(edu => edu.institution && edu.degree);
    const filledSkills = data.skills.filter(skill => skill.name);

    return (
        <TemplateWrapper isPdfExport={isPdfExport}>
            <div className="p-6 sm:p-8 font-sans">
                <header className="text-center mb-8">
                    {data.personalInfo.photo && (
                        <div className="flex justify-center mb-4">
                            <img src={data.personalInfo.photo} alt="Foto de perfil" className="w-28 h-28 rounded-full object-cover shadow-md" />
                        </div>
                    )}
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{data.personalInfo.fullName || "O Seu Nome Aqui"}</h1>
                    <h2 className="text-xl font-light tracking-wide" style={{ color: accentColor }}>{data.personalInfo.jobTitle || "Cargo Desejado"}</h2>
                    <div className="text-xs text-gray-700 mt-4 flex justify-center items-center gap-x-4 gap-y-1 flex-wrap">
                        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                        {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                        {data.personalInfo.address && <span>• {data.personalInfo.address}</span>}
                        {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
                    </div>
                </header>

                {data.summary && ( <section className="mb-6"><p className="text-center text-sm text-gray-700">{data.summary}</p></section> )}
                <hr className="my-6" />
                {filledExperience.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>Experiência</h3>
                        {filledExperience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <h4 className="font-semibold text-base text-gray-900">{exp.role}</h4>
                                <p className="text-sm text-gray-600">{exp.company} | {exp.startDate} - {exp.endDate || 'Atual'}</p>
                                {exp.description && <p className="text-sm mt-1 text-gray-700">{exp.description}</p>}
                            </div>
                        ))}
                    </section>
                )}
                {filledEducation.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>Formação</h3>
                        {filledEducation.map(edu => (
                            <div key={edu.id} className="mb-4">
                                <h4 className="font-semibold text-base text-gray-900">{edu.degree}</h4>
                                <p className="text-sm text-gray-600">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>
                )}
                {filledSkills.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>Competências</h3>
                        <p className="text-sm text-gray-700">{filledSkills.map(skill => skill.name).join(' • ')}</p>
                    </section>
                )}
            </div>
        </TemplateWrapper>
    );
}

export const details = {
    name: 'Minimalista',
    imageUrl: '/images/templates/minimalist.png'
};

export default MinimalistTemplate;