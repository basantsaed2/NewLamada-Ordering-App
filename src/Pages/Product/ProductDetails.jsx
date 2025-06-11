
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

    // const handleAddProduct = () => {
    //     const addonsTotal = calculateTotalPriceAddons(checkedAddons);
    //     const productTotal = countProduct * (finalPrice - addonsTotal);
    //     const total = (productTotal + addonsTotal).toFixed(2);

    //     const newProduct = {
    //         productId: product.id,
    //         numberId: `${Date.now()}-${Math.random().toString(36).slice(-4)}`,
    //         name: product.name,
    //         description: product.description,
    //         image: product.image_link,
    //         addons: checkedAddons,
    //         extraProduct: checkedExtra,
    //         extraOptions: selectedExtras,
    //         excludes: checkedExclude,
    //         variations: variationList,
    //         options,
    //         note: '',
    //         tax: product.tax,
    //         discount: product.discount,
    //         passProductPrice: product.price + calculateTotalPriceAddons(checkedAddons) + calculateTotalPrice(options) + calculateTotalPrice(selectedExtras),
    //         passPrice: product.price,
    //         total,
    //         count: countProduct,
    //     };
    //     console.log('Adding to cart:', newProduct);

    //     dispatch(setProductsCard(newProduct));
    //     auth.toastSuccess(t('AddedToCart')); // Add success notification
    //     navigate('/cart', { replace: true });
    // };

    // Render
    return (
        <div className="flex items-start justify-between w-full p-2 sm:flex-col-reverse xl:flex-row sm:h-full gap-7">
            {/* Details Side */}
            <div className="flex flex-col sm:w-full xl:w-6/12 sm:h-auto xl:h-full sm:pl-5 xl:pl-8 sm:pr-5 xl:pr-0 gap-y-6 xl:mt-12">
                {/* Title && Price */}
                <div className="flex flex-col items-start w-full gap-y-5">
                    <span className="w-full sm:text-3xl xl:text-5xl font-TextFontMedium text-mainColor">{product?.name || ''}</span>
                    <div className="flex items-center justify-start w-full gap-x-2">
                        <div>
                            <span className="sm:text-3xl lg:text-5xl text-mainColor font-TextFontMedium">
                                {totalPrice}  EGP
                                {/* {t("EGP")} */}
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
                    {/* Variations + Option-specific Extras */}
                    {product.variations?.map(variation => (
                        <section key={variation.id} className="mt-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-semibold text-mainColor">
                                    {variation.name} {variation.required ? <span className="text-sm text-red-500">*</span> : null}
                                </h3>
                                <span className="px-2 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                                    {variation.type === 'single' ? t('singleSelect') : t('multipleSelect')}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                                {variation.required
                                    ? t('requiredVariation', { context: variation.type })
                                    : t('optionalVariation', { context: variation.type })}
                            </p>
                            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3">
                                {variation.options.map(option => (
                                    <div
                                        key={option.id}
                                        className={`border rounded-lg  transition-all duration-200 ${options.some(o => o.id === option.id)
                                                ? 'border-mainColor bg-mainColor shadow-md text-white'
                                                : 'border-mainColor hover:border-mainColor hover:shadow-sm text-mainColor'
                                            } ${option.status === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <button
                                            disabled={option.status === 0}
                                            role="button"
                                            aria-checked={options.some(o => o.id === option.id)}
                                            aria-label={`Select ${option.name} for ${option.total_option_price.toFixed(2)} ${t('currency')}`}
                                            className="flex items-center justify-between w-full p-4 text-left"
                                            onClick={() => handleSetOption(option, variation)}
                                        >
                                            <span className="text-lg font-medium ">
                                                {option.name}
                                            </span>

                                        </button>

                                        {/* Option-specific extras */}
                                        {options.some(o => o.id === option.id) && (extrasByOption[option.id] || []).length > 0 && (
                                            <div className="pt-3 mt-4 ml-2 border-t">
                                                <h4 className="mb-2 text-sm font-semibold text-gray-700">
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
                    <div className="flex flex-col-reverse items-center justify-between gap-3 mt-8 md:flex-row">
                        <SubmitButton text={t("AddToCart")} handleClick={handleAddProduct} />
                        <div className="flex items-center gap-4">
                            <IoIosRemoveCircle
                                onClick={decrement}
                                className={`cursor-pointer text-5xl text-mainColor ${countProduct === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Decrease product quantity"
                            />
                            <span className="text-5xl">{countProduct}</span>
                            <IoAddCircleSharp
                                onClick={increment}
                                className="text-5xl cursor-pointer text-mainColor"
                                aria-label="Increase product quantity"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Side */}
            <div className="mx-auto sm:w-11/12 lg:w-7/12 xl:w-6/12 sm:h-[61vh] md:h-[70vh]  lg:px-10 lg:pt-10 xl:h-[91vh] flex items-center lg:items-start justify-end   overflow-hidden    ">
                <img
                    src={product?.image_link || '/src/assets/Images/fallback.png'}
                    className="sm:w-[23rem] md:w-[28rem] lg:w-[33rem] xl:w-[36rem] sm:h-[23rem] md:h-[28rem] lg:h-[33rem] xl:h-[36rem]  rounded-[20px] object-cover object-center   "
                    alt={product?.name || 'product'}
                />
            </div>

        </div>
    );
};

export default ProductDetails;