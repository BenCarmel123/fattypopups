import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as Config from 'config/index.jsx';
import { BackButton } from "../../components/buttons/Buttons.jsx";
import * as Colors from 'config/colors.jsx';
import * as Classes from 'config/classes.jsx';

const ParagraphComponent = ({ text }) => {
  return (
    <p className={Classes.ABOUT_PARAGRAPH}>
      {text}
    </p>
  );
}

const ABOUT_SUBHEADER = ({ text, color, style }) => {
  return (
    <h1 className={Classes.ABOUT_SUBHEADER} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', marginTop: '0.5rem', fontWeight: '100', color: color, ...style }}>
      {text}
    </h1>
  );
}

const ContactEmail = ({ email }) => {
  return (
    <p className={Classes.ABOUT_CONTACT_EMAIL} style={{ color: Config.SECONDARY_COLOR }}>
        <span className={Classes.ABOUT_CONTACT_INLINE} style={{ color: Config.SECONDARY_COLOR, marginBottom: '1.5rem' }}>
          <Config.AiOutlineMail className={Classes.ABOUT_MAIL_ICON} style={{ verticalAlign: Config.MIDDLE, color: Config.SECONDARY_COLOR }} />
          <a href={`${Config.MAILTO_PREFIX}${email}`} className={Classes.ABOUT_CONTACT_LINK} style={{ color: Config.SECONDARY_COLOR }}>
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
      image: Config.BEN_PIC_URL,
      instagram: Config.INSTA_LINK_BEN,
      email: Config.BEN_EMAIL
    },
    {
      name: "Hallie",
      image: Config.HALLIE_PIC_URL,
      instagram: Config.INSTA_LINK_HALLIE,
      email: Config.HALLIE_EMAIL
    }
  ];

  return (
    <div className={Classes.ABOUT_PAGE_WRAPPER} style={{ backgroundColor: Config.ABOUT_PAGE_BACKGROUND_COLOR, marginTop: '-40px' }}>
      <div className={Classes.ABOUT_CONTENT_WRAPPER}>
        <div className={Classes.ABOUT_BACK_BUTTON_WRAPPER}>
          <BackButton variant="about" onBack={() => navigate('/')} />
        </div>
        <ABOUT_SUBHEADER text={Config.ABOUT_LABEL} color={Config.BLACK} />
        <ABOUT_SUBHEADER text="fatty popups" color={Config.SECONDARY_COLOR} style={{ fontStyle: 'italic', fontWeight: '300' }} />

      <div className={Classes.ABOUT_ICON_WRAPPER}>
        <Config.GiKnifeFork className={Classes.ABOUT_KNIFE_FORK_ICON} />
      </div>

        <div className={Classes.ABOUT_CREATORS_ROW}>
          {creators.map((creator, index) => (
            <motion.a
              key={creator.name}
              href={creator.instagram}
              target={Config.SELF}
              rel={Config.NO_OPENER}
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
              className={Classes.ABOUT_CREATOR_GROUP}
            >
               <div className={Classes.ABOUT_CREATOR_RELATIVE}>
                  <div className={Classes.ABOUT_CREATOR_AVATAR_WRAPPER}>
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className={creator.name === "Ben" ? Classes.ABOUT_CREATOR_IMG_BEN : Classes.ABOUT_CREATOR_IMG_HALLIE}
                      style={creator.name === "Ben" ? { objectPosition: '10% 5%' } : undefined}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className={Classes.ABOUT_CREATOR_NAME}
                  >
                  </motion.div>
                </div>
            </motion.a>
          ))}
        </div>

  <div className={Classes.ABOUT_BODY_TEXT} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', marginTop: '1rem' }}>
          <ParagraphComponent text={Config.ABOUT_CREATORS_1} />
          <ParagraphComponent text={Config.ABOUT_CREATORS_2} />
          <ParagraphComponent text={Config.ABOUT_CREATORS_3} />
          <p className={Classes.ABOUT_CONTACT_TEXT} style={{ color: Config.SECONDARY_COLOR }}>
            {Config.CONTACT}
          </p>
          <div className={Classes.ABOUT_CONTACT_LIST}>
            <ContactEmail email={Config.HALLIE_EMAIL} />
            <ContactEmail email={Config.BEN_EMAIL} />
          </div>
      </div>
    </div>
    </div>
  );
}