'use client';

import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: "Naved Sayyed",
      role: "Full Stack Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naved",
      bio: "Passionate about building scalable applications and solving real-world problems.",
      linkedin: "#",
      github: "#",
      email: "naved@snap2fix.com"
    },
    {
      name: "Saniya Shaikh",
      role: "UI/UX Designer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Saniya",
      bio: "Creating beautiful and intuitive user experiences for modern applications.",
      linkedin: "#",
      github: "#",
      email: "saniya@snap2fix.com"
    },
    {
      name: "Rayyan Shaikh",
      role: "Backend Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rayyan",
      bio: "Specializing in backend architecture and API development.",
      linkedin: "#",
      github: "#",
      email: "rayyan@snap2fix.com"
    },
    {
      name: "Samruddha Sonavne",
      role: "Mobile Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samruddha",
      bio: "Building seamless mobile experiences for iOS and Android platforms.",
      linkedin: "#",
      github: "#",
      email: "samruddha@snap2fix.com"
    }
  ];

  return (
    <div className="bg-[#121212] min-h-screen dotted-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
              Team
            </span>
          </h1>
          <p className="text-lg text-[#B0B0B0]">
            Dedicated professionals working to make facility management effortless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative bg-[#1A1A1A] rounded-2xl border border-white/10 overflow-hidden hover:border-[#00BFFF]/30 transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00BFFF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-6">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-[#00BFFF]/30 transition-colors">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-1/2 translate-x-16">
                    <div className="w-4 h-4 bg-[#4CAF50] rounded-full border-2 border-[#1A1A1A] animate-pulse" />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#00BFFF] font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-[#B0B0B0] leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/5">
                  <a
                    href={member.linkedin}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#0077B5]/20 border border-white/10 hover:border-[#0077B5]/30 flex items-center justify-center transition-all duration-300 group/icon"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4 text-[#B0B0B0] group-hover/icon:text-[#0077B5] transition-colors" />
                  </a>
                  <a
                    href={member.github}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 group/icon"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4 text-[#B0B0B0] group-hover/icon:text-white transition-colors" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#DC2626]/20 border border-white/10 hover:border-[#DC2626]/30 flex items-center justify-center transition-all duration-300 group/icon"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4 text-[#B0B0B0] group-hover/icon:text-[#DC2626] transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-[#1A1A1A] border border-white/10 rounded-2xl px-8 py-6 max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              Want to join our team?
            </h3>
            <p className="text-[#B0B0B0] mb-4">
              We're always looking for talented individuals to help us build the future of facility management.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white text-sm font-semibold rounded-full hover:from-[#0099CC] hover:to-[#0088BB] transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
