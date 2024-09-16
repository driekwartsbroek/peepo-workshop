import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.svg';
import Peepo from './components/Peepo';
import 'bootstrap-icons/font/bootstrap-icons.css';
import arrowRightDefault from './arrow-right-default.svg';
import arrowRightHover from './arrow-right-hover.svg';
import eyeDefault from './eye-defult.svg';
import eyeSlash from './eye-slash.svg';
import Cloud01 from './Cloud 01.svg';
import Cloud02 from './Cloud 02.svg';
import logoAlt from './logo_alt.svg';
import packageJson from '../package.json';
import html2canvas from 'html2canvas';
import PeepoPlane from './peepo_plane.svg';
import PeepoPlane2 from './peepo_plane2.svg';
import clickSound from './sound_effect.wav';
import DownloadPngButton from './download png.svg';
import DownloadSvgButton from './download svg.svg';
import CopyrightIcon from './copyright.svg';

const peepoParts = {
  heads: [
    'head_love.svg',
    'head_smile_blush.svg',
    'head_sad_sweat.svg',
    'head_crying.svg',
    'head_happy.svg',
    'head_boobas.svg',
    'head_angry.svg',        // New head
    'head_interested.svg'    // New head
  ],
  bodies: ['body_blanket.svg', 'body_default.svg'],
  accessories: [
    'accessory_cup.svg',
    'accessory_magnifier.svg',
    'accessory_goggles.svg',
    'torch.svg'              // New accessory
  ],
};

const accessoryStyles = {
  'accessory_cup.svg': { left: '120px', top: '180px', width: '80px' },
  'accessory_magnifier.svg': { left: '45px', top: '30px', width: '180px' },
  'accessory_goggles.svg': { left: '90px', top: '30px', width: '240px' },
  'torch.svg': { left: '280px', top: '-20px', width: '100px' } // Style for the new accessory
};

const headStyles = {
  'head_love.svg': { left: '30px', top: '0', width: '260px' },
  'head_smile_blush.svg': { left: '30px', top: '13px', width: '260px' },
  'head_sad_sweat.svg': { left: '30px', top: '10px', width: '248px' },
  'head_crying.svg': { left: '28px', top: '12px', width: '250px' },
  'head_happy.svg': { left: '28px', top: '10px', width: '255px' },
  'head_boobas.svg': { left: '28px', top: '0px', width: '285px' },
  'head_angry.svg': { left: '30px', top: '5px', width: '270px' }, // New head
  'head_interested.svg': { left: '30px', top: '10px', width: '260px' } // New head
};

const bodyStyles = {
  'body_blanket.svg': { left: '0px', top: '120px', width: '400px' },
  'body_default.svg': { left: '30px', top: '100px', width: '250px' },
};

const CustomCycleButton = ({ direction, onClick, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const src = isHovered ? arrowRightHover : arrowRightDefault;
  const style = direction === 'left' ? { transform: 'scaleX(-1)' } : {};

  const handleClick = () => {
    playSound();
    onClick();
  };

  return (
    <button
      className={`custom-cycle-button ${className || ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={src} alt={`Cycle ${direction}`} style={style} />
    </button>
  );
};

const CustomVisibilityButton = ({ isVisible, onClick, className }) => {
  const handleClick = () => {
    playSound();
    onClick();
  };

  return (
    <button className={`custom-visibility-button ${className || ''}`} onClick={handleClick}>
      <img src={isVisible ? eyeDefault : eyeSlash} alt="Toggle visibility" />
    </button>
  );
};

const loadSvg = async (url) => {
  const response = await fetch(url);
  const svgText = await response.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  return svgElement;
};

const playSound = () => {
  const audio = new Audio(clickSound);
  audio.play().catch(error => console.error('Error playing sound:', error));
};

function App() {
  const [headIndex, setHeadIndex] = useState(0);
  const [bodyIndex, setBodyIndex] = useState(0);
  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const [showBody, setShowBody] = useState(true);
  const [showAccessory, setShowAccessory] = useState(true);
  const [currentLogo, setCurrentLogo] = useState(logo);
  const [currentPlane, setCurrentPlane] = useState(PeepoPlane);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLogo(prevLogo => prevLogo === logo ? logoAlt : logo);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const planeIntervalId = setInterval(() => {
      setCurrentPlane(prevPlane => prevPlane === PeepoPlane ? PeepoPlane2 : PeepoPlane);
    }, 500);

    return () => clearInterval(planeIntervalId);
  }, []);

  const cycleIndex = (current, max, setter, direction) => {
    setter((current + direction + max) % max);
  };

  const downloadPeepo = async (format) => {
    const peepoContainer = document.querySelector('.peepo-container');
    const svgElement = peepoContainer.querySelector('svg');

    // Create a deep clone of the SVG
    const clonedSvg = svgElement.cloneNode(true);

    // Set a fixed size for the SVG
    clonedSvg.setAttribute('width', '600');
    clonedSvg.setAttribute('height', '600');

    // Remove any transform attributes from the cloned SVG
    clonedSvg.removeAttribute('transform');

    // Fetch and embed all images
    const images = clonedSvg.querySelectorAll('image');
    for (const img of images) {
      const href = img.getAttribute('href');
      const response = await fetch(href);
      const blob = await response.blob();
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = () => {
          img.setAttribute('href', reader.result);
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    }

    // Inline all styles
    const styles = document.styleSheets;
    let stylesText = '';
    for (let i = 0; i < styles.length; i++) {
      try {
        const rules = styles[i].cssRules || styles[i].rules;
        for (let j = 0; j < rules.length; j++) {
          stylesText += rules[j].cssText;
        }
      } catch (e) {
        console.warn('Can\'t read the css rules of: ' + styles[i].href, e);
      }
    }
    const styleElement = document.createElement('style');
    styleElement.textContent = stylesText;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

    // Convert the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);

    // Create a Blob with the SVG string
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

    if (format === 'svg') {
      // Download as SVG
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'my-peepo.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // Convert to PNG and download
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'my-peepo.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
      img.src = URL.createObjectURL(svgBlob);
    }
  };

  return (
    <div className="App">
      <div className="clouds">
        <img src={Cloud01} alt="Cloud 1" className="cloud cloud-1" />
        <img src={Cloud02} alt="Cloud 2" className="cloud cloud-2" />
      </div>
      <img src={currentPlane} alt="Peepo Plane" className="plane" />
      <img src={currentLogo} className="App-logo" alt="logo" />
      <div className="peepo-outer-container">
        <div className="peepo-container">
          <Peepo
            head={peepoParts.heads[headIndex]}
            body={showBody ? peepoParts.bodies[bodyIndex] : null}
            accessory={showAccessory ? peepoParts.accessories[accessoryIndex] : null}
            headStyles={headStyles}
            bodyStyles={bodyStyles}
            accessoryStyles={accessoryStyles}
          />
        </div>
      </div>
      <div className="download-buttons-container">
        <div className="download-buttons">
          <button className="download-button" onClick={() => downloadPeepo('png')}>
            <img src={DownloadPngButton} alt="Download PNG" />
          </button>
          <button className="download-button" onClick={() => downloadPeepo('svg')}>
            <img src={DownloadSvgButton} alt="Download SVG" />
          </button>
        </div>
      </div>
      <div className="peepo-controls">
        <div className="control-group">
          <CustomCycleButton direction="left" onClick={() => cycleIndex(headIndex, peepoParts.heads.length, setHeadIndex, -1)} />
          <CustomCycleButton direction="right" onClick={() => cycleIndex(headIndex, peepoParts.heads.length, setHeadIndex, 1)} className="right-button" />
        </div>
        <div className="control-group">
          <CustomCycleButton direction="left" onClick={() => cycleIndex(bodyIndex, peepoParts.bodies.length, setBodyIndex, -1)} />
          <CustomCycleButton direction="right" onClick={() => cycleIndex(bodyIndex, peepoParts.bodies.length, setBodyIndex, 1)} className="right-button" />
          <CustomVisibilityButton isVisible={showBody} onClick={() => setShowBody(!showBody)} className="visibility-button" />
        </div>
        <div className="control-group">
          <CustomCycleButton direction="left" onClick={() => cycleIndex(accessoryIndex, peepoParts.accessories.length, setAccessoryIndex, -1)} />
          <CustomCycleButton direction="right" onClick={() => cycleIndex(accessoryIndex, peepoParts.accessories.length, setAccessoryIndex, 1)} className="right-button" />
          <CustomVisibilityButton isVisible={showAccessory} onClick={() => setShowAccessory(!showAccessory)} className="visibility-button" />
        </div>
      </div>
      <footer className="footer">
        <img src={CopyrightIcon} alt="Copyright" style={{ width: '650px', height: '20px' }} />
      </footer>
    </div>
  );
}

export default App;