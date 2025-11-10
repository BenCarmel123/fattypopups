import React from "react";
import { motion } from "framer-motion";
import { GiKnifeFork } from "react-icons/gi";
import { AiOutlineMail } from "react-icons/ai";
import { SECONDARY_COLOR, ABOUT_PAGE_BACKGROUND_COLOR, BLACK} from "../../components/config/colors.jsx";
import { useNavigate } from 'react-router-dom';
import { ABOUT_CREATORS_1, ABOUT_CREATORS_2, ABOUT_CREATORS_3, CONTACT, SELF, NO_OPENER, POINTER, BACK_BUTTON_TEXT } from "../../components/config/strings.jsx";

const INSTA_LINK_HALLIE = process.env.REACT_APP_INSTA_LINK_HALLIE;
const INSTA_LINK_BEN = process.env.REACT_APP_INSTA_LINK_BEN;
const BEN_PIC_URL = process.env.REACT_APP_BEN_PIC_URL;
const HALLIE_PIC_URL = process.env.REACT_APP_HALLIE_PIC_URL;
const BEN_EMAIL = process.env.REACT_APP_BEN_EMAIL;
const HALLIE_EMAIL = process.env.REACT_APP_HALLIE_EMAIL;

export const ParagraphComponent = ({ text }) => {
  return (
    <p className="font-light">
      {text}
    </p>
  );
}

export const ABOUT_SUBHEADER = ({ text, color, style }) => {
  return (
    <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 text-center tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', marginTop: '0.5rem', fontWeight: '100', color: color, ...style }}>
      {text}
    </h1>
  );
}

export const ContactEmail = ({ email }) => {
  return (
    <p className="text-sm text-gray-400 font-bold mt-0" style={{ color: SECONDARY_COLOR }}>
        <span className="inline-flex items-center gap-2" style={{ color: SECONDARY_COLOR, marginBottom: '1.5rem' }}>
          <AiOutlineMail className="inline-block" style={{ verticalAlign: 'middle', color: SECONDARY_COLOR }} />
          <a href={`mailto:${email}`} className="underline" style={{ color: SECONDARY_COLOR }}>
            {email}
          </a>
        </span>
    </p>
  );
}


export default function AboutPage() {
  const navigate = useNavigate();
  const creators = [
    {
      name: "Ben",
      image: BEN_PIC_URL,
      instagram: INSTA_LINK_BEN,
      email: BEN_EMAIL
    },
    {
      name: "Hallie",
      image: HALLIE_PIC_URL,
      instagram: INSTA_LINK_HALLIE,
      email: HALLIE_EMAIL
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20" style={{ backgroundColor: ABOUT_PAGE_BACKGROUND_COLOR, marginTop: '-40px' }}>
      <div className="max-w-2xl w-full space-y-12">
        <div className="flex justify-center mb-7">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 underline hover:text-gray-800"
            aria-label="Go back"
            style={{ cursor: POINTER }}
          >
            {BACK_BUTTON_TEXT}
          </button>
        </div>
        <ABOUT_SUBHEADER text="About" color={BLACK} />
        <ABOUT_SUBHEADER text="fatty popups" color={SECONDARY_COLOR} style={{ fontStyle: 'italic', fontWeight: '300' }} />

      <div className="flex justify-center">
        <GiKnifeFork className="text-6xl text-gray-900" />
      </div>

        {/* Profile Pictures */}
        <div className="flex justify-center gap-8">
          {creators.map((creator, index) => (
            <motion.a
              key={creator.name}
              href={creator.instagram}
              target={SELF}
              rel={NO_OPENER}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group cursor-pointer"
            >
               <div className="relative">
                  <div className="w-[7.7rem] h-[7.7rem] md:w-[9.9rem] md:h-[9.9rem] rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-4 group-hover:ring-gray-200 transition-all duration-300">
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
                  </motion.div>
                </div>
            </motion.a>
          ))}
        </div>

  <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-center pt-8" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', marginTop: '1rem' }}>
          <ParagraphComponent text={ABOUT_CREATORS_1} />
          <ParagraphComponent text={ABOUT_CREATORS_2} />
          <ParagraphComponent text={ABOUT_CREATORS_3} />
          <p className="text-md text-gray-400 pt-4 font-light" style={{ color: SECONDARY_COLOR }}>
            {CONTACT}
          </p>
          <div className="flex flex-col items-center space-y-2 mt-2">
            <ContactEmail email={HALLIE_EMAIL} />
            <ContactEmail email={BEN_EMAIL} />
          </div>
      </div>
    </div>
    </div>
  );
}