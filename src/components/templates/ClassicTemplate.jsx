import React from 'react';
import { Mail, Phone, Linkedin, MapPin } from 'lucide-react';
import { TemplateWrapper, templateColorOptions } from './TemplateUtils';

function ClassicTemplate({ data, color, isPdfExport }) {
    const accentColor = templateColorOptions.find(c => c.id === color)?.hex || '#2563EB';
    const filledExperience = data.experience.filter(exp => exp.company && exp.role);
    const filledEducation = data.education.filter(edu => edu.institution && edu.degree);
    const filledSkills = data.skills.filter(skill => skill.name);

    return (
        <TemplateWrapper isPdfExport={isPdfExport}>
            <div style={{ minHeight: isPdfExport ? '297mm' : '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="p-6 sm:p-8 text-gray-800 font-serif flex flex-col sm:flex-row items-center justify-between gap-4">
                    {data.personalInfo.photo && (
                        <img src={data.personalInfo.photo} alt="Foto de perfil" className="w-28 h-28 rounded-full object-cover border-4 flex-shrink-0" style={{ borderColor: accentColor }}/>
                    )}
                    <header className="text-center flex-grow">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-gray-900">{data.personalInfo.fullName || "O Seu Nome Aqui"}</h1>
                        {data.personalInfo.jobTitle && <h2 className="text-base sm:text-lg font-light" style={{ color: accentColor }}>{data.personalInfo.jobTitle}</h2>}
                    </header>
                </div>
                <div className="px-6 sm:px-8">
                    {data.summary && <p className="text-center text-sm my-6 border-y-2 py-4 text-gray-800" style={{ borderColor: accentColor }}>{data.summary}</p>}
                </div>
                <div className="flex-grow flex flex-col sm:flex-row px-6 sm:px-8 pb-8 font-serif">
                    <div className="sm:w-2/3 sm:pr-6">
                        {filledExperience.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold uppercase border-b mb-4" style={{ color: accentColor }}>Experiência</h3>
                                {filledExperience.map(exp => (
                                    <div key={exp.id} className="mb-4 break-inside-avoid">
                                        <h4 className="font-semibold text-base text-gray-800">{exp.role}</h4>
                                        <p className="text-sm text-gray-600">{exp.company} | {exp.startDate} - {exp.endDate || 'Atual'}</p>
                                        {exp.description && <p className="text-sm mt-1 text-gray-700">{exp.description}</p>}
                                    </div>
                                ))}
                            </section>
                        )}
                        {filledEducation.length > 0 && (
                            <section className="mt-6">
                                <h3 className="text-lg font-bold uppercase border-b mb-4" style={{ color: accentColor }}>Formação</h3>
                                {filledEducation.map(edu => (
                                    <div key={edu.id} className="mb-4 break-inside-avoid">
                                        <h4 className="font-semibold text-base text-gray-800">{edu.degree}</h4>
                                        <p className="text-sm text-gray-600">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                    <div className="sm:w-1/3 sm:pl-6 sm:border-l sm:border-gray-200 mt-6 sm:mt-0">
                        <section>
                            <h3 className="text-lg font-bold uppercase border-b mb-4" style={{ color: accentColor }}>Contacto</h3>
                            <table className="text-sm w-full" style={{ borderCollapse: 'collapse' }}>
                                <tbody className="text-gray-800">
                                    {data.personalInfo.email && <tr><td style={{width: '24px', verticalAlign: 'middle'}} className="py-1.5"><Mail size={14} className="shrink-0"/></td><td className="pl-2 break-all align-middle">{data.personalInfo.email}</td></tr>}
                                    {data.personalInfo.phone && <tr><td style={{width: '24px', verticalAlign: 'middle'}} className="py-1.5"><Phone size={14} className="shrink-0"/></td><td className="pl-2 break-all align-middle">{data.personalInfo.phone}</td></tr>}
                                    {data.personalInfo.address && <tr><td style={{width: '24px', verticalAlign: 'middle'}} className="py-1.5"><MapPin size={14} className="shrink-0"/></td><td className="pl-2 break-all align-middle">{data.personalInfo.address}</td></tr>}
                                    {data.personalInfo.linkedin && <tr><td style={{width: '24px', verticalAlign: 'middle'}} className="py-1.5"><Linkedin size={14} className="shrink-0"/></td><td className="pl-2 break-all align-middle">{data.personalInfo.linkedin}</td></tr>}
                                </tbody>
                            </table>
                        </section>
                        {filledSkills.length > 0 && (
                            <section className="mt-6">
                                <h3 className="text-lg font-bold uppercase border-b mb-4" style={{ color: accentColor }}>Competências</h3>
                                <ul className="list-disc list-inside text-gray-800">
                                    {filledSkills.map(skill => (
                                        <li key={skill.id} className="py-1">{skill.name}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </TemplateWrapper>
    );
}

export const details = {
    name: 'Clássico',
    imageUrl: '/images/templates/classic.png'
};

export default ClassicTemplate;