import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.header`
  color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #040404;
  font-weight: bold;
  width: 100vw;
  height: 7vh;
  transition: 0.3s ease-in-out;
  z-index: 100;

  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    a {
      text-decoration: none;
      color: inherit;
    }
    h1 {
      text-align: left;
      font-size: 4rem;
      margin: 0;
      padding: 2rem;
      font-family: 'Pacifico';
    }

    ul {
      mix-blend-mode: difference;

      li {
        font-size: 2rem;
        margin-right: 2rem;
        display: inline;
       
      }
    }
  }
 
`;
const Nav = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const variants = {
    loaded: { opacity: 1 },
    initial: {
      opacity: 0,
      transition: {
        delay: 0.2,
      },
    },
  };

  const ulVariants = {
    loaded: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        staggerDirection: 1, // 1 forwards, -1 backwards
      },
    },
    initial: {
      scale: 1,
    },
  };

  const liVariants = {
    loaded: {
      x: 0,
      opacity: 1,
    },
    initial: { x: -20, opacity: 0 },
  };
  const navItems = [
    'Vote Now',
    'The Candidates',
    'How To Vote',
    'About This Site',
  ];
  return (
    <Container>
      <motion.nav
        variants={variants}
        initial="initial"
        animate={isLoaded ? 'loaded' : 'initial'}
        transition={{ damping: 300 }}
      >
        <motion.h1 animate={{ x: 0 }} initial={{ x: '-2rem' }}>
          <a href="#Landing">Election 2020</a>
        </motion.h1>
        <motion.ul variants={ulVariants}>
          {navItems.map((item, key) => {
            return (
              <motion.li variants={liVariants} key={key}>
                <a href={`/${item}`}>{item}</a>
              </motion.li>
            );
          })}
        </motion.ul>
      </motion.nav>
    </Container>
  );
};

export default Nav;
