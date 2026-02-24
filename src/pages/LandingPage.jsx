import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, ArrowRight, User, Globe, FileText, Lock, Users } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{ backgroundColor: 'var(--background-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-family)' }}>

            {/* Navigation (Sticky Header) */}
            <nav style={{
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                borderBottom: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.75rem', color: 'var(--primary-color)' }}>
                    <div style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900
                    }}>
                        A
                    </div>
                    <span>AccuJuris</span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', fontWeight: 500, color: 'var(--text-color)' }} className="nav-links">
                    <a href="#problem" style={{ transition: 'color 0.2s', ':hover': { color: 'var(--primary-color)' } }}>Problem</a>
                    <a href="#solution" style={{ transition: 'color 0.2s' }}>Solution</a>
                    <a href="#features" style={{ transition: 'color 0.2s' }}>Features</a>
                    <a href="#about" style={{ transition: 'color 0.2s' }}>About</a>
                    <a href="#contact" style={{ transition: 'color 0.2s' }}>Contact</a>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" className="btn btn-accent" style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                        Login
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{
                padding: '8rem 2rem',
                background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ display: 'flex', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '4rem', lineHeight: 1.1, fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.5rem', letterSpacing: '-0.02em', fontFamily: 'Poppins, sans-serif' }}>
                            Accountability Assured Legal Translation
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                            India's first AI-powered platform tailored specifically for precise legal translation and forensic linguistics, empowering firms to confidently manage and verify multilingual case files.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-accent" style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                                Login
                            </Link>
                            <a href="#features" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        {/* Abstract visual representation matching reference */}
                        <div style={{
                            width: '100%',
                            height: '500px',
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '2rem',
                            position: 'relative'
                        }}>
                            <div style={{ width: '80%', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '10px', marginBottom: '2rem' }}></div>
                            <div style={{ width: '100%', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem' }}></div>
                            <div style={{ width: '90%', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem' }}></div>
                            <div style={{ width: '95%', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '1rem' }}></div>
                            <div style={{ width: '85%', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '2rem' }}></div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '120px', height: '120px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={48} color="var(--primary-color)" opacity={0.5} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                                    <div style={{ width: '100%', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '10px' }}></div>
                                    <div style={{ width: '70%', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '10px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem & Solution Sections */}
            <section id="problem" style={{ padding: '6rem 2rem', backgroundColor: 'white' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>The Language Barrier in Law</h2>
                    <p style={{ fontSize: '1.125rem', color: '#64748b', lineHeight: 1.7, marginBottom: '3rem' }}>
                        In India's diverse linguistic landscape, accurate legal translation isn't just a convenience—it's a necessity for justice. Ambiguities or errors in converting vernacular documents into English can alter the course of a trial.
                    </p>
                </div>
            </section>

            <section id="solution" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-color)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '3rem',
                            borderRadius: '1.5rem',
                            boxShadow: 'var(--shadow)'
                        }}>
                            <Globe size={48} color="var(--accent-color)" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-color)' }}>Our Solution</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                We combine cutting-edge OCR technology with neural machine translation, specifically tuned for legal lexicons. Crucially, every translation is verified by our network of forensic linguists, ensuring 100% accountability.
                            </p>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.5rem', fontFamily: 'Poppins, sans-serif' }}>Precision Meets Accountability</h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <CheckCircle size={24} color="var(--success-color)" style={{ marginTop: '0.25rem' }} />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Forensic Linguistic Analysis</strong>
                                        <span style={{ color: '#64748b' }}>Deep contextual understanding of legal terminology across vernaculars.</span>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <CheckCircle size={24} color="var(--success-color)" style={{ marginTop: '0.25rem' }} />
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Human-in-the-loop Verification</strong>
                                        <span style={{ color: '#64748b' }}>Expert linguists review and validate AI outputs for guaranteed accuracy.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '6rem 2rem', backgroundColor: 'white' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}>Platform Features</h2>
                        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Designed for legal professionals and translation experts.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Feature 1 */}
                        <div className="card" style={{ padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: 'none', transition: 'box-shadow 0.3s', borderRadius: '1rem' }}>
                            <div style={{ width: '56px', height: '56px', backgroundColor: '#eff6ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                                <FileText size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Document Management</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Securely upload, organize, and track the translation status of case files in a centralized, role-based dashboard.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card" style={{ padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: 'none', transition: 'box-shadow 0.3s', borderRadius: '1rem' }}>
                            <div style={{ width: '56px', height: '56px', backgroundColor: '#fffbeb', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
                                <Globe size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Indic Language Support</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Specialized OCR and translation models optimized for complex regional scripts, starting with comprehensive Malayalam support.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card" style={{ padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: 'none', transition: 'box-shadow 0.3s', borderRadius: '1rem' }}>
                            <div style={{ width: '56px', height: '56px', backgroundColor: '#f0fdf4', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success-color)' }}>
                                <Shield size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Verifiable Accuracy</h3>
                            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                                Confidence scores and detailed linguist review history are attached to every document, ensuring admissibility and trust.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" style={{ padding: '6rem 2rem', backgroundColor: 'var(--surface-color)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '4rem', fontFamily: 'Poppins, sans-serif' }}>About AccuJuris</h2>

                    {/* Mission & Vision Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Globe size={24} color="var(--primary-color)" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>Our Vision</h3>
                            </div>
                            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem' }}>
                                To break down language barriers in the Indian judicial system, ensuring that justice is never delayed or denied due to linguistic misunderstandings, and creating a seamless, transparent bridge between vernacular records and court proceedings.
                            </p>
                        </div>

                        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ backgroundColor: '#fffbeb', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <CheckCircle size={24} color="var(--accent-color)" />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>Our Mission</h3>
                            </div>
                            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1.05rem' }}>
                                By combining advanced AI translation technologies with rigorous forensic linguistic verification, we aim to provide law firms, courts, and individuals with the most accurate, reliable, and legally accountable document translations available.
                            </p>
                        </div>
                    </div>

                    {/* Leadership */}
                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '2rem' }}>Leadership</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                marginBottom: '1.5rem'
                            }}>
                                G
                            </div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-color)' }}>Gouri V B</h4>
                            <p style={{ color: 'var(--accent-color)', fontWeight: 600, margin: '0 0 1.5rem 0' }}>Founder & CEO</p>
                            <p style={{ color: '#64748b', lineHeight: 1.7, maxWidth: '600px' }}>
                                A passionate forensic linguist and legal tech innovator, Gouri recognized the critical gap in accurate vernacular-to-English translations in Indian courts. She leads AccuJuris with a commitment to linguistic precision and accountability.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: 'var(--primary-color)', color: '#cbd5e1', padding: '4rem 2rem 2rem' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, ':hover': { textDecoration: 'underline' } }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, ':hover': { textDecoration: 'underline' } }}>Terms of Service</a>
                        <a href="#" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, ':hover': { textDecoration: 'underline' } }}>Contact</a>
                    </div>

                    <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '2rem' }}></div>

                    <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                        &copy; {new Date().getFullYear()} AccuJuris. All rights reserved. Accountability Assured Legal Translation.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
