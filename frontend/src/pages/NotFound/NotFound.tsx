import React from 'react';
import styles from './notFound.module.scss';

export const NotFound = () => {
  return (
    <div>
      <div className={styles.notFound}>
        <span className={styles.notFound__404}>404</span>
        <div className={styles.notFound__error}>
          <span>😕</span>
          Такой страницы не существует
        </div>
      </div>
    </div>
  );
};

export default NotFound;
