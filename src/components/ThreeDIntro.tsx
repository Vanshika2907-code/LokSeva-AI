import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  Cpu, 
  Zap, 
  Building2, 
  Users, 
  Landmark,
  Volume2,
  ChevronRight,
  Eye
} from 'lucide-react';

interface ThreeDIntroProps {
  onEnterGate: (targetPortal?: 'citizen' | 'officer' | 'admin') => void;
}

export const ThreeDIntro: React.FC<ThreeDIntroProps> = ({ onEnterGate }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const features = [
    {
      title: "AI-Powered Civic Triaging",
      subtitle: "Instant SLA assignment & automated multimodal analysis",
      tag: "Gemini 2.5 Engine",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "22 Official Indian Languages",
      subtitle: "Bhashini real-time speech-to-text & audio synthesis",
      tag: "Multilingual Voice AI",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "10 Municipal Departments",
      subtitle: "Unified dispatch to Roads, Water, Power, Sanitation & more",
      tag: "Automated Dispatch",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Zero-Latency Escalation",
      subtitle: "Automated Level 1-4 escalation to State Commissioners",
      tag: "Governance Matrix",
      color: "from-purple-500 to-pink-600"
    }
  ];

  // Rotate feature highlight every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Three.js 3D Interactive Canvas
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050d1a, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Outer Particle Network (National Grid)
    const particleCount = 2200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorSaffron = new THREE.Color(0xff9933);
    const colorWhite = new THREE.Color(0xf8fafc);
    const colorGreen = new THREE.Color(0x138808);
    const colorBlue = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 42 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Assign Indian Tricolor & Tech Blue gradients based on Y position
      let c = colorWhite;
      if (y > 15) {
        c = colorSaffron;
      } else if (y < -15) {
        c = colorGreen;
      } else {
        c = Math.random() > 0.5 ? colorBlue : colorWhite;
      }

      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    globeGroup.add(particleMesh);

    // 2. Wireframe Geometric Core (Ashok Chakra & Geo Shield)
    const coreGeometry = new THREE.IcosahedronGeometry(28, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // 3. Central 24-Spoke Ashok Chakra Wheel
    const chakraGroup = new THREE.Group();
    const chakraRadius = 18;
    const ringGeo = new THREE.TorusGeometry(chakraRadius, 0.4, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: false });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    chakraGroup.add(ringMesh);

    // 24 Spokes
    for (let s = 0; s < 24; s++) {
      const angle = (s / 24) * Math.PI * 2;
      const spokeGeo = new THREE.CylinderGeometry(0.15, 0.15, chakraRadius * 2, 8);
      const spokeMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = angle;
      chakraGroup.add(spoke);
    }
    globeGroup.add(chakraGroup);

    // 4. Orbiting Data Node Rings
    const ring1Geo = new THREE.RingGeometry(52, 53, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xff9933, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    globeGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(48, 49, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    globeGroup.add(ring2);

    // 5. Floating Ambient Nodes (Data Packets)
    const nodeCount = 45;
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.8, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let n = 0; n < nodeCount; n++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 36 + Math.random() * 18;
      node.position.set(
        rad * Math.sin(phi) * Math.cos(theta),
        rad * Math.sin(phi) * Math.sin(theta),
        rad * Math.cos(phi)
      );
      globeGroup.add(node);
      nodes.push(node);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff9933, 2, 200);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x138808, 2, 200);
    pointLight2.position.set(-50, -50, 50);
    scene.add(pointLight2);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    const onMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.45;
      targetRotationX = mouseY * 0.35;
      setMousePos({ x: mouseX, y: mouseY });
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth rotation
      globeGroup.rotation.y += 0.003;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;

      // Pulse Chakra
      chakraGroup.rotation.z -= 0.008;
      coreMesh.rotation.y += 0.005;
      coreMesh.rotation.x += 0.002;

      // Pulse rings
      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.004;

      // Float nodes
      nodes.forEach((node, idx) => {
        node.position.y += Math.sin(elapsedTime * 2 + idx) * 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050d1a] text-white overflow-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* 3D WebGL Canvas Layer */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-90" 
      />

      {/* Atmospheric Glowing Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-blue-600 to-emerald-600 p-[2px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#071324] rounded-[14px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-serif">
                LOKSEVA
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                v2.5 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              National Civic Redressal & Intelligent Dispatch Matrix
            </p>
          </div>
        </div>

        {/* Quick Skip to Portals */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterGate()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-md flex items-center gap-2 cursor-pointer"
          >
            <span>Skip to Login</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero 3D Perspective Floating Centerpiece */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center text-center my-auto">
        
        {/* Kinetic Badge */}
        <div 
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -8}deg) rotateY(${mousePos.x * 8}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-emerald-500/20 border border-white/20 backdrop-blur-xl shadow-2xl mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
            Government of India • Ministry of Grievances
          </span>
        </div>

        {/* 3D Holographic Title */}
        <div
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 5}deg) translateZ(30px)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-white to-emerald-400">
              Transforming Civic Redressal
            </span>
            <br />
            <span className="text-3xl sm:text-5xl md:text-6xl text-slate-200 font-serif font-normal">
              Through Sovereign AI
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300/90 max-w-2xl mx-auto font-normal leading-relaxed">
            A unified, multilingual governance ecosystem connecting citizens, municipal officers, and state administrators with real-time automated triaging, SLA escalation, and GIS intelligence.
          </p>
        </div>

        {/* Dynamic 3D Feature Carousel Banner */}
        <div 
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg) translateZ(20px)`,
            transition: 'transform 0.15s ease-out'
          }}
          className="mt-8 w-full max-w-2xl bg-gradient-to-r from-slate-900/80 via-[#0b1d3a]/90 to-slate-900/80 p-4 rounded-2xl border border-blue-500/30 backdrop-blur-xl shadow-2xl shadow-blue-900/40"
        >
          <div className="flex items-center justify-between text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/20">
                {features[activeFeatureIndex].tag}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {features[activeFeatureIndex].title}
              </h3>
              <p className="text-xs text-slate-400">
                {features[activeFeatureIndex].subtitle}
              </p>
            </div>
            <div className="flex gap-1.5 pl-4">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeFeatureIndex === idx ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3 Dedicated Portal Launcher Gateway Cards */}
        <div 
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 3}deg) translateZ(10px)`,
            transition: 'transform 0.2s ease-out'
          }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl"
        >
          {/* Card 1: Citizen */}
          <div 
            onClick={() => onEnterGate('citizen')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#0e213b]/90 to-[#071324]/90 border border-blue-500/30 hover:border-blue-400 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-blue-300">
              01 • Citizen Portal
            </span>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
              नागरिक पोर्टल
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
              File voice & photo complaints in 22 languages with instant SLA tracking.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>Enter Citizen Gate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Officer */}
          <div 
            onClick={() => onEnterGate('officer')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#0e213b]/90 to-[#071324]/90 border border-amber-500/30 hover:border-amber-400 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-300">
              02 • Officer Console
            </span>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
              अधिकारी पोर्टल
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
              10 Municipal Department queues with AI triage & rapid resolution co-pilot.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Enter Officer Gate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Admin */}
          <div 
            onClick={() => onEnterGate('admin')}
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#0e213b]/90 to-[#071324]/90 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-300">
              03 • State & Apex Admin
            </span>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
              प्रशासक कमान
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
              Cross-department heatmap analytics, escalation alerts & policy command.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Enter Admin Gate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Master Action Button */}
        <div className="mt-8">
          <button
            onClick={() => onEnterGate()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-blue-600 to-emerald-600 hover:from-amber-400 hover:via-blue-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all transform hover:scale-105 flex items-center gap-3 cursor-pointer border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>Enter LokSeva Portal Gateway</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>

      {/* Footer Metrics */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">National SLA Redressal Rate: <strong>94.2%</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-300 font-medium">10 Municipal Departments Active</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-300 font-medium">22 Scheduled Languages Supported</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Compliant with DARPG CPGRAMS & Digital India Standards • 2026
        </p>
      </footer>

    </div>
  );
};
