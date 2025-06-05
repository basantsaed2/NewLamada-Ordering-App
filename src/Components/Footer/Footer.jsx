import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt,FaFacebookF, FaInstagram, FaApple, FaGooglePlay } from 'react-icons/fa';
// import RedLogo from '../../Assets/Images/RedLogo';
import WhiteLogo from '../../assets/Images/WhiteLogo';
import { Link } from 'react-router-dom';
import mainLogo from '../../assets/Images/mainLogo.jpeg'
import logo from '../../assets/Images/logo.jpg'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const Footer = () => {
         const { t, i18n } = useTranslation(); // <-- use i18n to change language
  
  return (
      <div className="w-full py-8 text-white footer bg-mainColor">
    <div className="w-full max-w-6xl px-5 mx-auto">
      {/* Logo Section */}
      <div className="flex items-center mb-6 gap-x-3">
      <img src={logo} width={50} height={50} alt="Logo" />
      <span className="text-3xl font-semibold">{t("Lamada")}</span>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Connect Us Section */}
        <div className="content">
          <h2 className="mb-4 text-lg font-bold text-white">{t("ConnectWithUs")}</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
                <FaPhoneAlt className="p-2 text-3xl bg-white rounded-full text-mainColor"  />
                 <span>{t("Phone")}: 035559288</span>
               </li>
               <li className="flex items-center space-x-2">
                 <FaWhatsapp className="p-2 text-3xl bg-white rounded-full text-mainColor"  />
                 <span>WhatsApp: +201069470088</span>
              </li>
               {/* <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="p-2 text-3xl bg-white rounded-full text-mainColor" />
                <span>{t("Address")}: Al Garok, Fleming, Qism El-Raml, Alexandria Governorate, Egypt</span>
              </li> */}
          </ul>
          {/* Social Media Links */}
          <div className="flex mt-4 space-x-4">
            <Link
              to="https://www.facebook.com/share/1QhHMNt95o/?mibextid=qi2Omg"
              target="_blank"
              className="p-3 transition duration-300 bg-white rounded-full text-mainColor hover:bg-gray-300"
            >
              <FaFacebookF className="text-xl" />
            </Link>
            <Link
              to="https://www.instagram.com/lamada.fastfood?igsh=MTN1Y2dqOGpsdWw4dA=="
              target="_blank"
              className="p-3 transition duration-300 bg-white rounded-full text-mainColor hover:bg-gray-300"
            >
              <FaInstagram className="text-xl" />
            </Link>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="content">
          <h2 className="mb-4 text-lg font-bold text-white">{t("Pages")}</h2>
        <ul className="flex flex-row gap-4 mt-4 md:flex-col">
        {[t("Home"), t("Menu"), t("contactUs")].map((page, index) => (  
          <li key={index}>
            <NavLink
              to={page === "Menu" ? "Lamada_menu" : page.toLowerCase().replace(" ", "_")}
              className={({ isActive }) =>
                `text-white hover:text-gray-300 transition duration-300 
                ${isActive ? "text-white font-semibold underline" : ""}`
              }
            >
              {page}
            </NavLink>
          </li>
        ))}
          </ul>
        </div>

        {/* Mobile Section */}
        <div className="content">
          <h2 className="mb-4 text-lg font-bold text-white">{t("DownloadOurApp")}</h2>
          <div className="space-y-3">
          <Link to="https://apps.apple.com/eg/app/lamada/id6553989792" target='_blank' className="flex items-center px-4 py-2 space-x-4 transition duration-300 border border-white rounded-lg opacity-50 cursor-not-allowed hover:bg-white hover:text-mainColor">
              <FaApple className="text-2xl" />
              <span className="text-sm">App Store</span>
            </Link>
            <Link to="" className="flex items-center px-4 py-2 space-x-4 transition duration-300 border border-white rounded-lg opacity-50 cursor-not-allowed hover:bg-white hover:text-mainColor">
            <FaGooglePlay className="text-2xl" />
              <span className="text-sm">Google Play</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <Link to="https://food2go.online/" target="_blank" className="flex items-center justify-center gap-2 pt-4 mt-2 text-sm border-t border-white">
        <p>©2025 . All rights reserved</p>
        <h1 className="text-lg font-semibold text-white">Lamada</h1>
        </Link>
    </div>
  </div>
  );
};

export default Footer;
