import React from 'react'
import { FaHeart, FaPlus } from 'react-icons/fa'
import { LinkButton } from '../Components'
import { useAuth } from '../../Context/Auth'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProductsFilter } from '../../Store/CreateSlices'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

import {SubmitButton} from '../Components'
const CardItem = ({ product, index }) => {
       const auth = useAuth();
       const navigate = useNavigate();
       const { t, i18n } = useTranslation(); // <-- use i18n to change language

       const dispatch = useDispatch();
       const products = useSelector(state => state.productsFilter.data);
       const pickupLocation = useSelector(state => state.pickupLocation?.data || []); // Ensure it's an array or object

       const handleFavorite = (id) => {
              if (!auth.user) {
                     navigate('/auth/login', { replace: true })
              } else {
                     const updatedProducts = products.map((p) =>
                            p.id === id ? { ...p, favourite: !p.favourite } : p
                     );
                     dispatch(setProductsFilter(updatedProducts));
                     console.log('updatedProducts', updatedProducts);
                     console.log('id', id);
              }
       }

       const handleSendOrder = (id) => {

              if (!auth.user) {
                     auth.toastError('You must be logged in to continue.')
                     navigate('/auth/login', { replace: true })
                     return;
              }

              // Check if `pickupLocation` has data
              if (!pickupLocation || (Array.isArray(pickupLocation) && pickupLocation.length === 0)) {
                     auth.toastError('Please select a pickup location before proceeding.');
                     navigate(`/location`);
                     return;
              }  
                     
              else {
                    navigate(`/product/${product?.id}`)
              }
       }
       return (
              <div
                     className="flex flex-col min-h-[430px] md:max-h-[430px] items-start justify-between gap-y-2 bg-white rounded-2xl p-3 shadow-md w-full"
                     key={index}
              >
                     {/* Image */}
                     <div className="relative w-full overflow-hidden shadow-md rounded-xl min-h-56 md:max-h-56">
                            <img
                                   src={product?.image_link || '/src/assets/Images/RedLogo.jsx'}
                                   className="object-contain object-center w-full h-full "
                                   alt="item"
                                   loading='lazy'
                            />
                            {/* Favorite Icon */}
                            <button className="absolute top-4 right-5">
                                   <FaHeart className={`${product?.favourite ? 'text-mainColor': 'text-red-400'} hover:text-mainColor transition-all duration-200 text-2xl`} onClick={() => handleFavorite(product?.id)} />
                            </button>
                            {product?.discount && (

                                   product?.discount?.type === 'precentage' ? (
                                          <span className='absolute w-full text-xl text-center -rotate-45 shadow-md top-5 -left-28 bg-thirdBgColor text-mainColor font-TextFontMedium'>{product?.discount?.amount || '0'}%</span>
                                   ) : (
                                          <span className='absolute w-full text-xl text-center -rotate-45 shadow-md top-5 -left-28 bg-thirdBgColor text-mainColor font-TextFontMedium'>{product?.discount?.amount || '0'} EGP</span>
                                   )
                            )}
                     </div>

                     {/* Item Name */}
                     <span className='text-xl font-TextFontMedium text-mainColor '>
                            {product?.name || '-'}
                     </span>

                     {/* Item Description */}
                     <p className='w-full text-sm text-secoundColor font-TextFontRegular text-ellipsis overflow-hidden ...'>
                            {product?.description}
                     </p>

                     {/* Item Amount */}
                     <div className="flex items-center justify-start w-full gap-x-2 ">
                            {product?.discount?.type === 'precentage' ? (
                                   <>
                                          <span className="text-xl text-mainColor font-TextFontMedium">
                                                 {(product?.price - (product?.price * (product?.discount?.amount || 0) / 100)).toFixed(2)} {t('EGP')}
                                          </span>
                                          <span className="text-xl line-through text-secoundColor font-TextFontMedium decoration-secoundColor">
                                                 {product?.price?.toFixed(2) || '0.00'} {t('EGP')}
                                          </span>
                                   </>
                            ) : (
                                   <span className="text-xl text-mainColor font-TextFontMedium">
                                          {product?.price?.toFixed(2) || '0.00'} {t('EGP')}
                                   </span>
                            )}

                     </div>


                     {/* Buttons */}
                     <div className="flex items-center justify-between w-full gap-3">
                            <div className="flex items-center justify-center w-full">
                                   {/* <LinkButton width={true} to={`/product/${product?.id}`} text="Order Now" /> */}
                                   <SubmitButton text={t("OrderNow")} handleClick={() => handleSendOrder(product?.id)} />
                            </div>
                            {/* <button
                                   type="button"
                                   className="p-3 transition-all duration-300 ease-in-out border-2 rounded-lg text-mainColor border-mainColor hover:bg-mainColor hover:text-white"
                            >
                                   <FaPlus />
                            </button> */}
                     </div>
              </div>
       )
}

export default CardItem