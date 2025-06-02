import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

// Default theme
import '@splidejs/react-splide/css';
import { LinkButton } from '../../../Components/Components';
import { Link } from 'react-router-dom';

const BannerSection = () => {
                       const { t, i18n } = useTranslation(); // <-- use i18n to change language
       
       return (
              <div className="flex flex-col items-center justify-start w-full px-12 py-8 space-y-4 text-white bg-mainColor">
                     {/* Banner Section */}
                     <h1 className="w-full leading-relaxed text-start sm:text-2xl xl:text-4xl font-TextFontMedium">
                            {t("Don'tMissOurSpecialDealsThisWeek!")}
                     </h1>
                     <p className='w-full py-8 text-start sm:text-xl xl:text-3xl font-TextFontRegular'>
{t("Enjoyupto30%offonthemostdeliciousdishes.Ordernowandsavoranunforgettablediningexperience!")}                     </p>

                     {/* Splide Carousel */}
                     <Splide
                            options={{
                                   type: 'loop',
                                   padding: '20%',
                                   autoplay: true,
                                   interval: 3000,
                                   perPage: 1,
                                   pauseOnHover: true,
                                   arrows: false,
                                   pagination: true, // Enables pagination
                                   gap: '1rem',
                            }}
                            aria-label="Banners Images"

                     >
                            <SplideSlide className='w-full overflow-hidden rounded-3xl'>
                                   <img src="/src/assets/Images/bannerImage1.png"
                                          className='object-cover w-full max-h-96'
                                          alt="banner" />
                            </SplideSlide>
                            <SplideSlide className='w-full overflow-hidden rounded-3xl'>
                                   <img src="/src/assets/Images/bannerImage1.png"
                                          className='object-cover w-full max-h-96'
                                          alt="banner" />
                            </SplideSlide>
                            <SplideSlide className='w-full overflow-hidden rounded-3xl'>
                                   <img src="/src/assets/Images/bannerImage1.png"
                                          className='object-cover w-full max-h-96'
                                          alt="banner" />
                            </SplideSlide>
                     </Splide>
                     {/* <div className="flex items-start justify-start w-full pt-5">
                            <Link to={'/'}
                                   className='px-8 py-2 text-center transition-all duration-300 ease-in-out bg-white border-2 sm:text-xl xl:text-2xl text-mainColor rounded-2xl hover:bg-transparent hover:text-white border-mainColor hover:border-white'
                            >
                                   Browse Deals
                            </Link>
                     </div> */}
              </div >
       );
};

export default BannerSection;