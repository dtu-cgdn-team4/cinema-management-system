import React from 'react';
import { Film } from 'lucide-react';

export const CinemaHeroBanner: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-screen bg-[#07090d] flex flex-col justify-between p-8 lg:p-14 overflow-hidden select-none">
      {/* Background Image with Dark Cinema Ambiance */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />

      {/* Atmospheric Overlays & Spotlight Light Cone */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b0e14]" />
      
      {/* Cinema Projector Light Beam Effect */}
      <div 
        className="absolute -top-24 right-1/4 w-[600px] h-[700px] opacity-15 pointer-events-none transform -rotate-45"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.6) 0%, rgba(229,9,20,0.1) 40%, transparent 75%)',
          filter: 'blur(30px)'
        }}
      />

      {/* Top: Brand Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e50914] to-[#990000] flex items-center justify-center shadow-lg shadow-[#e50914]/30 ring-1 ring-white/20">
          {/* Cinema Aperture / Lens Icon */}
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
            <line x1="9.69" y1="8" x2="21.17" y2="8" />
            <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
            <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
            <line x1="14.31" y1="16" x2="2.83" y2="16" />
            <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
          </svg>
        </div>
        <div>
          <div className="text-xl font-black tracking-widest text-white uppercase font-sans">
            GALAXY
          </div>
          <div className="text-[9px] font-medium tracking-[0.25em] text-[#9ba3b2] uppercase">
            HƠN CẢ ĐIỆN ẢNH
          </div>
        </div>
      </div>

      {/* Center-Bottom: Tagline & Description */}
      <div className="relative z-10 max-w-xl mt-auto pb-10">
        {/* Red Accent Label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-[2px] bg-[#e50914] inline-block"></span>
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#d63031] uppercase">
            ĐIỆN ẢNH, THEO CÁCH CỦA BẠN
          </span>
        </div>

        {/* Main Bold Title */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-5">
          Mọi cảm xúc.<br />
          Một màn ảnh.
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-[#9ba3b2] font-normal leading-relaxed max-w-md">
          Từ những thước phim đầu tiên đến dư âm cuối cùng. Khám phá, đặt vé và tận hưởng thế giới điện ảnh cùng Lumière.
        </p>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-[11px] tracking-wider text-[#636c7e]">
        <div className="flex items-center gap-2">
          <Film size={14} className="text-[#8892a4]" />
          <span>Màn ảnh lớn. Trải nghiệm khác biệt.</span>
        </div>
        <div className="uppercase font-medium text-[#7d8697]">
          TỪ NĂM 2024
        </div>
      </div>
    </div>
  );
};

