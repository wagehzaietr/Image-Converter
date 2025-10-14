
import React from 'react';

const WelcomeFeatures: React.FC = () => {
    const features = [
        {
            icon: (
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-cyan-900/30 rounded-lg border border-cyan-500/20 p-2">
                    <img src="https://github.com/wagehzaietr/my-ad-design-/blob/main/format.png?raw=true" alt="Multiple Formats" className="w-full h-full object-contain" />
                </div>
            ),
            title: "Multiple Formats",
            description: "Convert images to modern formats like WEBP, JPEG, and PNG with ease.",
        },
        {
            icon: (
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-cyan-900/30 rounded-lg border border-cyan-500/20 p-2">
                    <img src="https://github.com/wagehzaietr/my-ad-design-/blob/main/control.png?raw=true" alt="Quality Control" className="w-full h-full object-contain" />
                </div>
            ),
            title: "Quality Control",
            description: "Fine-tune the compression level to balance file size and visual quality.",
        },
        {
            icon: (
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-cyan-900/30 rounded-lg border border-cyan-500/20 p-2">
                    <img src="https://github.com/wagehzaietr/my-ad-design-/blob/main/prev.png?raw=true" alt="Instant Preview" className="w-full h-full object-contain" />
                </div>
            ),
            title: "Instant Preview",
            description: "See a live preview of your original and converted images side-by-side.",
        },
        {
            icon: (
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-cyan-900/30 rounded-lg border border-cyan-500/20 p-2">
                    <img src="https://github.com/wagehzaietr/my-ad-design-/blob/main/privacy.png?raw=true" alt="Privacy First" className="w-full h-full object-contain" />
                </div>
            ),
            title: "Privacy First",
            description: "All conversions happen directly in your browser. Your images never leave your device.",
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                {features.map((feature, index) => (
                    <div key={index} className="glass-panel p-5 rounded-xl">
                        {feature.icon}
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WelcomeFeatures;