"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Moon, Sun, Check, MapPin, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// =========================================
// CUSTOM BRAND ICONS 
// =========================================
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg>
);
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 448 512"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"></path></svg>
);

// =========================================
// SMART BIO & ABOUT TYPEWRITERS 
// =========================================
const BioTypewriter = ({ words }: { words: string[] }) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typeSpeed = 700 / currentWord.length; 
    const deleteSpeed = 400 / currentWord.length; 
    const pauseTime = 3000;

    let timer: NodeJS.Timeout;
    if (isDeleting) {
      setShowCursor(true);
      if (text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => setText(currentWord.substring(0, text.length - 1)), deleteSpeed);
      }
    } else {
      if (text === currentWord) {
        setShowCursor(false); 
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        setShowCursor(true);
        timer = setTimeout(() => setText(currentWord.substring(0, text.length + 1)), typeSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className="font-normal text-slate-900 dark:text-white transition-colors duration-500">
      {text}
      <span className={`inline-block w-[2px] h-[1em] bg-slate-900 dark:bg-white align-middle ml-[2px] -mt-1 transition-opacity duration-300 ${showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
    </span>
  );
};

const AboutTypewriter = ({ sentences }: { sentences: string[] }) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const current = sentences[index];
    const typeSpeed = 1500 / current.length;
    const deleteSpeed = 800 / current.length;
    const pauseTime = 10000; 

    let timer: NodeJS.Timeout;
    if (isDeleting) {
      setShowCursor(true);
      if (text === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % sentences.length);
      } else {
        timer = setTimeout(() => setText(current.substring(0, text.length - 1)), deleteSpeed);
      }
    } else {
      if (text === current) {
        setShowCursor(false);
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        setShowCursor(true);
        timer = setTimeout(() => setText(current.substring(0, text.length + 1)), typeSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, sentences]);

  return (
    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:whitespace-nowrap overflow-hidden text-ellipsis">
      {text}
      <span className={`inline-block w-[3px] h-[1em] bg-slate-900 dark:bg-white align-middle ml-1 transition-opacity duration-300 ${showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
    </h2>
  );
};

// =========================================
// ORGANIC FRACTAL LIQUID SHADER
// =========================================
const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const fragmentShader = `varying vec2 vUv; uniform float u_time; uniform vec3 u_color1; uniform vec3 u_color2; uniform vec3 u_color3; void main() { vec2 p = vUv * 3.0; float t = u_time * 0.1; for(float i = 1.0; i < 5.0; i++) { p.x += 0.4 / i * cos(i * 2.5 * p.y + t); p.y += 0.4 / i * cos(i * 1.5 * p.x + t); } float f = cos(p.x + p.y + t); float g = sin(p.x + p.y + t); vec3 col = mix(u_color1, u_color2, smoothstep(-1.0, 1.0, f)); col = mix(col, u_color3, smoothstep(-1.0, 1.0, g)); gl_FragColor = vec4(col, 1.0); }`;

function LiquidBackground({ isDark }: { isDark: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const darkColors = { c1: new THREE.Color("#050505"), c2: new THREE.Color("#0f172a"), c3: new THREE.Color("#082f49") };
    const lightColors = { c1: new THREE.Color("#ffffff"), c2: new THREE.Color("#f0f9ff"), c3: new THREE.Color("#eef2ff") };

    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: { u_time: { value: 0.0 }, u_color1: { value: isDark ? darkColors.c1 : lightColors.c1 }, u_color2: { value: isDark ? darkColors.c2 : lightColors.c2 }, u_color3: { value: isDark ? darkColors.c3 : lightColors.c3 } },
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      material.uniforms.u_time.value = clock.getElapsedTime();
      const t = isDark ? darkColors : lightColors;
      material.uniforms.u_color1.value.lerp(t.c1, 0.05); 
      material.uniforms.u_color2.value.lerp(t.c2, 0.05);
      material.uniforms.u_color3.value.lerp(t.c3, 0.05);
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => { window.removeEventListener("resize", handleResize); cancelAnimationFrame(animationId); if (mountRef.current) mountRef.current.removeChild(renderer.domElement); renderer.dispose(); };
  }, [isDark]);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

// =========================================
// MAIN PORTFOLIO COMPONENT
// =========================================
export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState("Hero");
  const [activeProjectTab, setActiveProjectTab] = useState("DEFCOM");
  const [contactIntent, setContactIntent] = useState("Hire Me");
  
  const [emailInput, setEmailInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [formState, setFormState] = useState<"idle" | "error" | "success">("idle");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const navItems = ["About", "Experience", "Projects", "Skills", "Contact"];

  const navigationFlow = [
    { section: "Hero", subTab: null },
    { section: "About", subTab: null },
    { section: "Experience", subTab: "DEFCOM" },
    { section: "Experience", subTab: "HubEye" },
    { section: "Projects", subTab: null },
    { section: "Skills", subTab: null },
    { section: "Contact", subTab: null },
  ];

  const handleScrollTo = useCallback((id: string, subTab: string | null = null) => {
    const element = document.getElementById(id);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(id);
      if (subTab) setActiveProjectTab(subTab);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        
        const currentIndex = navigationFlow.findIndex(
          (step) => step.section === activeTab && (step.subTab === null || step.subTab === activeProjectTab)
        );
        
        const fallbackIndex = currentIndex === -1 ? 0 : currentIndex;
        
        let nextIndex = fallbackIndex;
        if (e.key === "ArrowRight") {
          nextIndex = (fallbackIndex + 1) % navigationFlow.length;
        } else if (e.key === "ArrowLeft") {
          nextIndex = (fallbackIndex - 1 + navigationFlow.length) % navigationFlow.length;
        }

        const nextStep = navigationFlow[nextIndex];
        handleScrollTo(nextStep.section, nextStep.subTab);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, activeProjectTab, handleScrollTo, navigationFlow]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { threshold: 0.2 } // Reduced threshold for better mobile detection
    );
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailInput || !emailRegex.test(emailInput)) {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 2500);
      return;
    }

    try {
      await fetch("https://formspree.io/f/mnjednrq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Portfolio Lead: ${contactIntent}`,
          email: emailInput,
          message: messageInput,
        }),
      });
      setFormState("success");
    } catch (error) {
      setFormState("error");
    }

    setTimeout(() => {
      setFormState("idle");
      setEmailInput("");
      setMessageInput("");
    }, 3000);
  };

  const skillsScattered = [
    { name: "Python", src: "python.svg", top: "18%", left: "38%" },
    { name: "AWS", src: "aws.svg", top: "18%", left: "62%" },
    { name: "PostgreSQL", src: "postgresql.svg", top: "34%", left: "26%" },
    { name: "Figma", src: "figma.svg", top: "34%", left: "50%" },
    { name: "GitHub", src: "github.svg", top: "34%", left: "74%" },
    { name: "Google Analytics", src: "google-analytics.svg", top: "50%", left: "14%" },
    { name: "Azure", src: "azure-azure-devops.svg", top: "50%", left: "38%" },
    { name: "Lovable", src: "lovable.svg", top: "50%", left: "62%" },
    { name: "Excel", src: "microsoft-excel.svg", top: "50%", left: "86%" },
    { name: "Postman", src: "postman.svg", top: "66%", left: "26%" },
    { name: "Colab", src: "colab-google.svg", top: "66%", left: "50%" },
    { name: "Git", src: "git.svg", top: "66%", left: "74%" },
    { name: "Gemini", src: "gemini.svg", top: "82%", left: "38%" },
    { name: "Codespaces", src: "githubcodespaces.svg", top: "82%", left: "62%" },
  ];

  return (
    <div className="relative h-[100dvh] w-full bg-[#f9f9f9] dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      
      <LiquidBackground isDark={isDark} />

      {/* =========================================
          TOP FLOATING NAVIGATION 
          ========================================= */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl flex justify-between items-center px-4 py-3 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-500">
        <button onClick={() => handleScrollTo("Hero")} className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-transparent flex-shrink-0 bg-slate-100 dark:bg-slate-800 transition-colors duration-500">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/e2e8f0/64748b?text=AB"; }} />
        </button>
        
        <div className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <button 
              key={item} 
              onClick={() => handleScrollTo(item)}
              className={`text-xs lg:text-sm transition-all duration-300 ${
                activeTab === item 
                  ? "text-slate-900 dark:text-white font-semibold scale-[1.05]" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-light"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button onClick={() => setIsDark(!isDark)} className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors duration-500 flex-shrink-0">
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div key="moon" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.15 }} className="absolute">
                <Moon className="w-4 h-4 text-slate-200" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.15 }} className="absolute">
                <Sun className="w-4 h-4 text-slate-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* =========================================
          DYNAMIC HEIGHT SNAP SCROLLING CONTAINER
          ========================================= */}
      <div ref={scrollContainerRef} className="h-[100dvh] w-full overflow-y-auto snap-y snap-proximity md:snap-mandatory scroll-smooth relative z-10">
        
        {/* =========================================
            1. HERO SECTION 
            ========================================= */}
        <section id="Hero" className="snap-start w-full min-h-[100dvh] flex items-center justify-center pt-28 pb-12">
          <div className="max-w-5xl w-[95%] mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            <div className="flex-1 space-y-4 w-full text-center lg:text-left">
              <p className="text-base md:text-lg font-light text-slate-600 dark:text-slate-400 transition-colors duration-500">
                Hey. I'm Arnav Bhomia, an incoming
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-slate-900 dark:text-white flex flex-col justify-center lg:justify-between transition-colors duration-500">
                <span className="text-transparent [-webkit-text-stroke:1px_#0f172a] dark:[-webkit-text-stroke:1px_#ffffff] lg:[-webkit-text-stroke:1.5px_#0f172a] lg:dark:[-webkit-text-stroke:1.5px_#ffffff] transition-colors duration-500">Associate</span>
                <span className="block mt-1">Product</span>
                <span className="block">Manager</span>
              </h1>
              <p className="text-base md:text-lg font-light text-slate-600 dark:text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed pt-4 min-h-[4rem] md:min-h-[5rem] transition-colors duration-500">
                Shipping products from 0 to 1. Bridging the gap between complex engineering and <BioTypewriter words={["user experience.", "data-driven insights.", "AI architectures.", "business strategy."]} />
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 mb-6 md:mb-8 cursor-pointer group">
                <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-white/10 shadow-2xl bg-[#ababab] transition-colors duration-500" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[120%] z-20 [clip-path:inset(0_0_50%_0)] overflow-visible">
                  <img src="/profile-transparent.png" alt="Arnav Bhomia" className="w-full h-full object-cover object-bottom origin-bottom transition-transform duration-300 group-hover:scale-[1.02]" onError={(e) => { (e.target as HTMLImageElement).src = "/profile.jpg"; (e.target as HTMLImageElement).className="w-full h-full object-cover rounded-full" }}/>
                </div>
                <div className="absolute inset-0 rounded-full overflow-hidden z-10">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[120%]">
                    <img src="/profile-transparent.png" alt="Arnav Bhomia" className="w-full h-full object-cover object-bottom origin-bottom transition-transform duration-300 group-hover:scale-[1.02]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}/>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center lg:justify-end gap-3 md:gap-4 w-full lg:w-72">
                <a href="/Arnav_Bhomia_APM_Resume.pdf" target="_blank" className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs md:text-sm shadow-lg group transition-colors duration-500">
                  <span className="group-hover:scale-105 transition-transform duration-300 ease-out inline-block">Resume</span>
                </a>
                <a href="https://linkedin.com/in/arnavbhomia" target="_blank" className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-slate-400 text-slate-700 dark:text-slate-300 group transition-colors duration-500">
                  <LinkedInIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-105 transition-transform duration-300" />
                </a>
                <a href="https://github.com/arnavbhomia" target="_blank" className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-slate-400 text-slate-700 dark:text-slate-300 group transition-colors duration-500">
                  <GitHubIcon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-105 transition-transform duration-300" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            2. ABOUT SECTION 
            ========================================= */}
        <section id="About" className="snap-start w-full min-h-[100dvh] flex flex-col justify-center pt-28 pb-12">
          <div className="max-w-5xl w-[95%] mx-auto px-4 flex flex-col gap-8 md:gap-10">
            
            <div className="w-full">
              <AboutTypewriter sentences={[
                "Engineering taught me how to cross the river.",
                "Product told me where people need a bridge."
              ]} />
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              <div className="space-y-4 md:space-y-6 w-full mt-0 md:mt-2">
                <p className="text-sm md:text-base font-light text-slate-700 dark:text-slate-400 leading-relaxed transition-colors duration-500">
                  I am an analytical thinker who thrives at the intersection of quantitative data and human-centric design. Starting in Electrical & Electronics Engineering, I learned how to architect complex, high-stakes systems from the ground up. 
                </p>
                <p className="text-sm md:text-base font-light text-slate-700 dark:text-slate-400 leading-relaxed transition-colors duration-500">
                  Today, I apply that same rigorous logic to Product Management—transforming raw data into intuitive tools that solve real business bottlenecks. I don't just crunch numbers; I leverage them to dictate product strategy.
                </p>
              </div>

              <div className="space-y-6 w-full">
                
                {/* Education Card */}
                <div className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden flex flex-col gap-1 transition-colors duration-500">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-500 mb-2 transition-colors duration-500">Education</h3>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="space-y-1">
                      <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white transition-colors duration-500">Manipal Institute of Technology</h4>
                      <p className="text-xs md:text-sm font-light text-slate-700 dark:text-slate-300 transition-colors duration-500">B.Tech in Electrical & Electronics Engineering</p>
                      <p className="text-[11px] md:text-xs font-light text-slate-500 dark:text-slate-400 transition-colors duration-500">Minor in Python Programming</p>
                    </div>
                    {/* Minimalist Floating Cap */}
                    <div className="w-10 h-10 md:w-12 md:h-12 text-slate-400 dark:text-white/20 flex-shrink-0 -mt-2 animate-[bounce_4s_infinite] transition-colors duration-500">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-4 border-t border-slate-200 dark:border-white/10 transition-colors duration-500">
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors duration-500">
                      <MapPin className="w-3.5 h-3.5" /> Udupi, India
                    </div>
                    <div className="text-[11px] md:text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors duration-500">
                      2022 – 2026
                    </div>
                  </div>
                </div>

                {/* Certifications Card */}
                <div className="p-6 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-xl space-y-4 transition-colors duration-500">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-500 transition-colors duration-500">Certifications</h3>
                  <div className="space-y-4 pt-1">
                    <div className="flex items-center gap-4 font-light text-xs md:text-sm text-slate-700 dark:text-slate-300 group transition-colors duration-500">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <img src="/besa.svg" alt="BeSA" className="w-4 h-4 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      </div>
                      <span>Become a Solutions Architect (BeSA) Certificate</span>
                    </div>
                    <div className="flex items-center gap-4 font-light text-xs md:text-sm text-slate-700 dark:text-slate-300 group transition-colors duration-500">
                      <img src="/google.svg" alt="Google" className="w-6 h-6 object-contain shrink-0 transition-transform duration-300 group-hover:scale-110" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      <span>Google Data Analytics Professional Certificate</span>
                    </div>
                    <div className="flex items-center gap-4 font-light text-xs md:text-sm text-slate-700 dark:text-slate-300 group transition-colors duration-500">
                      <img src="/hackerrank.svg" alt="HackerRank" className="w-6 h-6 object-contain shrink-0 transition-transform duration-300 group-hover:scale-110" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      <span>HackerRank SQL (Advanced) Certificate</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            3. EXPERIENCE SECTION 
            ========================================= */}
        <section id="Experience" className="snap-start w-full min-h-[100dvh] flex items-center justify-center pt-28 pb-12">
          <div className="max-w-5xl w-[95%] mx-auto px-4">
            
            <div className="w-full rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 md:p-10 relative overflow-hidden transition-colors duration-500">
              
              {/* Header Box (Logo left, Data right) */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 dark:border-white/5 pb-6 gap-4 transition-colors duration-500">
                <div className="flex flex-col items-start gap-1">
                  <img src="/delhivery.svg" alt="Delhivery Logo" className="h-6 md:h-10 object-contain filter brightness-0 dark:invert transition-all duration-500" onError={(e) => { (e.currentTarget.style.display = 'none'); }} />
                  <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-500">Product Management Intern | MidMile</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-500">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> Gurgaon, India
                  </div>
                  <div className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-500">
                    February 2026 - August 2026
                  </div>
                </div>
              </div>

              {/* Segmented Controller Tabs */}
              <div className="flex flex-col sm:flex-row gap-2 bg-slate-100/70 dark:bg-white/5 p-1 rounded-xl w-full max-w-2xl mx-auto my-6 md:my-8 border border-slate-200/40 dark:border-transparent transition-colors duration-500">
                {["DEFCOM", "HubEye"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveProjectTab(tab)}
                    className={`flex-1 text-[10px] md:text-sm py-2 md:py-2.5 rounded-lg font-medium transition-all ${
                      activeProjectTab === tab
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {tab === "DEFCOM" ? "Defcom - Enterprise B2B Expense Management Platform" : "HubEye - MidMile Logistics and Operations Dashboard"}
                  </button>
                ))}
              </div>

              {/* Deep-Dive Case Study Content */}
              <div className="min-h-[16rem] relative">
                <AnimatePresence mode="wait">
                  {activeProjectTab === "DEFCOM" ? (
                    <motion.div key="defcom" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-3 gap-6 md:gap-8">
                      <div className="md:col-span-2 space-y-4 md:space-y-5">
                        <div className="space-y-2">
                          <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">The Challenge</span>
                          <p className="text-xs md:text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                            A legacy 11-year-old enterprise platform was bottlenecking B2B workflows across 4,000+ facilities, leading to processing delays and financial leakage in Dispatch Centers that represented 72% of total platform billing value.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">The Execution</span>
                          <p className="text-xs md:text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                            Led the end-to-end architecture rebuild and designed a real-time compliance engine with dynamic budget caps. Collaborated with engineering to integrate an AI-powered OCR API, architecting a 5-layer automated duplicacy checking pipeline that transformed a 24-step manual flow into 3 clicks.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-4">
                        <div className="p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-transparent flex flex-col justify-center items-center text-center">
                          <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹3.6 Cr</span>
                          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Projected Annual Savings</span>
                        </div>
                        <div className="p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-transparent flex flex-col justify-center items-center text-center">
                          <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">0 Days</span>
                          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Approval TAT (Down from 7.2d)</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-transparent flex flex-col justify-center items-center text-center">
                          <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">87.5%</span>
                          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Reduction in User Friction</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="hubeye" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-3 gap-6 md:gap-8">
                      <div className="md:col-span-2 space-y-4 md:space-y-5">
                        <div className="space-y-2">
                          <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">The Challenge</span>
                          <p className="text-xs md:text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                            Fragmented operational tabs and legacy interfaces were limiting real-time facility monitoring, making it difficult for operations managers to enforce SLAs and diagnose supply chain bottlenecks proactively.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">The Execution</span>
                          <p className="text-xs md:text-sm font-light text-slate-700 dark:text-slate-300 leading-relaxed">
                            Led the transition to an agentic AI platform, consolidating interfaces into a dynamic spatial workspace. Prototyped HubEye Intelligence—an AI copilot to autonomously trace flow breaks—and designed interactive digital twins for macro-to-micro facility drill downs.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-4">
                        <div className="p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-transparent flex flex-col justify-center items-center text-center">
                          <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">4 to 1</span>
                          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Platform Consolidation</span>
                        </div>
                        <div className="p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-transparent flex flex-col justify-center items-center text-center">
                          <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">GA4/Clarity</span>
                          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Drop-Off Optimization</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 p-3 md:p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-transparent flex flex-col justify-center items-center text-center">
                          <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Root Cause</span>
                          <span className="text-[10px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Autonomous Diagnostics</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            4. PROJECTS SECTION 
            ========================================= */}
        <section id="Projects" className="snap-start w-full min-h-[100dvh] flex items-center justify-center pt-28 pb-12">
          <div className="max-w-5xl w-[95%] mx-auto px-4 flex flex-col justify-center h-full">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(220px,_auto)] md:auto-rows-[minmax(240px,_auto)]">
              
              {/* Zomato Card */}
              <a href="https://github.com/ArnavBhomia/zomato_data_analysis" target="_blank" rel="noopener noreferrer" className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-lg flex flex-col justify-between relative overflow-hidden group transition-all duration-300 min-h-[220px] md:min-h-[260px]">
                {/* GitHub Pill */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 h-8 md:h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-start px-2.5 md:px-3 w-8 md:w-10 group-hover:w-[110px] md:group-hover:w-[130px] transition-all duration-300 overflow-hidden shadow-sm z-30">
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold text-slate-800 dark:text-white whitespace-nowrap min-w-max">
                    <GitHubIcon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">View Project</span>
                  </div>
                </div>
                <div className="mt-8 md:mt-0">
                  <h3 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-500 pr-12">Zomato Data Analysis & Predictive Modeling</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-light text-xs md:text-sm max-w-2xl transition-colors duration-500">Executed full-cycle data architecture and cluster categorization across 9,500+ global merchant networks using localized market constraints.</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Scikit-learn", "Python", "K-Means", "Segmentation"].map(t => <span key={t} className="text-[9px] md:text-[10px] px-2 md:px-2.5 py-1 bg-white/60 dark:bg-white/10 rounded-md border border-slate-200/50 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">{t}</span>)}
                </div>
              </a>

              {/* SarpBhasha Card */}
              <a href="https://github.com/ArnavBhomia/sarpbhasha" target="_blank" rel="noopener noreferrer" className="p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-lg flex flex-col justify-between relative group transition-all duration-300 min-h-[220px]">
                <div className="absolute top-4 right-4 md:top-6 md:right-6 h-8 md:h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-start px-2.5 md:px-3 w-8 md:w-10 group-hover:w-[110px] md:group-hover:w-[130px] transition-all duration-300 overflow-hidden shadow-sm z-30">
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold text-slate-800 dark:text-white whitespace-nowrap min-w-max">
                    <GitHubIcon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">View Project</span>
                  </div>
                </div>
                <div className="mt-8 md:mt-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white pr-10 transition-colors duration-500">SarpBhasha</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-light text-xs md:text-sm mt-2 md:mt-3 transition-colors duration-500">Standalone native Python translator platform managing complete desktop systems integrations.</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["CustomTkinter", "API Gateways"].map(t => <span key={t} className="text-[9px] md:text-[10px] px-2 md:px-2.5 py-1 bg-white/60 dark:bg-white/10 rounded-md border border-slate-200/50 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">{t}</span>)}
                </div>
              </a>

              {/* Consumer Growth Card */}
              <a href="https://github.com/ArnavBhomia/consumer_growth_analytics" target="_blank" rel="noopener noreferrer" className="p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-lg flex flex-col justify-between relative group transition-all duration-300 min-h-[220px]">
                <div className="absolute top-4 right-4 md:top-6 md:right-6 h-8 md:h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-start px-2.5 md:px-3 w-8 md:w-10 group-hover:w-[110px] md:group-hover:w-[130px] transition-all duration-300 overflow-hidden shadow-sm z-30">
                  <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold text-slate-800 dark:text-white whitespace-nowrap min-w-max">
                    <GitHubIcon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">View Project</span>
                  </div>
                </div>
                <div className="mt-8 md:mt-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white pr-10 transition-colors duration-500">Consumer Growth Analytics</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-light text-xs md:text-sm mt-2 md:mt-3 transition-colors duration-500">Engineered extensive PostgreSQL structures mapped across localized revenue data visualization dashboards.</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["PostgreSQL", "Power BI"].map(t => <span key={t} className="text-[9px] md:text-[10px] px-2 md:px-2.5 py-1 bg-white/60 dark:bg-white/10 rounded-md border border-slate-200/50 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300 transition-colors duration-500">{t}</span>)}
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* =========================================
            5. SKILLS ARSENAL SECTION 
            ========================================= */}
        <section id="Skills" className="snap-start w-full min-h-[100dvh] flex flex-col justify-center pt-28 pb-12">
          <div className="max-w-5xl w-[95%] mx-auto px-4 flex flex-col justify-center h-full gap-6 md:gap-8">
            
            {/* Part A: Apple Watch App Drawer Scatter Layout */}
            <div className="relative w-full h-[280px] md:h-[400px] mx-auto overflow-hidden rounded-3xl transition-colors duration-500">
              
              {/* Scattered Circular Icons (Permanent White Background) */}
              {skillsScattered.map((skill) => (
                <motion.div 
                  key={skill.name}
                  whileHover={{ scale: 1.25, zIndex: 50, y: -5 }} 
                  style={{ top: skill.top, left: skill.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 aspect-square w-10 h-10 md:w-16 md:h-16 rounded-full bg-white p-2.5 md:p-3.5 flex items-center justify-center shadow-lg cursor-pointer transition-colors duration-500 group"
                >
                  <img src={`/${skill.src}`} alt={skill.name} className="w-full h-full object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </motion.div>
              ))}

            </div>

            {/* Part B: Full Skills Array */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-2.5 max-w-4xl mx-auto pt-2 relative z-20">
              {[
                "Product Strategy", "Roadmapping", "Stakeholder Management", 
                "Root Cause Analysis", "B2B SaaS", "Agile/Scrum", 
                "Wireframing", "A/B Testing", "Data Analytics", 
                "Machine Learning", "System Design", "API Specifications", 
                "Data Pipelines", "Cohort Analysis", "Conversion Optimization"
              ].map((pill) => (
                <div 
                  key={pill}
                  className="px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[10px] md:text-[11px] font-medium text-slate-700 dark:text-slate-300 cursor-default hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 hover:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                >
                  {pill}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* =========================================
            6. HIGH-CONVERSION CONTACT TERMINAL
            ========================================= */}
        <section id="Contact" className="snap-start w-full min-h-[100dvh] flex flex-col items-center justify-center pt-28 pb-12 relative">
          <div className="max-w-5xl w-[95%] mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center flex-grow">
            
            {/* Left Column Hook */}
            <div className="space-y-3 md:space-y-4 text-center md:text-left">
              <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-slate-900 dark:text-white transition-colors duration-500">Let's Build.</h2>
              <div className="flex items-center justify-center md:justify-start gap-2.5 bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-xl w-fit mx-auto md:mx-0 border border-slate-200/50 dark:border-transparent transition-colors duration-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-[11px] md:text-xs font-light text-slate-600 dark:text-slate-400 tracking-wide transition-colors duration-500">Actively reviewing APM / Product roles for 2026.</p>
              </div>
            </div>

            {/* Right Column Formspree Inbox */}
            <div className="w-full p-6 md:p-8 rounded-3xl bg-white/40 dark:bg-black/30 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 transition-colors duration-500">
              
              <div className="flex bg-slate-100/70 dark:bg-white/5 p-1 rounded-xl w-full border border-slate-200/40 dark:border-transparent transition-colors duration-500">
                {["Hire Me", "Pitch a Project"].map((intent) => (
                  <button
                    key={intent}
                    onClick={() => setContactIntent(intent)}
                    className={`flex-1 text-[11px] md:text-sm py-2 md:py-2.5 rounded-lg font-medium transition-all duration-300 ${
                      contactIntent === intent
                        ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>

              {/* Form with noValidate to disable native browser tooltips */}
              <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                <div className="relative">
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Let's chat! Drop your email below." 
                    className={`w-full px-4 py-3 md:py-3.5 rounded-xl bg-white/50 dark:bg-black/30 border focus:border-slate-400 dark:focus:border-white/20 text-xs md:text-sm font-light text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 shadow-inner ${formState === 'error' ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-white/10'}`}
                  />
                  <AnimatePresence>
                    {formState === "error" && (
                      <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 left-2 text-[10px] text-rose-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Please provide a valid email.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                
                <textarea 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Optional: Drop a link or add a quick note..." 
                  className="w-full px-4 py-3 md:py-3.5 rounded-xl bg-white/50 dark:bg-black/30 border border-slate-200 dark:border-white/10 focus:border-slate-400 dark:focus:border-white/20 text-xs md:text-sm font-light text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 shadow-inner resize-none h-20 md:h-24 mt-2"
                />
                
                <button 
                  type="submit" 
                  disabled={formState !== "idle"}
                  className={`w-full py-3 md:py-3.5 rounded-xl font-semibold text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formState === "success" 
                      ? "bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white" 
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.01]"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {formState === "success" ? (
                      <motion.div key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" /> <span>Sent</span>
                      </motion.div>
                    ) : (
                      <motion.span key="txt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Connect</motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </div>

          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-light text-slate-400 dark:text-slate-500 pointer-events-none text-center transition-colors duration-500">
            © 2026 Arnav Bhomia.
          </div>
        </section>

      </div>
    </div>
  );
}