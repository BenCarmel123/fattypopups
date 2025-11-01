import React from "react";
import { motion } from "framer-motion";
import { GiKnifeFork } from "react-icons/gi";
import { SECONDARY_COLOR } from "../../components/config/colors.jsx";
import { ABOUT_CREATORS_1, ABOUT_CREATORS_2 } from "../../components/config/strings.jsx";

const INSTA_LINK_HALLIE = process.env.REACT_APP_INSTA_LINK_HALLIE;
const INSTA_LINK_BEN = process.env.REACT_APP_INSTA_LINK_BEN;
const BEN_PIC_URL = process.env.REACT_APP_BEN_PIC_URL;
const HALLIE_PIC_URL = process.env.REACT_APP_HALLIE_PIC_URL;

export default function AboutPage() {
  const creators = [
    {
      name: "Ben",
      image: BEN_PIC_URL,
      instagram: INSTA_LINK_BEN
    },
    {
      name: "Hallie",
      image: HALLIE_PIC_URL,
      instagram: INSTA_LINK_HALLIE
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full space-y-12">
        <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 text-center tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
          About
        </h1>
        <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 text-center tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', marginTop: '0.5rem', fontStyle: 'italic', fontWeight: '300', color: SECONDARY_COLOR }}>
          fatty popups
        </h1>

      <div className="flex justify-center">
        <GiKnifeFork className="text-6xl text-gray-900" />
      </div>

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
                      className={creator.name === "Ben"
                        ? "w-full h-full object-cover object-center scale-110 group-hover:scale-115 transition-transform duration-500"
                        : "w-full h-full object-cover object-center scale-125 group-hover:scale-130 transition-transform duration-500"
                      }
                      style={creator.name === "Ben" ? { objectPosition: '10% 5%' } : undefined}
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

        <div className="space-y-10 text-lg text-gray-600 leading-relaxed text-center pt-8" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', marginTop: '1rem' }}>
          <p className="font-light">
            {ABOUT_CREATORS_1}
          </p>
         
          <p className="font-light">
            {ABOUT_CREATORS_2}
          </p>

          <p className="text-sm text-gray-400 pt-4 font-light" style={{ color: SECONDARY_COLOR }}>
            Questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}