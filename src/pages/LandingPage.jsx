import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, Lock, Zap } from 'lucide-react';
import '../styles/LandingPage.css';

/**
 * AccuJuris Website - Modern Institutional Design
 * Design Philosophy: Trust, Precision, India-Centric Accessibility
 * Color Palette: Deep Navy (#1A2B4D) + Warm Amber (#FFB800)
 * Typography: Poppins (headings) + Inter (body)
 */

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState("problem");

    return (
        <div className="lp-wrapper">
            {/* Navigation */}
            <nav className="lp-nav">
                <div className="lp-container">
                    <div className="lp-logo">
                        <div className="lp-logo-icon">A</div>
                        <span className="lp-logo-text">AccuJuris</span>
                    </div>

                    <div className="lp-nav-links">
                        <a href="#problem">Problem</a>
                        <a href="#solution">Solution</a>
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>

                    <div className="lp-nav-actions">
                        <Link to="/login" className="lp-btn lp-btn-sm lp-btn-outline" style={{ display: 'none' }}>
                            Login
                        </Link>
                        <Link to="/login" className="lp-btn lp-btn-sm lp-btn-accent">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="lp-hero py-20 md:py-32">
                <div className="lp-hero-pattern"></div>
                <div className="lp-container">
                    <div className="lp-hero-content">
                        <h1 className="lp-hero-title">
                            Accountability Assured Legal Translation for India
                        </h1>
                        <p className="lp-hero-subtitle">
                            Bridging the linguistic divide in the Indian justice system with forensic linguistics and AI-powered precision. Ensuring every legal document is translated with accountability, accuracy, and cultural sensitivity.
                        </p>

                        <div className="lp-hero-actions">
                            <Link to="/login" className="lp-btn lp-btn-lg lp-btn-accent">
                                Login <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                            </Link>
                            <a href="#contact" className="lp-btn lp-btn-lg lp-btn-outline-inverse">
                                Request Access
                            </a>
                        </div>

                        <div className="lp-hero-trust">
                            <p>Trusted by legal professionals across India</p>
                            <div className="lp-hero-trust-flex">
                                <div>🏛️ Law Firms</div>
                                <div>⚖️ Advocates</div>
                                <div>📋 Government</div>
                                <div>🔬 Researchers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section id="problem" className="lp-problem py-20 md:py-32">
                <div className="lp-container">
                    <div className="lp-section-header">
                        <h2 className="lp-section-title">The Multilingual Legal Challenge</h2>
                        <p className="lp-section-subtitle">
                            India's legal system operates across multiple languages, creating a complex landscape where precision and cultural sensitivity are paramount. Yet, current translation approaches fail to meet the demands of legal accountability.
                        </p>
                    </div>

                    <div className="lp-grid-3">
                        <div className="lp-card">
                            <div className="lp-card-icon">
                                <Globe size={24} />
                            </div>
                            <h3 className="lp-card-title">Linguistic Complexity</h3>
                            <p className="lp-card-text">
                                22 official languages in India. Complex sentence structure of legal language makes legal translation challenging. Generic AI tools fail to capture legal nuance across these languages.
                            </p>
                        </div>

                        <div className="lp-card">
                            <div className="lp-card-icon">
                                <Zap size={24} />
                            </div>
                            <h3 className="lp-card-title">Accuracy Risks</h3>
                            <p className="lp-card-text">
                                Inaccurate translations lead to misinterpretation, delayed justice, and legal liability. Manual processes are slow and prone to human error.
                            </p>
                        </div>

                        <div className="lp-card">
                            <div className="lp-card-icon">
                                <Lock size={24} />
                            </div>
                            <h3 className="lp-card-title">Accountability Gap</h3>
                            <p className="lp-card-text">
                                Existing translation tools fail to provide assurance in translation accuracy. Users cannot verify why a translation was made or trust its legal validity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section id="solution" className="lp-solution py-20 md:py-32">
                <div className="lp-container lp-grid-2">
                    <div>
                        <h2 className="lp-section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Meet InLinguo</h2>
                        <p className="lp-section-subtitle mb-6" style={{ textAlign: 'left' }}>
                            AccuJuris's flagship AI-powered legal translation software, trained exclusively on Indian legal corpora including statutes, judgments, and formal legal documents.
                        </p>

                        <div className="lp-check-list">
                            <div className="lp-check-item">
                                <CheckCircle size={24} className="lp-check-item-icon" />
                                <div>
                                    <h4 className="lp-check-item-title">Legal-Domain Specific</h4>
                                    <p className="lp-check-item-text">Trained on Indian legal documents, not generic text.</p>
                                </div>
                            </div>

                            <div className="lp-check-item">
                                <CheckCircle size={24} className="lp-check-item-icon" />
                                <div>
                                    <h4 className="lp-check-item-title">Terminology Consistency</h4>
                                    <p className="lp-check-item-text">Maintains legal terminology across all documents.</p>
                                </div>
                            </div>

                            <div className="lp-check-item">
                                <CheckCircle size={24} className="lp-check-item-icon" />
                                <div>
                                    <h4 className="lp-check-item-title">Explainable Outputs</h4>
                                    <p className="lp-check-item-text">Forensic linguistics backing for every translation decision.</p>
                                </div>
                            </div>

                            <div className="lp-check-item">
                                <CheckCircle size={24} className="lp-check-item-icon" />
                                <div>
                                    <h4 className="lp-check-item-title">Strict Data Privacy</h4>
                                    <p className="lp-check-item-text">GDPR-aligned, SOC2 compliant data handling.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/login" className="lp-btn lp-btn-lg lp-btn-accent">
                            Explore InLinguo <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                    </div>

                    <div className="lp-visual-box">
                        <div className="lp-visual-inner">
                            <div>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                                <p className="lp-visual-text">
                                    Input → AI Processing → Legal Expert Review → Linguistic Expert Review → Verified Output
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="features" className="py-20 md:py-32" style={{ backgroundColor: 'var(--lp-bg)' }}>
                <div className="lp-container">
                    <h2 className="lp-section-title text-center mb-16">The AccuJuris Workflow</h2>

                    <div className="lp-workflow-grid">
                        {[
                            { step: "1", title: "Upload", description: "Submit legal documents (judgments, petitions, statutes)" },
                            { step: "2", title: "AI Processing", description: "InLinguo engine translates using legal-specific models" },
                            { step: "3", title: "Legal Expert Review", description: "Expert advocates verify legal accuracy and compliance" },
                            { step: "4", title: "Linguistic Expert Review", description: "Forensic linguists verify translation precision and variation" },
                            { step: "5", title: "Verified Output", description: "Accountable and accurate legally translated documents" },
                        ].map((item, idx) => (
                            <div key={idx} className="lp-step">
                                <div className="lp-step-card">
                                    <div className="lp-step-circle">{item.step}</div>
                                    <h3 className="lp-step-title">{item.title}</h3>
                                    <p className="lp-step-text">{item.description}</p>
                                </div>
                                {idx < 4 && (
                                    <div className="lp-step-arrow">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Target Users Section */}
            <section className="lp-users py-20 md:py-32">
                <div className="lp-container">
                    <h2 className="lp-section-title text-center mb-16">Who We Serve</h2>

                    <div className="lp-grid-3">
                        {[
                            { icon: "⚖️", title: "Advocates", desc: "Speed up case preparation across languages" },
                            { icon: "👥", title: "Civilians", desc: "Understand legal proceedings in native tongue" },
                            { icon: "📝", title: "Legal Translators", desc: "Enhance productivity with AI-assisted tools" },
                            { icon: "🏢", title: "Law Firms", desc: "Standardize translation quality across departments" },
                            { icon: "🏛️", title: "Government", desc: "Ensure accurate dissemination of laws" },
                            { icon: "🔬", title: "Researchers", desc: "Access Indian legal history across languages" },
                        ].map((user, idx) => (
                            <div key={idx} className="lp-user-card">
                                <div className="lp-user-icon">{user.icon}</div>
                                <h3 className="lp-card-title">{user.title}</h3>
                                <p className="lp-card-text">{user.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--lp-bg)' }}>
                <div className="lp-container">
                    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                        <h2 className="lp-section-title text-center mb-8">Built on Trust & Technology</h2>

                        <div className="lp-grid-2" style={{ gap: '3rem' }}>
                            <div>
                                <h3 className="lp-card-title">Technology Foundation</h3>
                                <p className="lp-card-text">
                                    Built on state-of-the-art NLP models fine-tuned specifically for the Indian legal context. Our infrastructure ensures reliability, scalability, and performance.
                                </p>
                            </div>

                            <div>
                                <h3 className="lp-card-title">Corpus Training</h3>
                                <p className="lp-card-text">
                                    Exclusive access to diverse Indian legal datasets including statutes, judgments, and formal legal documents across multiple languages.
                                </p>
                            </div>

                            <div>
                                <h3 className="lp-card-title">Forensic Linguistics</h3>
                                <p className="lp-card-text">
                                    Every translation is backed by forensic linguistics principles, ensuring accountability and legal validity at every step.
                                </p>
                            </div>

                            <div>
                                <h3 className="lp-card-title">Compliance & Security</h3>
                                <p className="lp-card-text">
                                    GDPR-aligned, SOC2 compliant data handling. Your sensitive legal documents are protected with enterprise-grade security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="lp-about py-20 md:py-32">
                <div className="lp-container">
                    <div className="lp-section-header" style={{ marginBottom: '2rem' }}>
                        <h2 className="lp-section-title">About AccuJuris</h2>
                    </div>

                    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                        <div className="lp-about-card">
                            <h3 className="lp-about-title">Our Vision</h3>
                            <p className="lp-about-text">
                                Access to justice for every Indian, regardless of language. We believe that linguistic barriers should never impede access to the legal system.
                            </p>
                        </div>

                        <div className="lp-about-card">
                            <h3 className="lp-about-title">Our Mission</h3>
                            <p className="lp-about-text">
                                To provide the gold standard in legal translation through forensic linguistics, ensuring accountability, accuracy, and accessibility.
                            </p>
                        </div>

                        <div className="lp-about-card text-center">
                            <h3 className="lp-about-title mb-8">Leadership</h3>
                            <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="lp-avatar">G</div>
                                    <h4 style={{ fontSize: '1.25rem', color: 'var(--lp-primary)', marginBottom: '0.5rem' }}>Gouri V B</h4>
                                    <p style={{ color: 'var(--lp-text-muted)', marginBottom: '0.5rem' }}>Founder & CEO</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', maxWidth: '16rem' }}>
                                        Leading AccuJuris's mission to revolutionize legal translation in India through forensic linguistics and AI.
                                    </p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="lp-avatar">A</div>
                                    <h4 style={{ fontSize: '1.25rem', color: 'var(--lp-primary)', marginBottom: '0.5rem' }}>Arnav Jagadeesh</h4>
                                    <p style={{ color: 'var(--lp-text-muted)', marginBottom: '0.5rem' }}>CTO</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', maxWidth: '16rem' }}>
                                        Architecting AccuJuris's technology platform, driving AI innovation and scalable infrastructure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="lp-cta py-20 md:py-32">
                <div className="lp-container">
                    <h2 className="lp-cta-title">Ready to Transform Legal Translation?</h2>
                    <p className="lp-cta-text">
                        Join advocates, law firms, and government departments who trust AccuJuris for accurate, accountable legal translation.
                    </p>

                    <div className="lp-hero-actions" style={{ justifyContent: 'center' }}>
                        <Link to="/login" className="lp-btn lp-btn-lg lp-btn-accent">
                            Login <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
                        </Link>
                        <a href="#contact" className="lp-btn lp-btn-lg lp-btn-outline-inverse">
                            Request Access
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 md:py-32" style={{ backgroundColor: 'var(--lp-bg)' }}>
                <div className="lp-container text-center">
                    <h2 className="lp-section-title mb-8">Get in Touch</h2>

                    <div className="lp-card" style={{ maxWidth: '42rem', margin: '0 auto' }}>
                        <p className="lp-card-text mb-6 text-center">
                            Have questions? We'd love to hear from you. Reach out to our team.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', marginBottom: '0.25rem' }}>Email</p>
                                <a href="mailto:ceoaccujuris@gmail.com" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--lp-accent-hover)' }}>
                                    ceoaccujuris@gmail.com
                                </a>
                            </div>

                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--lp-text-muted)', marginBottom: '0.25rem' }}>LinkedIn</p>
                                <a href="https://www.linkedin.com/in/gourivb" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--lp-accent-hover)' }}>
                                    Connect with us on LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp-footer">
                <div className="lp-container">
                    <div className="lp-footer-grid">
                        <div>
                            <div className="lp-logo mb-4">
                                <div className="lp-logo-icon" style={{ backgroundColor: 'var(--lp-accent)', color: 'var(--lp-primary)' }}>A</div>
                                <span className="lp-logo-text" style={{ color: 'white' }}>AccuJuris</span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                                Forensic linguistics-driven legal translation for India.
                            </p>
                        </div>

                        <div>
                            <h4 className="lp-footer-title">Product</h4>
                            <ul className="lp-footer-links">
                                <li><a href="#solution">InLinguo</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="lp-footer-title">Company</h4>
                            <ul className="lp-footer-links">
                                <li><a href="#about">About</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="lp-footer-title">Legal</h4>
                            <ul className="lp-footer-links">
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="lp-footer-bottom">
                        <p>© {new Date().getFullYear()} AccuJuris. All rights reserved. Accountability Assured Legal Translation.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
