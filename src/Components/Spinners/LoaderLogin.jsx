import React from 'react'
import { PulseLoader } from 'react-spinners'
import RedLogo from '../../assets/Images/RedLogo'
import mainLogo from '../../assets/Images/mainLogo.jpeg'
import logo from '../../assets/Images/logo.jpg'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const LoaderLogin = () => {
              const { t, i18n } = useTranslation(); // <-- use i18n to change language
       
       return (
              <>
              <div>
                     <div className={`w-full h-full flex flex-col justify-center items-center`}>
                            <img src={logo} width={250} height={250} alt="Logo" />
                            <PulseLoader color='#c3171c' size={20} />
                     </div>

                      <div className="flex items-center justify-center gap-2 py-4 mt-10 border-t border-gray-300">
                            <h1 className="text-gray-600">{t("Poweredby")}</h1>
                            <img src={mainLogo} className="w-24 h-24" alt="Main Logo" />
                     </div>

              </div>
              </>
       )
}

export default LoaderLogin