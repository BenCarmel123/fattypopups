import React from "react";
import { motion } from "framer-motion";

const INSTA_LINK_HALLIE = process.env.REACT_APP_INSTA_LINK_HALLIE;
const INSTA_LINK_BEN = process.env.REACT_APP_INSTA_LINK_BEN;

export default function AboutPage() {
  const creators = [
    {
      name: "Creator One",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      instagram: INSTA_LINK_BEN
    },
    {
      name: "Creator Two",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      instagram: INSTA_LINK_HALLIE
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full space-y-12">
        <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 text-center tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          About
        </h1>
        
        <div className="h-px bg-gray-200 w-16 mx-auto" />
        
        {/* Profile Pictures */}
        <div className="flex justify-center gap-8 py-8">
          {creators.map((creator, index) => (
            <motion.a
              key={creator.name}
              href={creator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-gray-200 transition-all duration-300">
                  <img 
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm text-gray-400"
                >
                  @{creator.name.toLowerCase().replace(' ', '')}
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
        
        <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-center pt-8" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          <p className="font-light">
            This app was created by two passionate creators to help make your workflow smoother and more efficient.
          </p>
          
          <p className="font-light">
            Built with attention to detail, our goal is to provide a simple, elegant solution that makes your life easier.
          </p>
          
          <p className="text-sm text-gray-400 pt-4 font-light">
            Questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}