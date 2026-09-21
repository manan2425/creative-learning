'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { 
  Bot, 
  Cpu, 
  Layers, 
  Sparkles, 
  Check, 
  ShoppingCart, 
  MessageCircle, 
  Activity, 
  Zap, 
  RefreshCw,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface OptionItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  icon?: string;
}

export const BotBuilderSection: React.FC = () => {
  const { products, addToCart, openWhatsAppInquiry, showToast } = useStore();

  // Dynamically derive chassis, brain MCUs, drivers, and sensors from products added by admin
  const chassisOptions: OptionItem[] = useMemo(() => {
    const list = products.filter((p) => 
      p.category?.toLowerCase().includes('chassis') ||
      p.name.toLowerCase().includes('chassis') ||
      p.name.toLowerCase().includes('rover') ||
      p.name.toLowerCase().includes('arm') ||
      p.name.toLowerCase().includes('platform')
    );
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      desc: p.shortDescription || 'Robotic structure and mechanical rig',
      icon: '🚗'
    }));
  }, [products]);

  const brainOptions: OptionItem[] = useMemo(() => {
    const list = products.filter((p) => 
      p.category?.toLowerCase().includes('microcontroller') ||
      p.category?.toLowerCase().includes('mcu') ||
      p.name.toLowerCase().includes('arduino') ||
      p.name.toLowerCase().includes('esp32') ||
      p.name.toLowerCase().includes('pico') ||
      p.name.toLowerCase().includes('stm32')
    );
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      desc: p.shortDescription || 'Main processor and brain controller',
      icon: '⚡'
    }));
  }, [products]);

  const driverOptions: OptionItem[] = useMemo(() => {
    const list = products.filter((p) => 
      p.category?.toLowerCase().includes('motor') ||
      p.category?.toLowerCase().includes('driver') ||
      p.name.toLowerCase().includes('l298n') ||
      p.name.toLowerCase().includes('pca9685') ||
      p.name.toLowerCase().includes('driver')
    );
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      desc: p.shortDescription || 'High current motor driver module',
      icon: '⚙️'
    }));
  }, [products]);

  const sensorOptions: OptionItem[] = useMemo(() => {
    const list = products.filter((p) => 
      p.category?.toLowerCase().includes('sensor') ||
      p.category?.toLowerCase().includes('display') ||
      p.name.toLowerCase().includes('sensor') ||
      p.name.toLowerCase().includes('sonar') ||
      p.name.toLowerCase().includes('oled') ||
      p.name.toLowerCase().includes('gyro')
    );
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      desc: p.shortDescription || 'Sensory feedback module',
      icon: '📡'
    }));
  }, [products]);

  const [selectedChassis, setSelectedChassis] = useState<OptionItem | null>(null);
  const [selectedBrain, setSelectedBrain] = useState<OptionItem | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<OptionItem | null>(null);
  const [selectedSensors, setSelectedSensors] = useState<OptionItem[]>([]);

  // Update defaults when dynamic products load
  React.useEffect(() => {
    if (chassisOptions.length > 0 && !selectedChassis) setSelectedChassis(chassisOptions[0]);
    if (brainOptions.length > 0 && !selectedBrain) setSelectedBrain(brainOptions[0]);
    if (driverOptions.length > 0 && !selectedDriver) setSelectedDriver(driverOptions[0]);
    if (sensorOptions.length > 0 && selectedSensors.length === 0) setSelectedSensors([sensorOptions[0]]);
  }, [chassisOptions, brainOptions, driverOptions, sensorOptions]);

  const toggleSensor = (sensor: OptionItem) => {
    setSelectedSensors((prev) => {
      const exists = prev.some((s) => s.id === sensor.id);
      if (exists) {
        return prev.filter((s) => s.id !== sensor.id);
      } else {
        return [...prev, sensor];
      }
    });
  };

  const calculateTotalPrice = () => {
    const chassisPrice = selectedChassis?.price || 0;
    const brainPrice = selectedBrain?.price || 0;
    const driverPrice = selectedDriver?.price || 0;
    const sensorTotal = selectedSensors.reduce((sum, s) => sum + s.price, 0);
    return chassisPrice + brainPrice + driverPrice + sensorTotal;
  };

  const handleAddToCart = () => {
    const total = calculateTotalPrice();
    if (total === 0) {
      showToast('Configurator Notice', 'Please select components for your custom robot.', 'info');
      return;
    }

    const botName = `Custom Robot: ${(selectedChassis?.name || 'Custom Chassis').split(' ')[0]} + ${(selectedBrain?.name || 'MCU').split(' ')[0]}`;
    
    addToCart({
      id: `custom-bot-${Date.now()}`,
      type: 'custom_bot',
      name: botName,
      price: total,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
      sku: `BOT-CUSTOM-${Date.now().toString().slice(-4)}`,
      meta: {
        chassis: selectedChassis?.name || 'N/A',
        brain: selectedBrain?.name || 'N/A',
        driver: selectedDriver?.name || 'N/A',
        sensors: selectedSensors.map((s) => s.name),
      },
    });

    showToast('Custom Bot Added! 🤖', 'Your custom robot configuration is ready in the cart.', 'success');
  };

  const handleWhatsAppOrder = () => {
    const total = calculateTotalPrice();
    const details = `Custom Robot Spec:\n• Chassis: ${selectedChassis?.name || 'N/A'} (₹${selectedChassis?.price || 0})\n• Brain MCU: ${selectedBrain?.name || 'N/A'} (₹${selectedBrain?.price || 0})\n• Motor Driver: ${selectedDriver?.name || 'N/A'} (₹${selectedDriver?.price || 0})\n• Sensors: ${selectedSensors.map((s) => s.name).join(', ') || 'None'}\n• Total Bundle: ₹${total}`;
    
    openWhatsAppInquiry('Custom RoboBuilder Order', details);
  };

  const hasConfigurableParts = chassisOptions.length > 0 || brainOptions.length > 0 || driverOptions.length > 0 || sensorOptions.length > 0;

  return (
    <section id="bot-builder" className="py-14 lg:py-20 bg-navy text-white relative overflow-hidden border-b border-slate-800">
      
      {/* Background Dark Tech Accents */}
      <div className="absolute inset-0 bg-dark-circuit opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/20 text-cyan text-xs font-bold border border-cyan/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Custom Robot Configurator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-heading">
            RoboBuilder™ Interactive Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Customize your robot from chassis to microcontrollers and sensor arrays. Get instant Bill of Materials (BOM) calculation and 1-click checkout.
          </p>
        </div>

        {/* Builder Content */}
        {!hasConfigurableParts ? (
          <div className="bg-slate-900/80 rounded-3xl border border-slate-700 p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan/10 border border-cyan/30 text-cyan mx-auto flex items-center justify-center">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-lg font-heading">
                RoboBuilder Ready for Inventory
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your database is currently clean. Once you add microcontrollers, sensors, and chassis from the Admin Dashboard, customers can interactively configure custom robots here.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hardware in Admin Panel</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Configuration Options */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Chassis */}
              {chassisOptions.length > 0 && (
                <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-[10px]">1</span>
                      Choose Chassis Platform
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chassisOptions.map((opt) => {
                      const isSelected = selectedChassis?.id === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedChassis(opt)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-primary/20 border-cyan text-white shadow-md'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="text-xl shrink-0">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs truncate">{opt.name}</span>
                              <span className="font-mono text-cyan text-xs font-bold shrink-0">₹{opt.price}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Brain MCU */}
              {brainOptions.length > 0 && (
                <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-cyan uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-[10px]">2</span>
                    Select Brain Microcontroller (MCU)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {brainOptions.map((opt) => {
                      const isSelected = selectedBrain?.id === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedBrain(opt)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-primary/20 border-cyan text-white shadow-md'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="text-xl shrink-0">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs truncate">{opt.name}</span>
                              <span className="font-mono text-cyan text-xs font-bold shrink-0">₹{opt.price}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Motor Driver */}
              {driverOptions.length > 0 && (
                <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-cyan uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-[10px]">3</span>
                    Choose Motor Driver Module
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {driverOptions.map((opt) => {
                      const isSelected = selectedDriver?.id === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedDriver(opt)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-primary/20 border-cyan text-white shadow-md'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="text-xl shrink-0">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs truncate">{opt.name}</span>
                              <span className="font-mono text-cyan text-xs font-bold shrink-0">₹{opt.price}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Sensors & Feedback */}
              {sensorOptions.length > 0 && (
                <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-cyan uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-[10px]">4</span>
                    Attach Sensors &amp; Displays (Multi-Select)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sensorOptions.map((opt) => {
                      const isSelected = selectedSensors.some((s) => s.id === opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleSensor(opt)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'bg-primary/20 border-cyan text-white shadow-md'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border ${isSelected ? 'bg-cyan text-navy border-cyan' : 'border-slate-600'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs truncate">{opt.name}</span>
                              <span className="font-mono text-cyan text-xs font-bold shrink-0">+₹{opt.price}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Live Bill of Materials & WhatsApp Checkout */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan" />
                    <span className="font-bold text-sm font-heading">Custom Robot BOM</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan/15 text-cyan border border-cyan/30">
                    LIVE CALCULATION
                  </span>
                </div>

                {/* Selected Spec List */}
                <div className="space-y-3 text-xs divide-y divide-slate-800">
                  {selectedChassis && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-400">Chassis Platform:</span>
                      <span className="font-bold text-white text-right max-w-[180px] truncate">{selectedChassis.name}</span>
                    </div>
                  )}

                  {selectedBrain && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-400">Brain Controller:</span>
                      <span className="font-bold text-white text-right max-w-[180px] truncate">{selectedBrain.name}</span>
                    </div>
                  )}

                  {selectedDriver && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-400">Motor Driver:</span>
                      <span className="font-bold text-white text-right max-w-[180px] truncate">{selectedDriver.name}</span>
                    </div>
                  )}

                  {selectedSensors.length > 0 && (
                    <div className="pt-2 space-y-1">
                      <span className="text-slate-400 block text-[11px]">Sensors &amp; Peripherals ({selectedSensors.length}):</span>
                      {selectedSensors.map((s) => (
                        <div key={s.id} className="flex items-center justify-between pl-2 text-slate-300 font-mono text-[11px]">
                          <span className="truncate max-w-[200px]">• {s.name}</span>
                          <span>+₹{s.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total Price Box */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-bold">Total Robot Cost</span>
                  <span className="text-2xl font-extrabold font-mono text-cyan">₹{calculateTotalPrice()}</span>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add Custom Bot to Cart</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order Custom Bot on WhatsApp</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
