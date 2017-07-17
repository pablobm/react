import cn from 'classnames';
import Link from 'gatsby-link';
import React from 'react';
import styles from './Section.module.scss';
import slugify from '../../utils/slugify';

const toAnchor = (href = '') => {
  const index = href.indexOf('#');
  return index >= 0 ? href.substr(index) : '';
};

// TODO Update isActive link as document scrolls past anchor tags
// Maybe used 'hashchange' along with 'scroll' to set/update active links

// TODO Account for redirect_from URLs somehow; they currently won't match.

// HACK Use window.location instead because Gatsby's location.hash doesn't update
const isItemActive = item => {
  if (window.location.hash) {
    if (item.href) {
      return window.location.hash === toAnchor(item.href);
    }
  } else if (item.id.includes('html')) {
    return window.location.pathname.includes(item.id);
  } else {
    return window.location.pathname.includes(slugify(item.id));
  }
};

const Section = ({isActive, onClick, section}) => (
  <div className={styles.Section}>
    <h2 className={styles.Header}>
      <a
        className={cn(styles.HeaderLink, {
          [styles.ActiveHeaderLink]: isActive,
        })}
        onClick={onClick}>
        {section.title}
      </a>
    </h2>
    {isActive &&
      <ul className={styles.List}>
        {section.items.map(item => (
          <li key={item.id}>
            {CreateLink(item)}

            {item.subitems &&
              <ul className={styles.SubList}>
                {item.subitems.map(subitem => (
                  <li key={subitem.id}>
                    {CreateLink(subitem)}
                  </li>
                ))}
              </ul>}
          </li>
        ))}
      </ul>}
  </div>
);

const CreateLink = item => {
  if (item.id.includes('.html')) {
    return (
      <Link
        className={cn(styles.Link, {
          [styles.ActiveLink]: isItemActive(item),
        })}
        to={item.id}>
        {item.title}
      </Link>
    );
  } else if (item.forceInternal) {
    return (
      <Link
        className={cn(styles.Link, {
          [styles.ActiveLink]: isItemActive(item),
        })}
        to={toAnchor(item.href)}>
        {item.title}
      </Link>
    );
  } else if (item.href) {
    return (
      <a className={cn(styles.Link, styles.ExternalLink)} href={item.href}>
        {item.title}
      </a>
    );
  } else {
    return (
      <Link
        className={cn(styles.Link, {
          [styles.ActiveLink]: isItemActive(item),
        })}
        to={slugify(item.id)}>
        {item.title}
      </Link>
    );
  }
};

export default Section;