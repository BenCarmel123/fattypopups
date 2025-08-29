import styles from '../home/home.module.css';
import React from "react"
import { APP_NAME, INSTA_LINK, INSTA_TEXT, ADMIN_ROUTE } from '../../Config';
import { Button, RadioCard, Card, Image, Text, IconButton, Drawer, CloseButton, Stack, Portal } from '@chakra-ui/react';
import { SiInstagram, SiGooglecalendar } from "react-icons/si";
import { LuPhone } from "react-icons/lu";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { TfiArrowCircleRight, TfiArrowCircleLeft } from "react-icons/tfi";
import { CiSquareMore } from "react-icons/ci";
import { RiMailLine } from "react-icons/ri";

function Credentials() {
  function handleInstagram() {
    window.open(INSTA_LINK, '_blank', 'noopener,noreferrer');
  }

  function handleAdmin() {
    window.location.href = "/" + ADMIN_ROUTE;
  }
  return (
    <>
      <div className={styles.credentials}>
        <Button
          className={styles.adminCornerButton}
          colorScheme="teal"
          variant="ghost"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, background: 'transparent', boxShadow: 'none', opacity: 0.7 }}
          onClick={handleAdmin}
        >
          <RiMailLine /> Admin
        </Button>
        <Button colorPalette="blue" variant="ghost" rounded="lg" onClick={handleInstagram}>
          <SiInstagram/> {INSTA_TEXT}
        </Button>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <>
    <header className={styles.header}>
      <img
        src="/logo.png"
        alt={APP_NAME}
        className={styles.mainTitle}
        style={{ height: '8rem', objectFit: 'contain' }}
      />
      <Credentials />
    </header>
    <div className={`${styles.centeredContent} centered-content`}>
      <RadioCard.Root defaultValue="next">
      </RadioCard.Root>
      <div style={{ height: '2.5rem' }} />
      <Carousel />
    </div>
    </>
  );
}

const Carousel = () => {
  // Helper for left/right arrow IconButton
  const renderArrow = (direction) => (
    <IconButton
      className={styles.carouselArrow}
      variant="ghost"
      size="2xl"
      color="blue.400"
      style={direction === 'left' ? { left: '-4.5rem' } : { right: '-4.5rem' }}
      _hover={{ background: 'blue.400', color: 'white' }}
      _active={{ background: 'blue.600', color: 'white' }}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
    >
      {direction === 'left' ? <TfiArrowCircleLeft /> : <TfiArrowCircleRight />}
    </IconButton>
  );
  
  // Helper for footer icons
  const Footer = () => {
      return (
        <>
          <IconButton variant="outline" size="xl" rounded="2xl"> <LuPhone /> </IconButton>
          <IconButton variant="outline" size="xl" rounded="2xl"> <SiGooglecalendar /> </IconButton>
          <IconButton variant="outline" size="xl" rounded="2xl"> <FaRegShareFromSquare /> </IconButton>
          <IconButton variant="outline" size="xl" rounded="2xl"> <SiInstagram /> </IconButton>
        </>
      );
  }


  return (
    <div className={styles.carouselWrapper} style={{ marginTop: '1.5rem' }}>
      {renderArrow('left')}
      <Card.Root className={styles.carouselCard} maxW="sm" overflow="hidden" rounded="lg">
         <Details/>
        <img src="/hakatan.jpg" alt="Event Image" />
        <Card.Body gap="2">
          <Card.Title> HaKatan </Card.Title>
          <Card.Description>
            Ori Salama x Ido Kablan || Levinsky 36
          </Card.Description>
          <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
          </Text>
        </Card.Body>
        <Card.Footer gap="2" className={styles.carouselFooterIcons}>
          <Footer />
        </Card.Footer>
      </Card.Root>
      {renderArrow('right')}
    </div>
  )
}

export { Carousel };

const Details = () => { 
  return (
    <Drawer.Root> 
        <Text></Text>
        <Drawer.Trigger asChild>
         <Button variant="outline" size="m" rounded="2xl" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000, background: 'transparent', boxShadow: 'none' }}><CiSquareMore /></Button>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="absolute" boxSize="full" />
        <Drawer.Positioner pos="absolute" boxSize="full" padding="4">
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Drawer Title</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
    </Drawer.Root>
  )
}
