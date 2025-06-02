import React from 'react'
import { Link } from 'react-router-dom'
import { LinkButton } from '../../../Components/Components'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const HeaderSection = () => {
              const { t, i18n } = useTranslation(); // <-- use i18n to change language
       
       return (
              <div className='relative overflow-hidden h-[90vh] flex flex-col sm:items-center xl:items-start sm:gap-y-20 xl:gap-y-12 px-12 sm:pt-12 xl:pt-24'>
                     <span className='mt-15 sm:text-center xl:text-start text-mainColor sm:text-3xl xl:text-5xl font-TextFontMedium sm:leading-relaxed xl:leading-relaxed'>{t("Lamada-FreshFlavors,UniqueExperience")} <br className='sm:hidden xl:block' />
                            {t("Experience")}
                     </span>
                     <p className='text-2xl text-secoundColor sm:text-center xl:text-start font-TextFontMedium sm:leading-loose xl:leading-relaxed'>{t("WelcometoLamada,wherefreshingredientsmeetdeliciousdishesinacozyatmosphere")} <br />
                            {t("meetdeliciousdishesinacozyatmosphere")}
                     </p>
                     {/* <div className=""> */}
                            <LinkButton
                                   to={'/favorites'}
                                   text={'Order Your Favorite Meal'}
                            />
                     {/* </div> */}
                     <img src="/src/assets/Images/pizza.png"
                            alt=""
                            className="absolute right-0 sm:hidden xl:block -bottom-15"
                     />
                     <img src="/src/assets/Images/burger.png"
                            alt=""
                            className="absolute right-0 sm:hidden xl:block top-10"
                     />
              </div>
       )
}

export default HeaderSection