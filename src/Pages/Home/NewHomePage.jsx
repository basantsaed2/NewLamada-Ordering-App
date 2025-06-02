import React from "react";
import MenuIcon from "../../assets/Icons/MenuIcon";
import DashIcon from "../../assets/Icons/DashIcon";
import AppleIcon from "../../assets/Icons/AppleIcon";
import GooglePlayIcon from "../../assets/Icons/GooglePlayIcon";
import mainLogo from '../../assets/Images/mainLogo.jpeg'
import logo from '../../assets/Images/logo.jpg'
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const NewHomePage=()=>{
      const { t, i18n } = useTranslation(); // <-- use i18n to change language
    
    return(
        <div>
         <div className={`w-full h-full flex flex-col md:flex-row pb-0 p-2 md:p-6 justify-center`}>

            <div className={`w-full md:w-1/2 h-full flex flex-col items-center`}>
                <img src={logo} width={180} height={180} alt="Main Logo" />
                 <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-semibold text-mainColor">{t("Lamada")}</h1>
                </div>
            </div>

            <div className={`w-full md:w-1/2 h-full flex flex-col gap-3 p-2 md:p-4 items-center justify-center`}>
                <div className="flex gap-5">
                    <Link to="/Lamada_menu" className="bg-[#c3171c1A] flex flex-col gap-3  items-center justify-center rounded-xl p-2 md:p-6">
                        <MenuIcon/>
                        <h1 className="text-2xl text-mainColor">{t("Menu")}</h1>
                    </Link>
                    <Link to="/location" className="bg-[#9E090F1A] flex flex-col gap-3  items-center justify-center rounded-xl p-2 md:p-6">
                        <DashIcon/>
                        <h1 className="text-2xl text-mainColor">{t("OrderNow")}</h1>
                    </Link>      
                </div>

                <div className="flex gap-1 p-4 pb-0">
                    <Link to="#" className="opacity-50 cursor-not-allowed">
                        <GooglePlayIcon/>
                    </Link>
                    <Link to="#" className="opacity-50 cursor-not-allowed">
                        <AppleIcon/>
                    </Link>      
                </div>
            </div>
        </div>

        <Link to="https://food2go.online/" target="_blank" className="flex items-center justify-center gap-2">
            <h1 className="text-gray-600">{t("Poweredby")}</h1>
            <img src={mainLogo} className="w-16 h-16" alt="Main Logo" />
        </Link>
        </div>
    )
}

export default NewHomePage;