// import React, { useEffect, useId, useState } from 'react'
// import { LuTimer } from 'react-icons/lu';
// import { TbTruckDelivery } from 'react-icons/tb';
// import { replace, useNavigate, useParams } from 'react-router-dom'
// import { TriStateCheckbox } from 'primereact/tristatecheckbox';
// import { Checkbox, SubmitButton } from '../../Components/Components';
// import { IoAddCircleSharp } from 'react-icons/io5';
// import { IoIosRemoveCircle } from 'react-icons/io';
// import { useDispatch, useSelector } from 'react-redux';
// import { setProductsCard } from '../../Store/CreateSlices';

// const ProductDetails = () => {
//        const { productId } = useParams();
//        const uniqueId = useId();
//        const dispatch = useDispatch();
//        const navigate = useNavigate();
//        const products = useSelector(state => state.productsFilter.data)
//        const product = products.find((product) => product.id === Number(productId))
//        // State to track checked Exclude
//        const [checkedExclude, setCheckedExclude] = useState([]);
//        // State to track checked Extra
//        const [checkedExtra, setCheckedExtra] = useState([]);
//        // State to track checked Addons
//        const [checkedAddons, setCheckedAddons] = useState([]);

//        // State to track Varition Option
//        const [variationList, setVariationList] = useState([]);
//        const [options, setOptions] = useState([]);
//        const [selectedExtras, setSelectedExtras] = useState([]);
//        const [productPrice, setProductPrice] = useState(0);

//        const [productCard, setProductCard] = useState({})

//        const [finalPrice, setFinalPrice] = useState(0);
//        const [countProduct, setCountProduct] = useState(1);

//        const totalPrice = (countProduct * finalPrice).toFixed(2);  // Calculate total price based on countProduc
//        const totalPriceProduct = (countProduct * productPrice).toFixed(2);  // Calculate total price based on countProduc

//        // Functions to handle the count change
//        const increment = () => {
//               setCountProduct((prev) => {
//                      const newCount = prev + 1;
//                      return newCount; // Return the updated count
//               });
//        };

//        const decrement = () => {
//               if (countProduct > 0) {
//                      setCountProduct((prev) => prev - 1);
//               }
//        };




//        useEffect(() => { setProductPrice(product?.price?.toFixed(2)) }, [product])
//        useEffect(() => { console.log('variationList', variationList) }, [variationList])


//        const handleCheckedExclude = (excludeId) => {
//               setCheckedExclude((prev) => {
//                      // Check if the Exclude is already selected
//                      if (prev.includes(excludeId)) {
//                             // If yes, remove it from the array
//                             return prev.filter((id) => id !== excludeId);
//                      } else {
//                             // If not, add it to the array
//                             return [...prev, excludeId];
//                      }
//               });
//        };

//        const handleCheckedExtra = (extraId, extraPrice) => {
//               setCheckedExtra((prev) => {
//                      const existingExtra = prev.find((extra) => extra.id === extraId);
//                      if (existingExtra) {
//                             // Remove the extra if it's already selected
//                             return prev.filter((extra) => extra.id !== extraId);
//                      } else {
//                             // Add the extra with its price
//                             return [...prev, { id: extraId, price: extraPrice }];
//                      }
//               });
//        };

//        // Update the handleCheckedAddons to manage count properly
//        const handleCheckedAddons = (addonId, addonPrice) => {
//               setCheckedAddons((prev) => {
//                      const existingAddon = prev.find((addon) => addon.id === addonId);
//                      console.log('addonPrice', addonPrice)

//                      if (existingAddon) {
//                             // // If addon exists, increment its count
//                             // return prev.map((addon) =>
//                             //        addon.id === addonId
//                             //               ? { ...addon, count: addon.count + 1 }  // Increase count
//                             //               : addon
//                             // );
//                             // If addon exists, remove it (uncheck)
//                             return prev.filter((addon) => addon.id !== addonId);
//                      } else {
//                             // If addon doesn't exist, add it with an initial count of 1
//                             return [...prev, { id: addonId, count: 1, price: addonPrice }];
//                      }

//               });
//        };

//        const incrementCount = (addonId) => {
//               setCheckedAddons((prev) =>
//                      prev.map((addon) =>
//                             addon.id === addonId
//                                    ? { ...addon, count: addon.count + 1 }  // Increase count
//                                    : addon
//                      )
//               );
//        };

//        const decrementCount = (addonId) => {
//               setCheckedAddons((prev) =>
//                      prev.reduce((result, addon) => {
//                             if (addon.id === addonId) {
//                                    if (addon.count > 1) {
//                                           // If count > 1, decrement it
//                                           result.push({ ...addon, count: addon.count - 1 });
//                                    }
//                                    // If count is 1, remove the addon from the list
//                                    else {
//                                           // Do not include the addon
//                                    }
//                             } else {
//                                    result.push(addon);  // Keep all other addons unchanged
//                             }
//                             return result;
//                      }, [])
//               );
//        };


//        // Helper function to calculate the total price of checked items (addons, extras, etc.)
//        const calculateTotalPriceAddons = (items, key = 'price') =>
//               items.reduce((total, item) => total + (item?.[key] || 0) * item.count, 0);  // Multiply by count for addons

//        const calculateTotalPrice = (items, key = 'price') =>
//               items.reduce((total, item) => total + (item?.[key] || 0), 0);

//        // Handle selecting or deselecting an option
//        const handleSetOption = (selectedOption, variation) => {
//               setOptions((prev) => {
//                      const exists = prev.some((option) => option.id === selectedOption.id);
//                      let newOptions;

//                      if (variation.type === 'single') {
//                             // Single-selection: Replace the current option
//                             newOptions = exists ? [] : [selectedOption];
//                             setVariationList([{ variation_id: variation.id, option_id: selectedOption.id }]);
//                      } else if (variation.type === 'multiple') {
//                             // Multi-selection: Add or remove options
//                             newOptions = exists
//                                    ? prev.filter((option) => option.id !== selectedOption.id)
//                                    : [...prev, selectedOption];

//                             setVariationList((prevList) => {
//                                    const existingVariation = prevList.find((item) => item.variation_id === variation.id);

//                                    if (exists) {
//                                           // If the selected option exists, remove it
//                                           return prevList.map((item) =>
//                                                  item.variation_id === variation.id
//                                                         ? {
//                                                                ...item,
//                                                                option_id: item.option_id.filter((id) => id !== selectedOption.id),
//                                                         }
//                                                         : item
//                                           );
//                                    } else if (existingVariation) {
//                                           // If the variation already exists, add the option to the option_id array
//                                           return prevList.map((item) =>
//                                                  item.variation_id === variation.id
//                                                         ? {
//                                                                ...item,
//                                                                option_id: [...new Set([...item.option_id, selectedOption.id])],
//                                                         }
//                                                         : item
//                                           );
//                                    } else {
//                                           // If the variation doesn't exist, add a new object
//                                           return [
//                                                  ...prevList,
//                                                  {
//                                                         variation_id: variation.id,
//                                                         option_id: [selectedOption.id],
//                                                  },
//                                           ];
//                                    }
//                             });

//                      }

//                      return newOptions; // Update options state
//               });

//               if (variation.type === 'single') {
//                      setSelectedExtras([]); // Clear extras for single variations
//               }
//        };

//        // Handle selecting or deselecting an extra
//        const handleSetExtra = (extra) => {
//               setSelectedExtras((prev) => {
//                      const exists = prev.some((item) => item.id === extra.id);

//                      const updatedExtras = exists
//                             ? prev.filter((item) => item.id !== extra.id) // Remove the extra
//                             : [...prev, extra]; // Add the extra

//                      return updatedExtras; // Update extras state
//               });
//        };

//        // Centralized calculation of the final price
//        useEffect(() => {
//               const calculateRawTotalPrice = () => {
//                      const basePrice = product?.price || 0;
//                      const extraPrice = calculateTotalPrice(selectedExtras);
//                      const optionsPrice = calculateTotalPrice(options);

//                      return basePrice + extraPrice + optionsPrice;
//               };

//               // Calculate addonPrice and extraProductPrice separately
//               const addonPrice = calculateTotalPriceAddons(checkedAddons); // Include count in price calculation
//               const extraProductPrice = calculateTotalPrice(checkedExtra);

//               const rawTotalPrice = calculateRawTotalPrice();

//               // Discounted price calculation: apply discount only on rawTotalPrice (base + extras + options)
//               const discountedPrice =
//                      product?.discount?.type === 'precentage'
//                             ? rawTotalPrice - (rawTotalPrice * (product?.discount?.amount || 0)) / 100
//                             : rawTotalPrice - (product?.discount?.amount || 0);


//               console.log('rawTotalPrice:', rawTotalPrice);
//               console.log('discountedPrice:', discountedPrice);

//               // Calculate finalPrice
//               const finalPrice =
//                      discountedPrice +
//                      addonPrice +
//                      extraProductPrice;

//               console.log('finalPrice:', finalPrice);

//               // Update prices in state
//               setProductPrice(rawTotalPrice.toFixed(2)); // Update raw price
//               setFinalPrice(finalPrice.toFixed(2)); // Update final price
//        }, [options, selectedExtras, checkedAddons, checkedExtra, product, countProduct]);




//        useEffect(() => { console.log('checkedExclude', checkedExclude) }, [checkedExclude])
//        useEffect(() => { console.log('checkedExtra', checkedExtra) }, [checkedExtra])
//        useEffect(() => { console.log('checkedAddons', checkedAddons) }, [checkedAddons])
//        useEffect(() => { console.log('options', options) }, [options])
//        useEffect(() => { console.log('OptionExtras', selectedExtras) }, [selectedExtras])
//        useEffect(() => { console.log('Final Price:', finalPrice); }, [finalPrice])

//        useEffect(() => { console.log('products', products) }, [products])
//        useEffect(() => { console.log('product', product) }, [product])






//        const handleAddProduct = (product) => {


//               const newProduct = {
//                      productId: product.id,
//                      numberId: Number(Math.floor(Math.random() * 1000)),
//                      name: product.name,
//                      description: product.description,
//                      image: product.image_link,
//                      addons: checkedAddons,
//                      extraProduct: checkedExtra,
//                      extraOptions: selectedExtras,
//                      excludes: checkedExclude,
//                      variations: variationList,
//                      options: options,
//                      note: '',
//                      tax: product?.tax,
//                      discount: product.discount,
//                      passProductPrice: product.price + calculateTotalPriceAddons(checkedAddons) + calculateTotalPrice(options) + calculateTotalPrice(selectedExtras),
//                      passPrice: product.price,
//                      total: totalPrice - calculateTotalPrice(checkedExtra),
//                      count: countProduct,
//               };

//               dispatch(setProductsCard(newProduct));
//               navigate('/cart', { replace: true });
//        };



//        useEffect(() => { console.log('productCard', productCard) }, [productCard])

//        return (
//               <>
//                      <div className="flex items-start justify-between w-full sm:flex-col-reverse xl:flex-row sm:h-full gap-7 ">
//                             {/* Details Side */}
//                             <div className="flex flex-col sm:w-full xl:w-6/12 sm:h-auto xl:h-full sm:pl-5 xl:pl-8 sm:pr-5 xl:pr-0 gap-y-6 xl:mt-12 ">
//                                    {/* Title && Price */}
//                                    <div className="flex flex-col items-start w-full gap-y-5">
//                                           <span className='w-full sm:text-3xl xl:text-5xl font-TextFontMedium text-mainColor'>{product?.name || ''}</span>
//                                           <div className="flex items-center justify-start w-full gap-x-2 ">
//                                                  <div>
//                                                         {/* {product?.discount?.type === 'precentage' ? (
//                                                                <div className='flex items-center gap-2'>
//                                                                       <>
//                                                                              <span className="sm:text-3xl lg:text-5xl text-mainColor font-TextFontMedium">
//                                                                                     {totalPrice} EGP
//                                                                              </span>
//                                                                              <span className="line-through sm:text-3xl lg:text-5xl text-secoundColor font-TextFontMedium decoration-secoundColor">
//                                                                                     {totalPriceProduct} EGP
//                                                                              </span>
//                                                                       </>
//                                                                </div>
//                                                         ) : (
//                                                                <span className="sm:text-3xl lg:text-5xl text-mainColor font-TextFontMedium">
//                                                                       {totalPrice} EGP
//                                                                </span>
//                                                         )} */}
//                                                         <span className="sm:text-3xl lg:text-5xl text-mainColor font-TextFontMedium">
//                                                                {totalPrice} EGP
//                                                         </span>
//                                                  </div>

//                                           </div>
//                                    </div>
//                                    {/* Details && Description */}
//                                    <div className="flex flex-col items-start justify-start w-full gap-y-4">
//                                           <p className='text-2xl text-secoundColor font-TextFontRegular'>
//                                                  <span className='mr-1 text-mainColor font-TextFontMedium'>Ingridents:</span>
//                                                  {product?.description}
//                                           </p>
//                                           {/* <p className='text-2xl text-secoundColor font-TextFontRegular '>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
//                                    </div>
//                                    {/* Time && Type */}
//                                    <div className="flex items-center justify-start w-full gap-x-3">
//                                           <div className="flex items-center gap-2">
//                                                  <TbTruckDelivery className='text-3xl text-mainColor' />
//                                                  <span className='text-3xl text-secoundColor'>Free</span>
//                                           </div>
//                                           <div className="flex items-center gap-2">
//                                                  <LuTimer className='text-3xl text-mainColor' />
//                                                  <span className='text-3xl text-secoundColor'>20 min</span>
//                                           </div>
//                                    </div>
//                                    {/* Extras */}
//                                    {product?.extra?.length !== 0 && (
//                                           <div className="flex flex-col items-start justify-start w-full ">
//                                                  <span className='text-3xl text-mainColor font-TextFontRegular'>Extra:</span>
//                                                  <div className="flex flex-wrap items-center justify-start w-full gap-3">
//                                                         {product?.extra?.map((x, index) => (
//                                                                <div className="flex items-center justify-center" key={index}>
//                                                                       <Checkbox
//                                                                              handleChecked={() => handleCheckedExtra(x.id, x.price)}
//                                                                              isChecked={checkedExtra.some((extra) => extra.id === x.id)}
//                                                                       />
//                                                                       <span className="mt-3 text-xl font-TextFontRegular text-secoundColor">
//                                                                              {x?.name} - {x?.price?.toFixed(2)} EGP
//                                                                       </span>
//                                                                </div>
//                                                         ))}

//                                                  </div>
//                                           </div>
//                                    )}
//                                    {/* Excludes */}
//                                    {product?.excludes?.length !== 0 && (
//                                           <div className="flex flex-col items-start justify-start w-full ">
//                                                  <span className='text-3xl text-mainColor font-TextFontRegular'>Exclude:</span>
//                                                  <div className="flex flex-wrap items-center justify-start w-full gap-3">
//                                                         {product?.excludes?.map((exclude, index) => (

//                                                                <div className="flex items-center justify-center"
//                                                                       key={index}
//                                                                >
//                                                                       <Checkbox
//                                                                              handleChecked={() => handleCheckedExclude(exclude.id)}
//                                                                              isChecked={checkedExclude.includes(exclude.id)}
//                                                                       />
//                                                                       <span className='mt-3 text-xl font-TextFontRegular text-secoundColor'>{exclude?.name}</span>
//                                                                </div>
//                                                         ))}
//                                                  </div>
//                                           </div>
//                                    )}
//                                    {/* Addons */}
//                                    {product?.addons?.length !== 0 && (
//                                           <div className="flex flex-col items-start justify-start w-full ">
//                                                  <span className='text-3xl text-mainColor font-TextFontRegular'>Addons:</span>
//                                                  <div className="flex flex-col items-start justify-start w-full gap-3">
//                                                         {product?.addons.map((addon) => (
//                                                                <div key={addon.id} className="flex items-center justify-start gap-2 ">
//                                                                       <Checkbox
//                                                                              handleChecked={() => handleCheckedAddons(addon.id, addon.price)}
//                                                                              isChecked={!!checkedAddons.find((item) => item.id === addon.id)}
//                                                                       />

//                                                                       <span className="mt-3 text-xl font-TextFontRegular text-secoundColor">
//                                                                              {addon?.name} - {addon?.price?.toFixed(2)} EGP
//                                                                       </span>

//                                                                       {checkedAddons.find((item) => item.id === addon.id) && (
//                                                                              <div className="flex items-center justify-center gap-2 mt-2">
//                                                                                     {addon?.recommended !== 0 && (
//                                                                                            <IoIosRemoveCircle
//                                                                                                   className="text-3xl cursor-pointer text-mainColor"
//                                                                                                   onClick={() => decrementCount(addon.id)}
//                                                                                            />
//                                                                                     )}
//                                                                                     <span className="text-2xl text-mainColor font-TextFontRegular">
//                                                                                            {checkedAddons.find((item) => item.id === addon.id).count}
//                                                                                     </span>
//                                                                                     {addon?.recommended !== 0 && (

//                                                                                            <IoAddCircleSharp
//                                                                                                   className="text-3xl cursor-pointer text-mainColor"
//                                                                                                   onClick={() => incrementCount(addon.id)}
//                                                                                            />
//                                                                                     )}
//                                                                              </div>
//                                                                       )}
//                                                                </div>
//                                                         ))}
//                                                  </div>
//                                           </div>
//                                    )}
//                                    {/* Variations */}
//                                    {product?.variations?.length !== 0 && (
//                                           <div className="flex flex-col items-start justify-start w-full gap-3">
//                                                  {product?.variations.map((variation, index) => (
//                                                         <div className="flex flex-wrap items-center justify-start w-full gap-2" key={index}>
//                                                                <span className="text-3xl text-mainColor font-TextFontRegular">{variation?.name}:</span>
//                                                                <div className="flex flex-wrap items-start justify-start w-full gap-3 sm:flex-row lg:flex-row">
//                                                                       {variation?.options.map((option) => (
//                                                                              <div className='flex flex-col items-start justify-start gap-y-4' key={option.id}>
//                                                                                     <div className="flex items-start justify-start">
//                                                                                     <span
//                                                                                     className={`text-2xl font-TextFontRegular border-2 border-mainColor rounded-xl py-2 px-3 transition-all duration-300 ease-in-out 
//                                                                                     ${option.status === 0 
//                                                                                     ? 'opacity-30 cursor-not-allowed'  // Disable click and add opacity
//                                                                                     : options.some((opt) => opt.id === option.id)
//                                                                                            ? 'bg-mainColor text-white shadow-lg' // Selected state
//                                                                                            : 'bg-white text-mainColor hover:bg-mainColor hover:text-white cursor-pointer' // Normal state
//                                                                                     }`}
//                                                                                     onClick={option.status !== 0 ? () => handleSetOption(option, variation) : undefined} // Prevent clicks
//                                                                                     >
//                                                                                     {option.name}
//                                                                                     </span>
//                                                                                     </div>

//                                                                                     {/* Show extras when option is selected */}
//                                                                                     {option?.extra.length !== 0 && (
//                                                                                            variation.type === 'single' && options.some((opt) => opt.id === option.id) && (
//                                                                                                   <div className="flex flex-col items-start justify-start gap-y-2">

//                                                                                                          {option?.extra?.map((ex, index) => (
//                                                                                                                 <div className="flex items-center gap-2" key={index}>
//                                                                                                                        <span className="text-2xl text-mainColor font-TextFontm">Extra:</span>
//                                                                                                                        <span
//                                                                                                                               className={`text-xl font-TextFontRegular border-2 border-mainColor rounded-xl py-2 px-3 cursor-pointer transition-all duration-300 ease-in-out 
//             ${selectedExtras.some((selected) => selected.id === ex.id)
//                                                                                                                                             ? 'bg-mainColor text-white shadow-lg' // Selected extra styling
//                                                                                                                                             : 'bg-white text-mainColor hover:bg-mainColor hover:text-white'
//                                                                                                                                      }`}
//                                                                                                                               onClick={() => handleSetExtra(ex)}
//                                                                                                                        >
//                                                                                                                               {ex.name}
//                                                                                                                        </span>
//                                                                                                                 </div>
//                                                                                                          ))}


//                                                                                                   </div>
//                                                                                            )
//                                                                                     )}

//                                                                              </div>
//                                                                       ))}
//                                                                </div>
//                                                         </div>
//                                                  ))}

//                                           </div>
//                                    )}
//                                    {/* Add Product */}
//                                    <div className="flex items-center justify-between w-full">
//                                           <div className="w-8/12">
//                                                  <SubmitButton text='Add To Card' handleClick={() => handleAddProduct(product)} />
//                                           </div>

//                                           <div className="flex items-center justify-center w-3/12 gap-4">
//                                                  {/* Decrement button */}
//                                                  <IoIosRemoveCircle
//                                                         className={`text-mainColor text-5xl cursor-pointer transition-all duration-200 ease-in-out ${countProduct === 1 ? 'opacity-50 cursor-not-allowed' : ''
//                                                                }`}
//                                                         onClick={countProduct > 1 ? decrement : undefined}
//                                                  />

//                                                  {/* Product count */}
//                                                  <span className="text-5xl text-mainColor font-TextFontRegular">{countProduct}</span>

//                                                  {/* Increment button */}
//                                                  <IoAddCircleSharp
//                                                         className="text-5xl transition-all duration-200 ease-in-out cursor-pointer text-mainColor"
//                                                         onClick={increment}
//                                                  />
//                                           </div>

//                                    </div>
//                             </div>
//                             {/* Image Side */}
//                             <div className="mx-auto sm:w-11/12 lg:w-7/12 xl:w-6/12 sm:h-[61vh] xl:h-[91vh] flex items-center justify-center overflow-hidden bg-mainColor sm:rounded-tl-none xl:rounded-tl-full rounded-bl-full sm:rounded-br-full xl:rounded-br-none sm:px-6 xl:p-0">
//                                    {/* <img src="/src/assets/Images/product?.png" className='sm:w-[20rem] xl:w-[25rem] sm:h-[25rem] xl:h-[30rem] rounded-full object-cover object-center' alt="product" /> */}
//                                    <img src={product?.image_link} className='sm:w-[25rem] xl:w-[30rem] sm:h-[25rem] xl:h-[30rem] rounded-full object-cover object-center border-dashed border-4 border-white p-2' alt="product" />
//                             </div>
//                      </div>
//               </>
//        )
// }

// export default ProductDetails
import React, { useEffect, useMemo, useState } from 'react';
import { IoAddCircleSharp } from 'react-icons/io5';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Checkbox, SubmitButton } from '../../Components/Components';
import { setProductsCard } from '../../Store/CreateSlices';

// Helper functions
const calculateTotalPrice = (items, key = 'price') =>
    items.reduce((sum, item) => sum + (item[key] || 0), 0);

const calculateTotalPriceAddons = (items) =>
    items.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);

const calculateFinalPrice = (product, options, selectedExtras, checkedAddons, checkedExtra) => {
    const base = product?.price || 0;
    const extrasPrice = calculateTotalPrice(selectedExtras);
    const optsPrice = calculateTotalPrice(options);
    const addonsPrice = calculateTotalPriceAddons(checkedAddons);
    const raw = base + extrasPrice + optsPrice;

    let discount = 0;
    if (product?.discount) {
        discount = product.discount.type === 'percentage'
            ? raw * (product.discount.amount / 100)
            : product.discount.amount;
    }

    return (raw - discount + addonsPrice + calculateTotalPrice(checkedExtra)).toFixed(2);
};

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector(state => state.productsFilter.data);
    const product = products.find(p => p.id === Number(productId));
    const { t } = useTranslation();

    // State
    const [checkedExclude, setCheckedExclude] = useState([]);
    const [checkedExtra, setCheckedExtra] = useState([]);
    const [checkedAddons, setCheckedAddons] = useState([]);
    const [variationList, setVariationList] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [productPrice, setProductPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [countProduct, setCountProduct] = useState(1);

    // Handle undefined product
    if (!product) {
        return <div className="text-2xl text-center">{t("ProductNotFound")}</div>;
    }

    // Memoized extras by option
    const extrasByOption = useMemo(() => {
        return (product?.extra || []).reduce((map, x) => {
            x.pricing.forEach(p => {
                if (p.option_id != null) {
                    map[p.option_id] = map[p.option_id] || [];
                    map[p.option_id].push({ id: x.id, name: x.name, price: p.price });
                }
            });
            return map;
        }, {});
    }, [product?.extra]);

    // Calculate prices
    useEffect(() => {
        setProductPrice((product?.price || 0) + calculateTotalPrice(options) + calculateTotalPrice(selectedExtras));
        setFinalPrice(calculateFinalPrice(product, options, selectedExtras, checkedAddons, checkedExtra));
    }, [product, options, selectedExtras, checkedAddons, checkedExtra]);

    // Total price
    const totalPrice = useMemo(() => {
        const productTotal = countProduct * (finalPrice - calculateTotalPriceAddons(checkedAddons));
        const addonsTotal = calculateTotalPriceAddons(checkedAddons);
        return (productTotal + addonsTotal).toFixed(2);
    }, [countProduct, finalPrice, checkedAddons]);

    // Increment/decrement
    const increment = () => setCountProduct(prev => prev + 1);
    const decrement = () => {
        if (countProduct > 1) {
            setCountProduct(prev => prev - 1);
        }
    };

    // Handlers
    const handleCheckedExclude = id => setCheckedExclude(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    const handleCheckedExtra = (id, price) => setCheckedExtra(prev =>
        prev.some(x => x.id === id)
            ? prev.filter(x => x.id !== id)
            : [...prev, { id, price }]
    );

    const handleCheckedAddons = (id, price) => setCheckedAddons(prev => {
        const exists = prev.find(a => a.id === id);
        return exists
            ? prev.filter(a => a.id !== id)
            : [...prev, { id, count: 1, price }];
    });

    const incrementCount = id => setCheckedAddons(prev =>
        prev.map(a => a.id === id ? { ...a, count: a.count + 1 } : a)
    );

    const decrementCount = id => setCheckedAddons(prev =>
        prev.reduce((acc, a) => {
            if (a.id === id) {
                if (a.count > 1) acc.push({ ...a, count: a.count - 1 });
            } else acc.push(a);
            return acc;
        }, [])
    );

    const handleSetOption = (option, variation) => {
        setOptions(prev => {
            const isSelected = prev.some(x => x.id === option.id);
            let newOptions = [];

            if (variation.type === 'single') {
                newOptions = isSelected ? [] : [option];
                setVariationList([{ variation_id: variation.id, option_id: option.id }]);
                setSelectedExtras(prev => prev.filter(extra => !extrasByOption[option.id]?.some(e => e.id === extra.id)));
            } else {
                newOptions = isSelected ? prev.filter(x => x.id !== option.id) : [...prev, option];
                setVariationList(prevList => {
                    const existing = prevList.find(x => x.variation_id === variation.id);
                    if (existing) {
                        return prevList.map(x =>
                            x.variation_id === variation.id
                                ? {
                                      ...x,
                                      option_id: x.option_id.includes(option.id)
                                          ? x.option_id.filter(i => i !== option.id)
                                          : [...x.option_id, option.id],
                                  }
                                : x
                        );
                    }
                    return [...prevList, { variation_id: variation.id, option_id: [option.id] }];
                });
            }

            return newOptions;
        });
    };

    const handleSetExtraOption = extra => setSelectedExtras(prev =>
        prev.some(x => x.id === extra.id)
            ? prev.filter(x => x.id !== extra.id)
            : [...prev, extra]
    );

    // Build Global Extras
    const globalExtras = product?.extra?.filter(x =>
        x.pricing.some(p => p.option_id === null)
    ) || [];

    // Add to cart
    const handleAddProduct = () => {
        const addonsTotal = calculateTotalPriceAddons(checkedAddons);
        const productTotal = countProduct * (finalPrice - addonsTotal);
        const total = (productTotal + addonsTotal).toFixed(2);

        const newProduct = {
            productId: product.id,
            numberId: `${Date.now()}-${Math.random().toString(36).slice(-4)}`,
            name: product.name,
            description: product.description,
            image: product.image_link,
            addons: checkedAddons,
            extraProduct: checkedExtra,
            extraOptions: selectedExtras,
            excludes: checkedExclude,
            variations: variationList,
            options,
            note: '',
            tax: product.tax,
            discount: product.discount,
            passProductPrice: product.price + calculateTotalPriceAddons(checkedAddons) + calculateTotalPrice(options) + calculateTotalPrice(selectedExtras),
            passPrice: product.price,
            total,
            count: countProduct,
        };
        console.log("ccccc", newProduct);

        dispatch(setProductsCard(newProduct));
        navigate('/cart', { replace: true });
    };

    // Render
    return (
        <div className="flex items-start justify-between w-full sm:flex-col-reverse xl:flex-row sm:h-full gap-7">
            {/* Details Side */}
            <div className="flex flex-col sm:w-full xl:w-6/12 sm:h-auto xl:h-full sm:pl-5 xl:pl-8 sm:pr-5 xl:pr-0 gap-y-6 xl:mt-12">
                {/* Title && Price */}
                <div className="flex flex-col items-start w-full gap-y-5">
                    <span className="w-full sm:text-3xl xl:text-5xl font-TextFontMedium text-mainColor">{product?.name || ''}</span>
                    <div className="flex items-center justify-start w-full gap-x-2">
                        <div>
                            <span className="sm:text-3xl lg:text-5xl text-mainColor font-TextFontMedium">
                                {totalPrice} {t("currency")}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Details */}
                <div className="flex flex-col gap-6 p-5">
                    {/* Global Extras */}
                    {globalExtras.length > 0 && (
                        <section>
                            <h3 className="text-3xl text-mainColor">{t("Extras")}</h3>
                            <div className="flex flex-wrap gap-3">
                                {globalExtras.map(x => {
                                    const price = x.pricing.find(p => p.option_id === null).price;
                                    return (
                                        <label key={x.id} className="flex items-center gap-2">
                                            <Checkbox
                                                handleChecked={() => handleCheckedExtra(x.id, price)}
                                                isChecked={checkedExtra.some(e => e.id === x.id)}
                                                aria-label={`Add ${x.name} for ${price.toFixed(2)} ${t("currency")}`}
                                            />
                                            <span>{x.name} – {price.toFixed(2)} {t("currency")}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Excludes */}
                    {product.excludes?.length > 0 && (
                        <section>
                            <h3 className="text-3xl text-mainColor">{t("Exclude")}</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.excludes.map(ex => (
                                    <label key={ex.id} className="flex items-center gap-2">
                                        <Checkbox
                                            handleChecked={() => handleCheckedExclude(ex.id)}
                                            isChecked={checkedExclude.includes(ex.id)}
                                            aria-label={`Exclude ${ex.name}`}
                                        />
                                        <span>{ex.name}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Addons */}
                    {product.addons?.length > 0 && (
                        <section>
                            <h3 className="text-3xl text-mainColor">{t("Addons")}</h3>
                            <div className="flex flex-col gap-4">
                                {product.addons.map(addon => {
                                    const sel = checkedAddons.find(a => a.id === addon.id);
                                    return (
                                        <div key={addon.id} className="flex items-center gap-2">
                                            <Checkbox
                                                handleChecked={() => handleCheckedAddons(addon.id, addon.price)}
                                                isChecked={!!sel}
                                                aria-label={`Add ${addon.name} for ${addon.price.toFixed(2)} ${t("currency")}`}
                                            />
                                            <span>{addon.name} – {addon.price.toFixed(2)} {t("currency")}</span>
                                            {sel && (
                                                <div className="flex items-center gap-2 ml-4">
                                                    <IoIosRemoveCircle
                                                        onClick={() => decrementCount(addon.id)}
                                                        className="text-2xl cursor-pointer"
                                                        aria-label={`Decrease ${addon.name} quantity`}
                                                    />
                                                    <span>{sel.count}</span>
                                                    <IoAddCircleSharp
                                                        onClick={() => incrementCount(addon.id)}
                                                        className="text-2xl cursor-pointer"
                                                        aria-label={`Increase ${addon.name} quantity`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Variations + Option-specific Extras */}
{product.variations?.map(variation => (
    <section key={variation.id} className="mt-8">
        <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-mainColor">
                {variation.name} {variation.required ? <span className="text-red-500 text-sm">*</span> : null}
            </h3>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {variation.type === 'single' ? t('singleSelect') : t('multipleSelect')}
            </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
            {variation.required
                ? t('requiredVariation', { context: variation.type })
                : t('optionalVariation', { context: variation.type })}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {variation.options.map(option => (
                <div
                    key={option.id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                        options.some(o => o.id === option.id)
                            ? 'border-mainColor bg-mainColor/10 shadow-md'
                            : 'border-gray-200 hover:border-mainColor hover:shadow-sm'
                    } ${option.status === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <button
                        disabled={option.status === 0}
                        role="button"
                        aria-checked={options.some(o => o.id === option.id)}
                        aria-label={`Select ${option.name} for ${option.total_option_price.toFixed(2)} ${t('currency')}`}
                        className="w-full flex justify-between items-center text-left"
                        onClick={() => handleSetOption(option, variation)}
                    >
                        <span className="text-lg font-medium text-mainColor">
                            {option.name}
                        </span>
                     
                    </button>

                    {/* Option-specific extras */}
                    {options.some(o => o.id === option.id) && (extrasByOption[option.id] || []).length > 0 && (
                        <div className="mt-4 ml-2 border-t pt-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                {t('extrasFor', { option: option.name })}
                            </h4>
                            <div className="space-y-2">
                                {(extrasByOption[option.id] || []).map(ex => (
                                    <label
                                        key={ex.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            handleChecked={() => handleCheckedExtra(ex.id, ex.price)}
                                            isChecked={checkedExtra.some(e => e.id === ex.id)}
                                            aria-label={`Add ${ex.name} for ${ex.price.toFixed(2)} ${t('currency')}`}
                                        />
                                        <span className="text-sm text-gray-700">
                                            {ex.name} 
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </section>
))}

                    {/* Add to Cart */}
                    <div className="flex items-center justify-between mt-8">
                        <SubmitButton text={t("AddToCart")} handleClick={handleAddProduct} />
                        <div className="flex items-center gap-4">
                            <IoIosRemoveCircle
                                onClick={decrement}
                                className={`cursor-pointer text-5xl ${countProduct === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Decrease product quantity"
                            />
                            <span className="text-5xl">{countProduct}</span>
                            <IoAddCircleSharp
                                onClick={increment}
                                className="text-5xl cursor-pointer"
                                aria-label="Increase product quantity"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Side */}
            <div className="mx-auto sm:w-11/12 lg:w-7/12 xl:w-6/12 sm:h-[61vh] xl:h-[91vh] flex items-center justify-center overflow-hidden bg-mainColor sm:rounded-tl-none xl:rounded-tl-full rounded-bl-full sm:rounded-br-full xl:rounded-br-none sm:px-6 xl:p-0">
                <img
                    src={product?.image_link || '/src/assets/Images/fallback.png'}
                    className="sm:w-[25rem] xl:w-[30rem] sm:h-[25rem] xl:h-[30rem] rounded-full object-cover object-center border-dashed border-4 border-white p-2"
                    alt={product?.name || 'product'}
                />
            </div>
        </div>
    );
};

export default ProductDetails;