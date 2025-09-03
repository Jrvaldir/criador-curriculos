import React from 'react';
import { Mail, Phone, Linkedin, MapPin, User, Briefcase, GraduationCap } from 'lucide-react';
import { TemplateWrapper, templateColorOptions } from './TemplateUtils';

function CreativeTemplate({ data, color, isPdfExport }) {
    const accentColor = templateColorOptions.find(c => c.id === color)?.hex || '#06B6D4'; // Cyan
    const filledExperience = data.experience.filter(exp => exp.company && exp.role);
    const filledEducation = data.education.filter(edu => edu.institution && edu.degree);
    const filledSkills = data.skills.filter(skill => skill.name);

    return (
        <TemplateWrapper isPdfExport={isPdfExport}>
            <div className="flex flex-col sm:flex-row font-sans" style={{ minHeight: isPdfExport ? '297mm' : '100%' }}>
                <div className="sm:w-[35%] bg-slate-800 text-white p-6 flex flex-col gap-6">
                    {data.personalInfo.photo && (
                        <div className="flex justify-center">
                            <img src={data.personalInfo.photo} alt="Foto de perfil" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: accentColor }} />
                        </div>
                    )}
                    <header className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: accentColor }}>{data.personalInfo.fullName || "O Seu Nome"}</h1>
                        <h2 className="text-md font-light text-slate-300">{data.personalInfo.jobTitle || "Cargo"}</h2>
                    </header>
                    
                    <hr className="border-slate-600"/>

                    <section>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Contacto</h3>
                        <div className="text-xs text-slate-300 space-y-1">
                            {data.personalInfo.email && <p className="flex items-center gap-2"><Mail size={12}/> <span className="break-all">{data.personalInfo.email}</span></p>}
                            {data.personalInfo.phone && <p className="flex items-center gap-2"><Phone size={12}/> <span className="break-all">{data.personalInfo.phone}</span></p>}
                            {data.personalInfo.address && <p className="flex items-center gap-2"><MapPin size={12}/> <span className="break-all">{data.personalInfo.address}</span></p>}
                            {data.personalInfo.linkedin && <p className="flex items-center gap-2"><Linkedin size={12}/> <span className="break-all">{data.personalInfo.linkedin}</span></p>}
                        </div>
                    </section>
                    
                    {filledSkills.length > 0 && (
                        <section>
                            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Competências</h3>
                            <ul className="text-xs text-slate-300 space-y-1 list-inside list-disc">
                                {filledSkills.map(skill => (<li key={skill.id}>{skill.name}</li>))}
                            </ul>
                        </section>
                    )}

                </div>

                <div className="sm:w-[65%] p-8 bg-slate-50 text-gray-800">
                    {data.summary && (
                        <section className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}><User size={20}/> Resumo</h3>
                            <p className="text-sm text-slate-700">{data.summary}</p>
                        </section>
                    )}
                    {filledExperience.length > 0 && (
                        <section className="mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}><Briefcase size={20}/> Experiência</h3>
                            <div className="space-y-4">
                            {filledExperience.map(exp => (
                                <div key={exp.id}>
                                    <h4 className="font-semibold text-base text-slate-800">{exp.role}</h4>
                                    <p className="text-sm text-slate-500 mb-1">{exp.company} | {exp.startDate} - {exp.endDate || 'Atual'}</p>
                                    <p className="text-sm text-slate-700">{exp.description}</p>
                                </div>
                            ))}
                            </div>
                        </section>
                    )}
                    {filledEducation.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}><GraduationCap size={20}/> Formação</h3>
                            <div className="space-y-4">
                            {filledEducation.map(edu => (
                                <div key={edu.id}>
                                    <h4 className="font-semibold text-base text-slate-800">{edu.degree}</h4>
                                    <p className="text-sm text-slate-500">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </TemplateWrapper>
    );
}

export const details = {
    name: 'Criativo',
    imageUrl: '/images/templates/creative.png'
};

export default CreativeTemplate;