import React, { useEffect, useState } from 'react';
import LinkButton from '../../Components/Buttons/LinkButton';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBranch } from '../../Store/CreateSlices';
import { FaMapMarkerAlt, FaPhoneAlt, FaHome } from "react-icons/fa";
import { MdOutlineDirections } from "react-icons/md";
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const Branch=()=>{
       const { t, i18n } = useTranslation(); // <-- use i18n to change language

     const dispatch = useDispatch();
    const branches = useSelector(state => state.branch?.data);
    const [branchData, setBranchData] = useState([]);
    useEffect(() => {
        setBranchData(branches);
        }, [branches]);
        return (
          <div className="flex flex-col gap-6 p-4 md:p-6">
            {branchData.length > 0 ? (
              branchData.map((branch, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-6 p-6 transition duration-300 shadow-lg lg:flex-row bg-secoundBgColor rounded-3xl hover:shadow-xl"
                >
                  {/* Image Section */}
                  <img
                    src={branch.image_link}
                    className="object-cover w-full h-48 shadow-md md:w-64 rounded-xl"
                    alt={branch.name}
                  />
        
                  {/* Content Section */}
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-col gap-5">
                      {/* Branch Name */}
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-lg text-blue-500" />
                        <h1 className="text-2xl font-bold text-primaryColor">{branch.name}</h1>
                      </div>
        
                      {/* Address & Phone */}
                      <div className="flex flex-col gap-5 text-gray-700">
                        <div className="flex items-center gap-2">
                          <FaHome className="text-lg text-red-500" />
                          <span>{branch.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="text-lg text-green-500" />
                          <span>{branch.phone}</span>
                        </div>
                      </div>
                    </div>
        
                    {/* Direction Button */}
                    <div className="mt-5">
                      <Link
                        target="-blank"
                        className="flex items-center justify-center w-full gap-2 px-8 py-2 text-white transition-all duration-300 ease-in-out border-2 md:w-2/4 xl:w-1/4 bg-mainColor rounded-2xl hover:bg-transparent hover:text-mainColor border-mainColor"
                        to={branch.map}
                      >
                        <MdOutlineDirections className="text-lg" />
                         {t('GetDirections')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-lg text-center text-gray-500">{t("Nobranchesavailableatthemoment")}</p>
            )}
          </div>
        );        
}

export default Branch;