import { useEffect, useState } from "react";
import DeleteIcon from "../../../assets/Icons/DeleteIcon";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { InputTextarea } from "primereact/inputtextarea";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProductCard } from "../../../Store/CreateSlices";
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

const Cart = ({
       // id,
       suppId,
       image,
       name,
       description,
       note,
       productPriceBase,
       productPrice,
       passProductPrice,
       tax,
       discount,
       addons,
       options,
       taxType,
       onDelete,
}) => {
       const [openNote, setOpenNote] = useState(null);
       const [noteDes, setNoteDes] = useState('');

       const items = useSelector((state) => state?.productsCard?.data || []);
       const dispatch = useDispatch();


       const handleOpenNote = (id) => {
              setOpenNote(id);
              setNoteDes('');
       };
       const handleCloseNote = () => {
              setOpenNote(null);
              setNoteDes('');
       };
       const handleAddNote = () => {
              if (!noteDes.trim()) return;
            
              const targetProduct = items.find((item) => item.numberId === suppId);

              if (targetProduct) {
                const updatedProduct = { ...targetProduct, note: noteDes };
                dispatch(UpdateProductCard(updatedProduct));
                console.log("✅ Note updated:", noteDes);
              }
              
            
              setOpenNote(null);
              setNoteDes('');
            };
            

       // useEffect(() => {
       //        {
       //               const updatedItems = items.map((item) =>
       //                      item.key === key ? { ...item, note: noteDes } : item
       //               );
       //               // Dispatch an action to update the state with updatedItems
       //               dispatch(UpdateProductCard(updatedItems));
       //        }
       // }, [noteDes])


       // // Calculate Total Food Price
       // const addonsPrice = addons.reduce((acc, addon) => acc + (Number(addon.price) || 0), 0);
       // // Calculate Total Food Price
       // const optionsPrice = options.reduce((acc, option) => acc + (Number(option.price) || 0), 0);

       // console.log('addonsPrice', addonsPrice)
                     const { t, i18n } = useTranslation(); // <-- use i18n to change language
       
       return (
              <div className="relative flex flex-col items-center w-full gap-4 p-4 shadow-md sm:h-52 xl:h-60 sm:flex-row bg-mainBgColor rounded-xl"
                     key={suppId}
              >
                     {/* Cart Image */}
                     <div className="relative w-3/12 h-full overflow-hidden shadow-md rounded-xl">
                            <img
                                   src={image || '/src/assets/Images/RedLogo.jsx'}
                                   className="object-cover object-center w-full h-full"
                                   alt="item"
                                   loading='lazy'
                            />
                            {/* Favorite Icon */}
                            {discount && (
                                   discount.type === 'precentage' ? (
                                          <span className='absolute w-full text-center -rotate-45 shadow-md top-6 -left-28 bg-mainBgColor text-mainColor sm:text-xl xl:text-2xl font-TextFontMedium'>{discount.amount || '0'}%</span>
                                   ) : (
                                          <span className='absolute w-full text-center -rotate-45 shadow-md top-7 -left-32 bg-mainBgColor text-mainColor sm:text-xl xl:text-2xl font-TextFontMedium'>{discount.amount || '0'}{t("EGP")}</span>
                                   )
                            )}
                     </div>

                     {/* Cart Details */}
                     <div className="flex flex-col items-start justify-between w-6/12 h-full">
                            <span className="sm:text-xl lg:text-2xl xl:text-5xl text-mainColor sm:font-TextFontMedium">{name || 'No name available'}</span>
                            <p className="text-base sm:text-lg lg:text-xl text-secoundColor font-TextFontRegular line-clamp-3">
                                   {description || 'No description available.'}
                            </p>
                            <div className="flex items-center justify-start gap-2">
                                   <span className="sm:text-2xl lg:text-3xl text-mainColor font-TextFontSemiBold">
                                          {productPrice} {t("EGP")}
                                   </span>
                            </div>
                     </div>

                     {/* Cart Actions */}
                     <div className="flex items-end justify-end h-full sm:w-4/12">
                            <button
                                   className="w-full px-6 py-2 text-white transition-all duration-300 ease-in-out border-2 sm:w-auto sm:text-lg lg:text-xl bg-mainColor rounded-2xl hover:bg-transparent hover:text-mainColor border-mainColor"
                                   onClick={() => handleOpenNote(suppId)}
                            >
                                   {t("AddNote")}
                            </button>
                            {openNote === suppId && (
                                   <Dialog open={true} onClose={handleCloseNote} className="relative z-10" aria-labelledby="dialog-title">
                                          <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                                          <div className="fixed inset-0 z-10 overflow-y-auto">
                                                 <div className="flex items-center justify-center min-h-screen">
                                                        <DialogPanel className="relative bg-white shadow-xl rounded-2xl sm:w-10/12 sm:max-w-lg">
                                                               <div className="px-4 sm:p-6">
                                                                      <h2 id="dialog-title" className="sm:text-2xl xl:text-3xl font-TextFontMedium text-mainColor">
                                                                             {t("AddYourNote")}
                                                                      </h2>
                                                                      <InputTextarea
                                                                             placeholder="Note ..." rows={4} cols={30}
                                                                             className="w-full p-2 mt-2 text-xl border-2 outline-none border-secoundColor rounded-xl focus:border-mainColor text-secoundColor sm:font-TextFontRegular xl:font-TextFontMedium"
                                                                             unstyled
                                                                             value={note || noteDes}
                                                                             onChange={(e) => setNoteDes(e.target.value)}
                                                                      />
                                                               </div>
                                                               <div className="px-4 pb-3 sm:flex sm:flex-row-reverse gap-x-4">
                                                                      <button
                                                                             type="button"
                                                                             onClick={handleCloseNote}
                                                                             className="px-4 py-2 mt-3 text-sm bg-white border-2 rounded-md sm:mt-0 sm:w-auto border-secoundColor font-TextFontMedium text-secoundColor hover:bg-gray-50"
                                                                      >
                                                                             {t("Close")}
                                                                      </button>
                                                                      <button
                                                                             type="button"
                                                                             onClick={handleAddNote}
                                                                             className="px-4 py-2 mt-3 text-sm text-white transition-all duration-300 border-2 rounded-md sm:mt-0 sm:w-auto border-mainColor font-TextFontMedium bg-mainColor hover:bg-white hover:text-mainColor"
                                                                      >
                                                                             {t("Add")}
                                                                      </button>
                                                               </div>
                                                        </DialogPanel>
                                                 </div>
                                          </div>
                                   </Dialog>
                            )}
                     </div>

                     {/* Delete Icon */}
                     <div className="absolute cursor-pointer top-3 right-3" onClick={() => onDelete(suppId)}>
                            <DeleteIcon width={40} height={40} />
                     </div>
                     {taxType === 'excluded' && tax && (
                            <div className="absolute right-0 flex items-center px-4 py-1 top-20 rounded-tl-2xl rounded-bl-2xl bg-mainColor ">
                                   <span className="text-white sm:text-xl lg:text-2xl font-TextFontMedium">
                                          {t("Tax")}: {tax.type === 'precentage' ? `${tax.amount}%` : `${tax.amount} EGP`}
                                   </span>
                            </div>
                     )}

              </div>
       );
};

export default Cart;
