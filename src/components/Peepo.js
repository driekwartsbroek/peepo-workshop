import React from 'react';

const Peepo = ({ head, body, accessory, headStyles, bodyStyles, accessoryStyles }) => {
  return (
    <svg className="peepo" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
      {body && (
        <image
          href={`/${body}`}
          className="peepo-part body-svg"
          x={bodyStyles[body]?.left}
          y={bodyStyles[body]?.top}
          width={bodyStyles[body]?.width}
          height={bodyStyles[body]?.height || '100%'}
        />
      )}
      <image
        href={`/${head}`}
        className="peepo-part head-svg"
        x={headStyles[head]?.left}
        y={headStyles[head]?.top}
        width={headStyles[head]?.width}
        height={headStyles[head]?.height || '100%'}
      />
      {accessory && (
        <image
          href={`/${accessory}`}
          className="peepo-part accessory-svg"
          x={accessoryStyles[accessory]?.left}
          y={accessoryStyles[accessory]?.top}
          width={accessoryStyles[accessory]?.width}
          height={accessoryStyles[accessory]?.height || '100%'}
        />
      )}
    </svg>
  );
};

export default Peepo;
