

/*
import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'TYPO3',
    // Bypasses Webpack SVGR engine completely by using a plain absolute string path
    isStaticImage: true,
    imgPath: '/img/TYPO3-Logo-rgb.svg',
    description: (
      <>
        Using TYPO3 over 20 years already, I offer any service around this
        Content Management System (CMS). This includes updates, programming,
        new site-setups and much more.
      </>
    ),
  },
  {
    title: 'Static Websites',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        For documentation static websites became quite common, but every website which
        doesn't require server-side dynamic can be deployed as static. I've built many
        static websites and can help you with yours.
      </>
    ),
  },
  {
    title: 'General Web-development',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        My experience and knowledge enable me to work on many projects, either without any system
        or different systems. Central technologies and standards stretch beyond systems and systems are
        rather built on top of them.
      </>
    ),
  },
];

function Feature({Svg, isStaticImage, imgPath, title, description}) {
  const resolvedImgUrl = useBaseUrl(imgPath);

  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {isStaticImage ? (
          // Secure image handling for the complex TYPO3 asset
          <img 
            src={resolvedImgUrl} 
            className={styles.featureSvg} 
            alt={`${title} Logo`}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          // Standard fallback rendering behavior for default unDraw SVGs
          <Svg className={styles.featureSvg} role="img" />
        )}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

*/


import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'TYPO3',
    Svg: require('@site/static/img/TYPO3-Logo-rgb.svg').default,
    description: (
      <>
        Using TYPO3 over 20 years already, I offer any service around this
        Content Management System. (CMS), this includes updates, programming,
        new site-setups and much more.
      </>
    ),
  },
  {
    title: 'Static Websites',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        For documentation static websites became quite common, but every website which
        doesn't require server-side dynamic can be deployed as static. I've built many
        static websites and can help you with yours.
      </>
    ),
  },
  {
    title: 'General Web-development',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        My experience and knowledge enable me to work on many projects, either without any system
        or diferenet systems. Central Technolgies and standards stretch beyond systems and systems are
        rather built on top of them.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
