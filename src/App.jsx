import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import {
    PlusCircle, Trash2, ArrowRight, Briefcase, GraduationCap, User, BookOpen,
    Lightbulb, ArrowLeft, Download, Palette, Star, CheckCircle, Mail, Phone, Linkedin, MapPin, Loader2,
    ZoomIn, ZoomOut, ArrowUp, ArrowDown, RefreshCw, Sparkles, Camera, X, Eye
} from 'lucide-react';
    
// Importando utilidades e um template específico para o preview
import { templateColorOptions } from './components/templates/TemplateUtils.jsx';
import MinimalistTemplate from './components/templates/MinimalistTemplate.jsx';

// ===================================================================
// DETECÇÃO AUTOMÁTICA DE TEMPLATES
// Este código encontra todos os templates na pasta e os adiciona à lista.
// ===================================================================
const templateModules = import.meta.glob('./components/templates/*.jsx', { eager: true });

const templates = Object.entries(templateModules).map(([path, module]) => {
    // Ignora arquivos que não exportam os detalhes necessários
    if (!module.default || !module.details) {
        return null;
    }
    // Extrai um ID a partir do nome do arquivo (ex: "ClassicTemplate.jsx" vira "classic")
    const id = path.match(/.*\/(.*?).jsx/)[1].replace('Template', '').toLowerCase();
    
    return {
        id: id,
        name: module.details.name,
        type: 'free',
        component: module.default,
        imageUrl: module.details.imageUrl
    };
}).filter(Boolean); // Remove quaisquer entradas nulas se um arquivo estiver mal formatado


// --- GERENCIAMENTO DE ESTADO (REACT CONTEXT) ---
const ResumeContext = createContext();

const emptyResumeData = {
    personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', linkedin: '', address: '', photo: '' },
    summary: '',
    experience: [{ id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' }],
    education: [{ id: Date.now(), institution: '', degree: '', startDate: '', endDate: '' }],
    skills: [{ id: Date.now(), name: '' }],
};

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState(() => {
        try {
            const savedData = sessionStorage.getItem('resumeData');
            return savedData ? JSON.parse(savedData) : emptyResumeData;
        } catch (error) {
            return emptyResumeData;
        }
    });

    useEffect(() => {
        sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, [resumeData]);

    const handleChange = (section, field, value) => {
        const update = (prev) => section
            ? { ...prev, [section]: { ...prev[section], [field]: value } }
            : { ...prev, [field]: value };
        setResumeData(update);
    };

    const handleDynamicChange = (section, id, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const addItem = (section, newItem) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: Date.now(), ...newItem }]
        }));
    };

    const removeItem = (section, id) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const moveItem = (section, index, direction) => {
        const newItems = [...resumeData[section]];
        const newIndex = index + (direction === 'up' ? -1 : 1);
        if (newIndex < 0 || newIndex >= newItems.length) return;
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
        setResumeData(prev => ({ ...prev, [section]: newItems }));
    };

    const clearResume = () => {
        if (window.confirm("Tem a certeza de que deseja limpar todos os campos? O seu progresso atual será perdido.")) {
            setResumeData(emptyResumeData);
        }
    };

    const value = { resumeData, handleChange, handleDynamicChange, addItem, removeItem, moveItem, clearResume, setResumeData };

    return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};


// --- COMPONENTES DA UI ---
const Section = ({ icon, title, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">{icon}<h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 ml-3">{title}</h2></div>
      <div className="space-y-4">{children}</div>
    </div>
);
const FormInput = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
);
const FormTextarea = ({ label, name, value, onChange, placeholder, onEnhance, isEnhancing }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows="4" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      {onEnhance && (
        <button onClick={onEnhance} disabled={isEnhancing} className="absolute bottom-2 right-2 p-1.5 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-all disabled:bg-yellow-300 disabled:cursor-not-allowed">
            {isEnhancing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        </button>
      )}
    </div>
);

// --- Componente de Anúncio ---
const AdModal = ({ isVisible, onComplete }) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (isVisible) {
            setCountdown(3);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        onComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
                <h3 className="text-lg font-bold mb-2">Aguarde, por favor</h3>
                <p className="mb-4">A aplicação é mantida através de anúncios.</p>
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 mb-4">
                    [ Placeholder de Anúncio ]
                </div>
                <p className="text-sm">A sua ação continuará em {countdown}...</p>
            </div>
        </div>
    );
};

// --- Componente Modal de Agradecimento ---
const ThankYouModal = ({ isVisible, onComplete }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onComplete();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center flex flex-col items-center gap-4">
                <CheckCircle size={48} className="text-green-500" />
                <h3 className="text-xl font-bold">Obrigado por usar a nossa plataforma!</h3>
                <p>O seu download foi iniciado.</p>
                <p className="text-sm text-gray-500">A regressar ao início...</p>
            </div>
        </div>
    );
};


// --- Componente Modal de Corte de Foto ---
const PhotoCropModal = ({ src, onCropComplete, onCancel }) => {
    const imageRef = useRef(null);
    const [cropper, setCropper] = useState(null);

    useEffect(() => {
        if (imageRef.current && src && window.Cropper) {
            const cropperInstance = new window.Cropper(imageRef.current, {
                aspectRatio: 1,
                viewMode: 1,
                background: false,
                responsive: true,
                restore: true,
            });
            setCropper(cropperInstance);

            return () => {
                cropperInstance.destroy();
            };
        }
    }, [src]);

    const handleCrop = () => {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas({
                width: 300,
                height: 300,
                imageSmoothingQuality: 'high',
            });
            onCropComplete(croppedCanvas.toDataURL('image/jpeg'));
        }
    };

    if (!src) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">Ajuste a sua Foto</h3>
                <div className="max-h-[60vh] overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img ref={imageRef} src={src} alt="Recortar foto" style={{ maxWidth: '100%' }} />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleCrop} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Guardar Foto</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente da Tela de Layouts ---
const LayoutsView = ({ setView }) => {
    const { resumeData } = useContext(ResumeContext);
    const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
    const [selectedColor, setSelectedColor] = useState(templateColorOptions[0].id);
    const [isDownloading, setIsDownloading] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0);
    const [showAd, setShowAd] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const mainContainerRef = useRef(null);
    const resumePreviewRef = useRef(null);

    useEffect(() => {
        const calculateAndSetZoom = () => {
            if (mainContainerRef.current && resumePreviewRef.current) {
                const mainStyle = window.getComputedStyle(mainContainerRef.current);
                const paddingX = parseFloat(mainStyle.paddingLeft) + parseFloat(mainStyle.paddingRight);
                const availableWidth = mainContainerRef.current.clientWidth - paddingX;
                const resumeWidth = resumePreviewRef.current.offsetWidth;
                if (resumeWidth > 0 && availableWidth > 0) {
                    setZoomLevel(availableWidth / resumeWidth);
                }
            }
        };
        const timer = setTimeout(calculateAndSetZoom, 100);
        window.addEventListener('resize', calculateAndSetZoom);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateAndSetZoom);
        };
    }, []);

    const startDownload = async () => {
        if (isDownloading) return;

        if (!window.jspdf || !window.html2canvas) {
            alert("Erro: As bibliotecas para gerar PDF não foram carregadas. Verifique sua conexão com a internet e tente recarregar a página.");
            return;
        }

        setIsDownloading(true);
        const { jsPDF } = window.jspdf;
        const Tpl = templates.find(t => t.id === selectedTemplateId)?.component;
        if (!Tpl) {
            setIsDownloading(false);
            return;
        }

        const pdfContainer = document.createElement('div');
        pdfContainer.style.position = 'absolute';
        pdfContainer.style.left = '-9999px';
        pdfContainer.style.width = '210mm';
        pdfContainer.style.height = 'auto';
        document.body.appendChild(pdfContainer);

        const root = createRoot(pdfContainer);
        root.render(<Tpl data={resumeData} color={selectedColor} isPdfExport={true} />);

        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const canvas = await window.html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${(resumeData.personalInfo.fullName || 'curriculo').replace(/\s+/g, '_')}_CV.pdf`);

            setShowThankYou(true);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Ocorreu um erro ao tentar gerar o PDF. Por favor, tente novamente.");
        } finally {
            root.unmount();
            document.body.removeChild(pdfContainer);
            setIsDownloading(false);
        }
    };

    const renderTemplate = () => {
        const Tpl = templates.find(t => t.id === selectedTemplateId)?.component;
        if (!Tpl) return <div>Selecione um modelo</div>;
        return <Tpl data={resumeData} color={selectedColor} />;
    };

    return (
        <>
            <AdModal isVisible={showAd} onComplete={startDownload} />
            <ThankYouModal isVisible={showThankYou} onComplete={() => setView('landing')} />
            <PreviewModal isVisible={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
                {renderTemplate()}
            </PreviewModal>
            
            <button
                onClick={() => setShowPreviewModal(true)}
                title="Ver Pré-visualização"
                className="lg:hidden fixed bottom-6 right-6 bg-teal-500 text-white p-4 rounded-full shadow-lg z-40 flex items-center gap-2 animate-bounce"
            >
                <Eye size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
                <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 p-6 overflow-y-auto shadow-lg flex-shrink-0">
                    <div className="flex items-center justify-between mb-8"> <h1 className="text-2xl font-bold">Personalize</h1> <button onClick={() => setView('form')} className="flex items-center text-sm text-blue-600 hover:underline"><ArrowLeft size={16} className="mr-1" /> Voltar</button> </div>
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold flex items-center mb-4"><Palette className="mr-2"/> Modelos</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {templates.map(template => (
                                <div key={template.id} onClick={() => setSelectedTemplateId(template.id)} className={`cursor-pointer border-2 rounded-lg p-1 relative transition-all ${selectedTemplateId === template.id ? 'border-blue-500 scale-105' : 'border-gray-300 dark:border-gray-600'}`}>
                                    <img src={template.imageUrl} alt={`Preview do modelo ${template.name}`} className="w-full h-auto rounded-md bg-gray-200" />
                                    <p className="text-center text-xs mt-2 font-semibold">{template.name}</p>
                                    {selectedTemplateId === template.id && <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full"><CheckCircle size={16} /></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-8"> <h2 className="text-lg font-semibold flex items-center mb-4"><Palette className="mr-2"/> Cor de Destaque</h2> <div className="flex flex-wrap gap-3"> {templateColorOptions.map(color => ( <button key={color.id} onClick={() => setSelectedColor(color.id)} className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor === color.id ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color.hex }}></button> ))} </div> </div>
                    <button onClick={() => setShowAd(true)} disabled={isDownloading} className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-lg font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"> {isDownloading ? ( <><Loader2 size={20} className="mr-2 animate-spin" /> A gerar PDF...</> ) : ( <><Download size={20} className="mr-2" /> Baixar Currículo</> )} </button>
                    <div className="h-24 mt-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 rounded-lg"> Banner de Anúncio </div>
                </aside>
                <main ref={mainContainerRef} className="flex-1 p-4 md:p-8 flex-col items-center overflow-auto min-w-0 hidden md:flex bg-gray-200 dark:bg-gray-800">
                    <div className="w-full max-w-[794px] bg-gray-300 dark:bg-gray-700 p-2 rounded-md mb-4 flex items-center justify-center space-x-4 sticky top-0 z-10"> <button onClick={() => setZoomLevel(z => Math.max(0.2, z - 0.1))} className="p-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"><ZoomOut size={20}/></button> <span className="text-sm font-medium w-16 text-center">{Math.round(zoomLevel * 100)}%</span> <button onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))} className="p-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"><ZoomIn size={20}/></button> </div>
                    <div className="py-8">
                        <div id="resume-container" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', opacity: zoomLevel === 0 ? 0 : 1 }} className="transition-all duration-200">
                            <div id="resume-preview" ref={resumePreviewRef} className="w-[210mm] min-h-[297mm] shadow-lg">
                                {renderTemplate()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

// --- Componente Modal de Pré-visualização (Mobile) ---
const PreviewModal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center z-50 p-4 lg:hidden">
            <div className="w-full max-w-[210mm] flex justify-end mb-4">
                <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                    <X size={24} />
                </button>
            </div>
            <div className="w-full h-full overflow-y-auto">
                <div className="w-[210mm] min-h-[297mm] mx-auto scale-[0.45] sm:scale-[0.6] md:scale-[0.8] origin-top">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Componente Modal de Feedback ---
const FeedbackModal = ({ isVisible, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');


    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch("https://formspree.io/f/xrbaavyb", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ rating: `${rating} estrela(s)`, feedback }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setRating(0);
                    setFeedback('');
                }, 2000);
            } else {
                throw new Error('Falha no envio do formulário.');
            }
        } catch (error) {
            console.error("Erro ao enviar feedback:", error);
            setSubmitError('Não foi possível enviar o seu feedback. Tente novamente mais tarde.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setRating(0);
            setHoverRating(0);
            setFeedback('');
            setSubmitted(false);
            setSubmitError('');
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center w-full max-w-md">
                {submitted ? (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle size={48} className="text-green-500" />
                        <h3 className="text-xl font-bold">Obrigado pelo seu feedback!</h3>
                        <p className="text-sm text-gray-500">A sua opinião é muito importante para nós.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold mb-2">Deixe a sua Avaliação</h3>
                        <p className="text-sm text-gray-500 mb-4">O que achou da nossa ferramenta?</p>
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`cursor-pointer transition-colors ${ (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                    fill={ (hoverRating || rating) >= star ? 'currentColor' : 'none' }
                                    size={32}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Diga-nos como podemos melhorar..."
                            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 mb-6"
                            rows="3"
                        ></textarea>
                        {submitError && <p className="text-red-500 text-sm mb-4">{submitError}</p>}
                        <div className="flex justify-end gap-4">
                            <button onClick={handleClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">Cancelar</button>
                            <button onClick={handleSubmit} disabled={isSubmitting || rating === 0} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                                {isSubmitting ? (
                                    <span className="flex items-center"><Loader2 size={16} className="animate-spin mr-2"/> A enviar...</span>
                                ) : (
                                    'Enviar Feedback'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


// --- COMPONENTE DA TELA INICIAL (LANDING PAGE) ---
const LandingView = ({ handleStart }) => {
    const PortfolioButton = (
        <div className="relative w-[4.5rem] h-[4.5rem] flex items-center justify-center group">
            <div className="absolute w-[6.5rem] h-[6.5rem]" style={{ animation: 'rotate-forever 12s linear infinite' }}><span className="absolute top-0 left-1/2 -mt-1 -ml-1 w-2 h-2 rounded-full bg-orange-400"></span></div>
            <div className="absolute w-[6.5rem] h-[6.5rem]" style={{ animation: 'rotate-forever 10s linear infinite reverse' }}><span className="absolute top-1/2 -left-1.5 -mt-1.5 w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300"></span></div>
            <div className="absolute w-[6.5rem] h-[6.5rem]" style={{ animation: 'rotate-forever 15s linear infinite' }}><span className="absolute bottom-0 left-1/2 -mb-1 -ml-1 w-2 h-2 rounded-full bg-orange-400"></span></div>
            <a href="https://jrvaldir.github.io" target="_blank" rel="noopener noreferrer" className="relative w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-lg border-2 border-gray-700 dark:border-gray-600 group-hover:border-orange-500 transition-colors">Portfólio</a>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <header className="hidden sm:flex w-full p-4 sm:p-6 lg:p-8">
                <div className="flex justify-end items-center max-w-screen-xl mx-auto w-full">
                    {PortfolioButton}
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-600 dark:text-blue-500">
                    Criador de Currículos Inteligente
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Crie um currículo profissional em minutos. Preencha os seus dados, escolha um modelo e deixe a nossa IA otimizar o conteúdo para si.
                </p>
                
                <div className="sm:hidden w-full flex justify-center items-center px-2 my-8 max-w-xs mx-auto">
                    {PortfolioButton}
                </div>

                <button 
                    onClick={handleStart} 
                    className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                    Começar a Construir
                    <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
                </button>
            </main>

            <footer className="w-full p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>Desenvolvido com React e Tailwind CSS. Potenciado por IA.</p>
            </footer>
        </div>
    );
};


// --- COMPONENTE DO FORMULÁRIO ---
const FormView = ({ setView }) => {
    const { resumeData, handleChange, handleDynamicChange, addItem, removeItem, moveItem, clearResume } = useContext(ResumeContext);
    const [showAd, setShowAd] = useState(false);
    const [isImproving, setIsImproving] = useState(null);
    const photoUploadRef = useRef(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveCroppedPhoto = (croppedImage) => {
        handleChange('personalInfo', 'photo', croppedImage);
        setImageToCrop(null);
    };

    const enhanceWithAI = async (section, text, id = null) => {
        const jobTitle = resumeData.personalInfo.jobTitle || "profissional";
        let prompt;
        if (section === 'summary') {
            prompt = `Como um especialista em recrutamento, reescreva o seguinte resumo profissional para um(a) ${jobTitle} para ser mais impactante e focado em resultados. Mantenha a essência do texto original. Responda APENAS com o texto reescrito, sem introduções, explicações ou formatação especial como markdown. Texto original: "${text}"`;
        } else { // experience
            prompt = `Como um especialista em recrutamento, reescreva a seguinte descrição de atividades para um(a) ${jobTitle} usando verbos de ação e focando em conquistas. Mantenha a essência do texto original. Responda APENAS com o texto reescrito, sem introduções, explicações ou formatação especial como markdown. Texto original: "${text}"`;
        }

        setIsImproving({section, id});
        try {
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const result = await response.json();
            const improvedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (improvedText) {
                const sanitizedText = improvedText.trim().replace(/[*_`#~]/g, '');
                if (id) { handleDynamicChange(section, id, 'description', sanitizedText); } 
                else { handleChange(null, section, sanitizedText); }
            }
        } catch (error) { console.error("Erro ao chamar a IA:", error); } 
        finally { setIsImproving(null); }
    };

    const PortfolioButton = (
        <div className="relative w-[4.5rem] h-[4.5rem] flex items-center justify-center group">
            <div className="absolute w-[6.5rem] h-[6.5rem]" style={{ animation: 'rotate-forever 12s linear infinite' }}><span className="absolute top-0 left-1/2 -mt-1 -ml-1 w-2 h-2 rounded-full bg-orange-400"></span></div>
            <div className="absolute w-[6.5rem] h-[6.5rem]" style={{ animation: 'rotate-forever 10s linear infinite reverse' }}><span className="absolute top-1/2 -left-1.5 -mt-1.5 w-3 h-3 rounded-full bg-slate-700 dark:bg-slate-300"></span></div>
            <div className="absolute w-[6.5rem] h-[6.5rem]" style={{ animation: 'rotate-forever 15s linear infinite' }}><span className="absolute bottom-0 left-1/2 -mb-1 -ml-1 w-2 h-2 rounded-full bg-orange-400"></span></div>
            <a href="https://jrvaldir.github.io" target="_blank" rel="noopener noreferrer" className="relative w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-lg border-2 border-gray-700 dark:border-gray-600 group-hover:border-orange-500 transition-colors">Portfólio</a>
        </div>
    );
    
    return (
        <>
        <PhotoCropModal src={imageToCrop} onCropComplete={handleSaveCroppedPhoto} onCancel={() => setImageToCrop(null)} />
        <AdModal isVisible={showAd} onComplete={() => setView('layouts')} />
        <PreviewModal isVisible={showPreviewModal} onClose={() => setShowPreviewModal(false)}>
            <MinimalistTemplate data={resumeData} color={'slate'} />
        </PreviewModal>
        
        <div className="relative flex flex-col lg:flex-row min-h-screen">
            <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900">
                <header className="mb-8">
                    <div className="hidden sm:flex justify-between items-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-500">Criador de Currículos</h1>
                        {PortfolioButton}
                    </div>

                    <div className="sm:hidden flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-500">Criador de Currículos</h1>
                        </div>
                        <div className="w-full flex justify-center items-center px-2">
                            {PortfolioButton}
                        </div>
                    </div>
                    
                    <p className="text-center text-lg text-gray-600 dark:text-gray-400 mt-2">Preencha e veja a magia acontecer!</p>
                </header>
                <main className="space-y-6">
                    <Section icon={<User className="text-blue-500" size={24} />} title="Dados Pessoais">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" ref={photoUploadRef} />
                                <button onClick={() => photoUploadRef.current.click()} className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors overflow-hidden">
                                    {resumeData.personalInfo.photo ? (
                                        <img src={resumeData.personalInfo.photo} alt="Foto de perfil" className="w-full h-full object-cover" />
                                    ) : ( <Camera size={32} /> )}
                                </button>
                                {resumeData.personalInfo.photo && (
                                    <button onClick={() => handleChange('personalInfo', 'photo', '')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"> <X size={14} /> </button>
                                )}
                            </div>
                            <div className="flex-grow">
                                <p className="font-medium text-gray-800 dark:text-gray-200">Foto de Perfil</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Clique no ícone para adicionar ou alterar sua foto.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
                            <FormInput label="Nome Completo" name="fullName" value={resumeData.personalInfo.fullName} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} />
                            <FormInput label="Cargo Desejado" name="jobTitle" value={resumeData.personalInfo.jobTitle} onChange={e => handleChange('personalInfo', 'jobTitle', e.target.value)} />
                            <FormInput label="Email" name="email" type="email" value={resumeData.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} />
                            <FormInput label="Telefone" name="phone" value={resumeData.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} />
                            <FormInput label="Endereço" name="address" value={resumeData.personalInfo.address} onChange={e => handleChange('personalInfo', 'address', e.target.value)} />
                            <FormInput label="Perfil LinkedIn (URL)" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={e => handleChange('personalInfo', 'linkedin', e.target.value)} />
                        </div>
                    </Section>
                    <Section icon={<BookOpen className="text-blue-500" size={24} />} title="Resumo Profissional">
                        <FormTextarea label="Resumo" name="summary" value={resumeData.summary} onChange={e => handleChange(null, 'summary', e.target.value)} onEnhance={() => enhanceWithAI('summary', resumeData.summary)} isEnhancing={isImproving?.section === 'summary'}/>
                    </Section>
                    <Section icon={<Briefcase className="text-blue-500" size={24} />} title="Experiência Profissional">
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border dark:border-gray-700 rounded-lg space-y-4 relative">
                                <div className="absolute top-3 right-3 flex items-center space-x-2"> <button onClick={() => moveItem('experience', index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-blue-500 disabled:opacity-50"><ArrowUp size={18} /></button> <button onClick={() => moveItem('experience', index, 'down')} disabled={index === resumeData.experience.length - 1} className="text-gray-400 hover:text-blue-500 disabled:opacity-50"><ArrowDown size={18} /></button> {resumeData.experience.length > 1 && <button onClick={() => removeItem('experience', exp.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>} </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                  <FormInput label="Empresa" name="company" value={exp.company} onChange={e => handleDynamicChange('experience', exp.id, 'company', e.target.value)} />
                                  <FormInput label="Cargo" name="role" value={exp.role} onChange={e => handleDynamicChange('experience', exp.id, 'role', e.target.value)} />
                                  <FormInput label="Data de Início" name="startDate" type="month" value={exp.startDate} onChange={e => handleDynamicChange('experience', exp.id, 'startDate', e.target.value)} />
                                  <FormInput label="Data de Fim" name="endDate" type="month" value={exp.endDate} onChange={e => handleDynamicChange('experience', exp.id, 'endDate', e.target.value)} />
                                </div>
                                <FormTextarea label="Descrição das Atividades" name="description" value={exp.description} onChange={e => handleDynamicChange('experience', exp.id, 'description', e.target.value)} onEnhance={() => enhanceWithAI('experience', exp.description, exp.id)} isEnhancing={isImproving?.section === 'experience' && isImproving?.id === exp.id}/>
                            </div>
                        ))}
                        <button onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"><PlusCircle size={18} className="mr-2" /> Adicionar Experiência</button>
                    </Section>
                    <Section icon={<GraduationCap className="text-blue-500" size={24} />} title="Formação Acadêmica">
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="p-4 border dark:border-gray-700 rounded-lg space-y-4 relative">
                                <div className="absolute top-3 right-3 flex items-center space-x-2"> <button onClick={() => moveItem('education', index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-blue-500 disabled:opacity-50"><ArrowUp size={18} /></button> <button onClick={() => moveItem('education', index, 'down')} disabled={index === resumeData.education.length - 1} className="text-gray-400 hover:text-blue-500 disabled:opacity-50"><ArrowDown size={18} /></button> {resumeData.education.length > 1 && <button onClick={() => removeItem('education', edu.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>} </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <FormInput label="Instituição de Ensino" name="institution" value={edu.institution} onChange={e => handleDynamicChange('education', edu.id, 'institution', e.target.value)} />
                                    <FormInput label="Curso / Graduação" name="degree" value={edu.degree} onChange={e => handleDynamicChange('education', edu.id, 'degree', e.target.value)} />
                                    <FormInput label="Data de Início" name="startDate" type="month" value={edu.startDate} onChange={e => handleDynamicChange('education', edu.id, 'startDate', e.target.value)} />
                                    <FormInput label="Data de Fim" name="endDate" type="month" value={edu.endDate} onChange={e => handleDynamicChange('education', edu.id, 'endDate', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('education', { institution: '', degree: '', startDate: '', endDate: '' })} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"><PlusCircle size={18} className="mr-2" /> Adicionar Formação</button>
                    </Section>
                    <Section icon={<Lightbulb className="text-blue-500" size={24} />} title="Habilidades">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {resumeData.skills.map((skill) => (
                                <div key={skill.id} className="flex items-center">
                                    <FormInput label="" name="skill" value={skill.name} onChange={e => handleDynamicChange('skills', skill.id, 'name', e.target.value)} placeholder="Ex: React" />
                                    {resumeData.skills.length > 1 && <button onClick={() => removeItem('skills', skill.id)} className="ml-2 mt-1 text-red-500 hover:text-red-700 shrink-0"><Trash2 size={18} /></button>}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => addItem('skills', { name: '' })} className="flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium mt-4"><PlusCircle size={18} className="mr-2" /> Adicionar Habilidade</button>
                    </Section>
                    <div className="pt-6 flex justify-between items-center">
                        <button onClick={clearResume} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"> <RefreshCw className="mr-2 h-4 w-4" /> Limpar Tudo </button>
                        <button onClick={() => setShowAd(true)} className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"> Personalizar e Baixar <ArrowRight className="ml-3 -mr-1 h-5 w-5" /> </button>
                    </div>
                    <div className="h-24 mt-8 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 rounded-lg"> Banner de Anúncio </div>
                </main>
            </div>
            <div className="hidden lg:block lg:w-1/2 bg-gray-200 dark:bg-gray-800 p-8 overflow-y-auto h-screen">
                <div className="sticky top-0 z-10 mb-8 w-full flex justify-center"> <div className="w-full max-w-[210mm] text-center bg-gray-300/80 dark:bg-gray-700/80 backdrop-blur-sm p-3 rounded-xl"> <h3 className="font-bold text-lg">Pré-visualização em Tempo Real</h3> <p className="text-sm text-gray-600 dark:text-gray-400">Modelo: Minimalista</p> </div> </div>
                <div className="w-[210mm] min-h-[297mm] mx-auto scale-[0.8] origin-top"> <MinimalistTemplate data={resumeData} color={'slate'} /> </div>
            </div>
        </div>
        </>
    );
}

// --- Componente Principal da Aplicação ---
export default function App() {
    const [view, setView] = useState('landing');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleStart = () => {
        setView('form');
    };
    
    const renderCurrentView = () => {
        switch(view) {
            case 'form':
                return <FormView setView={setView} />;
            case 'layouts':
                return <LayoutsView setView={setView} />;
            case 'landing':
            default:
                return <LandingView handleStart={handleStart} />;
        }
    };

    return (
        <>
            <style>{`
                @keyframes rotate-forever {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
            `}</style>
            <ResumeProvider>
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
                    <button
                        onClick={() => setShowFeedbackModal(true)}
                        title="Deixar Feedback"
                        className="fixed bottom-6 left-6 bg-teal-500 text-white p-4 rounded-full shadow-lg z-40 hover:bg-teal-600 transition-colors"
                    >
                        <Lightbulb size={24} />
                    </button>
                    <FeedbackModal isVisible={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
                    {renderCurrentView()}
                </div>
            </ResumeProvider>
            <Analytics/>
        </>
    );
}
