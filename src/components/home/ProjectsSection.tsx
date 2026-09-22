'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  Compass, 
  ShoppingCart, 
  MessageCircle, 
  FileCode2, 
  Box, 
  Cpu, 
  ArrowRight, 
  Check, 
  Download,
  Share2
} from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { projects, addToCart, openWhatsAppInquiry, showToast } = useStore();

  const handleAddProjectBOMToCart = (project: any) => {
    let totalAdded = 0;
    const isQuoteProject = Boolean(project.hidePrice || !project.estimatedCost);

    if (project.bom && project.bom.length > 0) {
      project.bom.forEach((item: any, idx: number) => {
        addToCart({
          id: `bom-${project.id}-${idx}`,
          type: 'bom_bundle',
          name: `${item.name} (${project.title})`,
          price: isQuoteProject ? 0 : (item.unitPrice || 0),
          hidePrice: isQuoteProject || !item.unitPrice,
          image: project.image,
          sku: `BOM-${project.id.toUpperCase()}-${idx}`,
        }, item.qty || 1);
        totalAdded += (item.qty || 1);
      });
    } else {
      addToCart({
        id: `project-${project.id}`,
        type: 'project',
        name: `Blueprint: ${project.title}`,
        price: isQuoteProject ? 0 : (project.estimatedCost || 0),
        hidePrice: isQuoteProject,
        image: project.image,
        sku: `PRJ-${project.id.toUpperCase()}`,
      }, 1);
      totalAdded = 1;
    }

    if (totalAdded > 0) {
      showToast('BOM Added to Cart 📦', `Added ${totalAdded} item(s) for ${project.title} to your cart.`, 'success');
    }
  };

  return (
    <section id="projects" className="py-16 lg:py-24 bg-white border-b border-border relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-circuit-dots opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold border border-blue-200">
              <Compass className="w-3.5 h-3.5" />
              <span>Engineering Blueprints &amp; DIY Projects</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight">
              Open-Source Robotics Blueprints
            </h2>
            <p className="text-sm text-secondary max-w-xl">
              Production-ready blueprints complete with Bill of Materials (BOM), CAD chassis mockups, circuit topologies, and one-click component ordering.
            </p>
          </div>

          <button
            onClick={() => openWhatsAppInquiry('Custom Capstone / Final Year Engineering Project Blueprint Consultation')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Request Custom Capstone Blueprint</span>
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/20 text-navy mx-auto flex items-center justify-center">
              <Compass className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-navy font-heading text-lg">Engineering Blueprints &amp; DIY Projects</h4>
              <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
                Complete engineering project blueprints featuring Bill of Materials (BOM), schematics, and firmwares. Looking for a custom final year or capstone robotics project?
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => openWhatsAppInquiry('Custom Capstone / Final Year Engineering Project Blueprint Consultation')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Consult on Custom Project with Engineers</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Image */}
                  <div className="aspect-16/10 bg-slate-900 relative overflow-hidden">
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=700&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />

                    {/* Level & Cost Badge */}
                    <div className="absolute top-3 left-3 bg-navy/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-700">
                      {project.difficulty}
                    </div>

                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold font-mono text-navy border border-border shadow-md">
                      {project.hidePrice || !project.estimatedCost ? (
                        <span className="text-emerald-800 font-extrabold flex items-center gap-1.5 font-heading">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Custom Quotation
                        </span>
                      ) : (
                        <>Est. BOM Cost: <span className="text-primary font-extrabold">₹{project.estimatedCost}</span></>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-navy mt-1 leading-snug group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Hardware Indicators */}
                    <div className="flex items-center gap-3 text-xs pt-1">
                      <span className={`inline-flex items-center gap-1 font-semibold ${project.cadModelAvailable ? 'text-emerald-700' : 'text-slate-400'}`}>
                        <Box className="w-3.5 h-3.5" /> 3D CAD Mockup
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className={`inline-flex items-center gap-1 font-semibold ${project.gerberAvailable ? 'text-emerald-700' : 'text-slate-400'}`}>
                        <FileCode2 className="w-3.5 h-3.5" /> Gerber PCB
                      </span>
                    </div>

                    {/* Topology Preview */}
                    {project.circuitTopology && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-border text-[11px] font-mono text-slate-700 leading-tight">
                        <span className="font-bold text-navy block text-[10px] uppercase mb-1 font-sans">
                          Circuit Signal Topology:
                        </span>
                        <p className="truncate text-secondary">{project.circuitTopology}</p>
                      </div>
                    )}

                    {/* BOM Table Preview */}
                    {project.bom && project.bom.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-navy">
                          <span>BOM Components ({project.bom.length} parts)</span>
                          <span className="text-secondary font-mono">Qty</span>
                        </div>
                        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden text-[11px]">
                          {project.bom.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between px-3 py-1.5 bg-white">
                              <span className="text-secondary truncate max-w-[180px]">{item.name}</span>
                              <span className="font-bold text-navy font-mono">x{item.qty} {item.unitPrice ? `(₹${item.unitPrice})` : ''}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => handleAddProjectBOMToCart(project)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>
                      {project.hidePrice || !project.estimatedCost
                        ? 'Add All BOM Parts to Cart (Quote Request)'
                        : `Add All BOM Parts to Cart (₹${project.estimatedCost})`}
                    </span>
                  </button>

                  <button
                    onClick={() => openWhatsAppInquiry(
                      `Blueprint & BOM Inquiry: ${project.title}`,
                      `Estimated BOM: ${project.hidePrice ? 'Price on Request' : `₹${project.estimatedCost}`}`,
                      project.id
                    )}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-navy hover:text-emerald-800 border border-border hover:border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enquire Project on WhatsApp</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
