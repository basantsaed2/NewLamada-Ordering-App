import React from 'react'
import { CardItem, LinkButton, SupTitle, TitleSection } from '../../../Components/Components'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const BestDealsSection = () => {
       const { t, i18n } = useTranslation(); // <-- use i18n to change language

       return (
              <>
                     <div className="flex flex-col items-start justify-start w-full px-12 gap-y-6">
                            <div className="w-full text-center">
                                   <TitleSection
                                          size={'5xl'}
                                          text={'Enjoy Our Best Deals'}
                                   />
                            </div>
                            <p className='w-full text-center sm:text-2xl xl:text-4xl font-TextFontMedium text-secoundColor'>
                                   {t("Don'tMissTheChanceToSavor")} <span className='text-mainColor'>{t("Delicious")}</span> {t("Dishes")}
                            </p>
                            <p className='w-full text-center sm:text-2xl xl:text-4xl font-TextFontMedium text-secoundColor'>
                                 {t("AtGreatPrices")} <span className='text-mainColor'>{t("SpecialOffersForALimitedTime")}</span>
                            </p>
                            <div className="flex flex-wrap items-center justify-start w-full gap-3 sm:flex-col sm:gap-5 lg:flex-row">
                                   {Array(6).fill(null).map((_, index) => (
                                          <CardItem key={index} />
                                   ))}

                            </div>
                            <LinkButton
                                   to={'/deals'}
                                   text={'View All Discounts'}
                            />
                     </div>
              </>
       )
}

export default BestDealsSection