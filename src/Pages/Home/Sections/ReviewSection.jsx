import React from 'react'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const ReviewSection = () => {
                     const { t, i18n } = useTranslation(); // <-- use i18n to change language
       
       return (
              <>
                     <div className='px-12'>{t('ReviewSection')}</div>
              </>
       )
}

export default ReviewSection