// import React, { useEffect, useMemo, useState } from "react";
// import Cart from "./Cart";
// import { useDispatch, useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";
// import {
//   removeProductsCard,
//   setTotalPrice,
//   UpdateOrder,
// } from "../../../Store/CreateSlices";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../../Context/Auth";

// const Carts = () => {
//   // test

//   const auth = useAuth();
//   const navigate = useNavigate();

//   const orders = useSelector((state) => state?.order?.data || {});
//   const productsSelected = useSelector(
//     (state) => state?.productsCard?.data || []
//   );

//   const handleOrder = () => {
//     console.log("productsSelected.length", productsSelected.length);
//     if (productsSelected.length === 0) {
//       auth.toastError(t("Yourcartisempty"));
//     } else {
//       if (!auth.user) {
//         auth.toastError("You must be logged in to continue.");
//         navigate("/auth/login", { replace: true });
//         return;
//       } else {
//         navigate("/check_out", { replace: true });
//         dispatch(UpdateOrder({ ...orders, products: productsSelected }));
//       }
//     }
//   };

//   const { t } = useTranslation();
//   const items = useSelector((state) => state?.productsCard?.data || []);
//   const taxType = useSelector((state) => state?.taxType?.data || "");
//   const order = useSelector((state) => state?.order?.data || {});
//   const dispatch = useDispatch();

//   const [totalFoodPrice, setTotalFoodPrice] = useState(0);
//   const [tax, setTax] = useState(0);
//   const [discount, setDiscount] = useState(0);

//   const handleDelete = (productId) => {
//     dispatch(removeProductsCard(productId));
//   };

//   // Total calculations
//   useEffect(() => {
//     if (!items.length) {
//       setTotalFoodPrice(0);
//       setTax(0);
//       setDiscount(0);
//       return;
//     }

//     const calculateTotalPriceAddons = (addons) =>
//       addons.reduce(
//         (total, addon) => total + (addon?.price || 0) * (addon?.count || 1),
//         0
//       );

//     const total = items.reduce((acc, item) => {
//       const baseProductPrice = (item.passPrice || 0) * item.count;
//       const addonsPrice = calculateTotalPriceAddons(item.addons || []);
//       const additionsPrice =
//         (item.passProductPrice -
//           item.passPrice -
//           calculateTotalPriceAddons(item.addons || [])) *
//         item.count;
//       return acc + baseProductPrice + addonsPrice + additionsPrice;
//     }, 0);

//     const calculatedTax = items.reduce((acc, item) => {
//       const taxableAmount = (item.passPrice || 0) * item.count;
//       if (item.tax?.type === "percentage") {
//         return acc + taxableAmount * (item.tax.amount / 100);
//       } else if (item.tax?.type === "value") {
//         return acc + (Number(item.tax.amount) * item.count || 0);
//       }
//       return acc;
//     }, 0);

//     const calculatedDiscount = items.reduce((acc, item) => {
//       const discountableAmount = (item.passPrice || 0) * item.count;
//       if (item.discount?.type === "percentage") {
//         return acc + discountableAmount * (item.discount.amount / 100);
//       } else if (item.discount?.type === "value") {
//         return acc + (Number(item.discount.amount) * item.count || 0);
//       }
//       return acc;
//     }, 0);

//     setTotalFoodPrice(total);
//     setTax(Math.round(calculatedTax * 100) / 100);
//     setDiscount(calculatedDiscount);
//   }, [items]);

//   // Calculate base total without delivery price
//   const baseTotal = useMemo(() => {
//     return taxType === "excluded"
//       ? totalFoodPrice + tax - discount
//       : totalFoodPrice - discount;
//   }, [totalFoodPrice, tax, discount, taxType]);

//   // Calculate final total with delivery if needed
//   const finalTotal = useMemo(() => {
//     let total = baseTotal;
//     if (order?.order_type === "delivery" && order?.delivery_price) {
//       total += Number(order.delivery_price);
//     }
//     return total;
//   }, [baseTotal, order?.order_type, order?.delivery_price]);

//   // Update order totals
//   useEffect(() => {
//     dispatch(
//       UpdateOrder({
//         ...order,
//         amount: finalTotal,
//         total_tax: tax,
//         total_discount: discount,
//       })
//     );
//     dispatch(setTotalPrice(finalTotal));
//   }, [finalTotal, tax, discount, dispatch]);

//   // Update products in order
//   useEffect(() => {
//     if (!items.length) return;

//     dispatch(
//       UpdateOrder({
//         ...order,
//         products: items.map((product) => ({
//           product_id: product.productId,
//           note: product.note,
//           count: product.count,
//           addons: (product?.addons || []).map((addon) => ({
//             addon_id: addon.id,
//             count: addon.count,
//           })),
//           variation: (product.variations || []).map((variation) => ({
//             variation_id: variation.variation_id,
//             option_id: (product?.options || [])
//               .filter(
//                 (option) => option.variation_id === variation.variation_id
//               )
//               .map((option) => option.id),
//           })),
//           extra_id: [
//             ...(product?.extraProduct || []).map((ex) => ex.id),
//             ...(product?.extraOptions || []).map((ex) => ex.id),
//           ],
//           exclude_id: product?.excludes,
//         })),
//       })
//     );
//   }, [items, dispatch]);

//   return (
//    <div className="flex flex-col flex-wrap items-start justify-between w-full gap-4 lg:flex-row">
//   {/* Cart items section */}
//   <div className="w-full lg:w-[60%]">
//     {items.length > 0 ? (
//       items.map((item, index) => (
//         <Cart
//           key={item.numberId}
//           id={item.id}
//           suppId={item.numberId}
//           image={item.image || "/assets/Images/Redlogo.jpg"}
//           name={item.name}
//           description={item.description}
//           note={item.note}
//           productPriceBase={item.passPrice}
//           productPrice={item.total}
//           passProductPrice={item.passProductPrice}
//           discount={item.discount}
//           tax={item.tax}
//           addons={item.addons}
//           options={item.options}
//           taxType={taxType}
//           onDelete={() => handleDelete(item.numberId)}
//         />
//       ))
//     ) : (
//       <span className="text-2xl text-mainColor font-TextFontMedium">
//         {t("Yourcartisempty")}
//       </span>
//     )}
//   </div>

//   {/* Total summary section */}
//   <div className="w-full lg:w-[30%]  bg-[#F4F4F4] p-6 rounded-md shadow-sm">
//     <span className="w-full flex justify-between text-[18px] sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
//       <span>{t("TotalFood")}:</span>
//       <span>{totalFoodPrice.toFixed(2)} EGP</span>
//     </span>

//     {taxType === "excluded" && (
//       <span className="w-full flex justify-between text-[18px] sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
//         <span>{t("Tax")}:</span>
//         <span>{tax.toFixed(2)} EGP</span>
//       </span>
//     )}

//     <span className="w-full flex justify-between text-[18px] sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
//       <span>{t("Discount")}:</span>
//       <span>{discount.toFixed(2)} EGP</span>
//     </span>

//     {order.order_type === "delivery" && (
//       <span className="w-full flex justify-between text-xl sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
//         <span>{t("zoneprice")}:</span>
//         <span>{(order.delivery_price || 0).toFixed(2)} EGP</span>
//       </span>
//     )}

//     <div className="w-full py-4 border-t-2 border-[#616161] mt-4">
//       <span className="flex justify-between w-full text-[22px] sm:text-[26px] font-TextFontSemiBold text-mainColor">
//         <span>{t("Total")}:</span>
//         <span>{finalTotal.toFixed(2)} EGP</span>
//       </span>

//       <div className="flex flex-col items-center justify-end w-full gap-4 py-4 sm:gap-6">
//         <span
//           className="w-full px-10 py-3 text-xl text-center text-white transition-all duration-300 ease-in-out border-2 cursor-pointer sm:text-2xl bg-mainColor rounded-2xl hover:bg-transparent hover:text-mainColor border-mainColor"
//           onClick={handleOrder}
//         >
//           {t("Checkout")}
//         </span>
//         <Link
//           to={"/menu"}
//           className="w-full px-10 py-3 text-xl text-center transition-all duration-300 ease-in-out bg-transparent border-2 sm:text-2xl text-mainColor rounded-2xl hover:bg-mainColor hover:text-white border-mainColor"
//         >
//           {t("BuyMore")}
//         </Link>
//       </div>
//     </div>
//   </div>
// </div>

//   );
// };

// export default Carts;

import React, { useEffect, useMemo, useState } from "react";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  removeProductsCard,
  setTotalPrice,
  UpdateOrder,
} from "../../../Store/CreateSlices";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/Auth";

const Carts = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const items = useSelector((state) => state?.productsCard?.data || []);
  const taxType = useSelector((state) => state?.taxType?.data || "");
  const order = useSelector(
    (state) => state?.order?.data || {},
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );
  const dispatch = useDispatch();

  const [totalFoodPrice, setTotalFoodPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleDelete = (productId) => {
    dispatch(removeProductsCard(productId));
  };

  // Combined useEffect for totals and order updates
  useEffect(() => {
    if (!items.length) {
      setTotalFoodPrice(0);
      setTax(0);
      setDiscount(0);
      dispatch(
        UpdateOrder({
          ...order,
          amount: 0,
          total_tax: 0,
          total_discount: 0,
          products: [],
        })
      );
      dispatch(setTotalPrice(0));
      return;
    }

    const total = items.reduce((acc, item) => {
      return acc + parseFloat(item.total || 0);
    }, 0);

    const calculatedTax = items.reduce((acc, item) => {
      const taxableAmount = (item.passPrice || 0) * item.count;
      if (item.tax?.type === "percentage") {
        return acc + taxableAmount * (item.tax.amount / 100);
      } else if (item.tax?.type === "value") {
        return acc + (Number(item.tax.amount) * item.count || 0);
      }
      return acc;
    }, 0);

    const calculatedDiscount = items.reduce((acc, item) => {
      const discountableAmount = (item.passPrice || 0) * item.count;
      if (item.discount?.type === "percentage") {
        return acc + discountableAmount * (item.discount.amount / 100);
      } else if (item.discount?.type === "value") {
        return acc + (Number(item.discount.amount) * item.count || 0);
      }
      return acc;
    }, 0);

    setTotalFoodPrice(total);
    setTax(Math.round(calculatedTax * 100) / 100);
    setDiscount(calculatedDiscount);

    const baseTotal = taxType === "excluded" ? total + calculatedTax - calculatedDiscount : total - calculatedDiscount;
    const finalTotal = order?.order_type === "delivery" && order?.delivery_price ? baseTotal + Number(order.delivery_price) : baseTotal;

    const newProducts = items.map((product) => ({
      product_id: product.productId,
      note: product.note,
      count: product.count,
      addons: (product?.addons || []).map((addon) => ({
        addon_id: addon.id,
        count: addon.count,
      })),
      variation: (product.variations || []).map((variation) => ({
        variation_id: variation.variation_id,
        option_id: (product?.options || [])
          .filter((option) => option.variation_id === variation.variation_id)
          .map((option) => option.id),
      })),
      extra_id: [
        ...(product?.extraProduct || []).map((ex) => ex.id),
        ...(product?.extraOptions || []).map((ex) => ex.id),
      ],
      exclude_id: product?.excludes,
    }));

    // Only dispatch if totals or products have changed
    if (
      finalTotal !== order.amount ||
      calculatedTax !== order.total_tax ||
      calculatedDiscount !== order.total_discount ||
      JSON.stringify(newProducts) !== JSON.stringify(order.products || [])
    ) {
      dispatch(
        UpdateOrder({
          ...order,
          amount: finalTotal,
          total_tax: calculatedTax,
          total_discount: calculatedDiscount,
          products: newProducts,
        })
      );
      dispatch(setTotalPrice(finalTotal));
    }
  }, [items, taxType, order, dispatch]);

  // Calculate base total without delivery price
  const baseTotal = useMemo(() => {
    return taxType === "excluded" ? totalFoodPrice + tax - discount : totalFoodPrice - discount;
  }, [totalFoodPrice, tax, discount, taxType]);

  // Calculate final total with delivery if needed
  const finalTotal = useMemo(() => {
    let total = baseTotal;
    if (order?.order_type === "delivery" && order?.delivery_price) {
      total += Number(order.delivery_price);
    }
    return total;
  }, [baseTotal, order?.order_type, order?.delivery_price]);

  const handleOrder = () => {
    if (items.length === 0) {
      auth.toastError(t("Yourcartisempty"));
    } else if (!auth.user) {
      auth.toastError("You must be logged in to continue.");
      navigate("/auth/login", { replace: true });
    } else {
      navigate("/check_out", { replace: true });
    }
  };

  return (
    <div className="flex flex-col flex-wrap items-start justify-between gap-4 xl:gap-0 w-full xl:flex-row">
      {/* Cart items section */}
      <div className="w-full xl:w-[60%]">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Cart
              key={item.numberId}
              id={item.id}
              suppId={item.numberId}
              image={item.image || "/assets/Images/Redlogo.jpg"}
              name={item.name}
              count={item.count}
              description={item.description}
              note={item.note}
              productPriceBase={item.passPrice}
              productPrice={item.total}
              passProductPrice={item.passProductPrice}
              discount={item.discount}
              tax={item.tax}
              addons={item.addons}
              options={item.options}
              taxType={taxType}
              onDelete={() => handleDelete(item.numberId)}
            />
          ))
        ) : (
          <span className="text-2xl text-mainColor font-TextFontMedium">
            {t("Yourcartisempty")}
          </span>
        )}
      </div>

      {/* Total summary section */}
      <div className="w-full xl:w-[30%] bg-[#F4F4F4] p-6 rounded-md shadow-sm">
        <span className="w-full flex justify-between text-[18px] sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
          <span>{t("TotalFood")}:</span>
          <span>{totalFoodPrice.toFixed(2)} EGP</span>
        </span>

        {taxType === "excluded" && (
          <span className="w-full flex justify-between text-[18px] sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
            <span>{t("Tax")}:</span>
            <span>{tax.toFixed(2)} EGP</span>
          </span>
        )}

        <span className="w-full flex justify-between text-[18px] sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
          <span>{t("Discount")}:</span>
          <span>{discount.toFixed(2)} EGP</span>
        </span>

        {order.order_type === "delivery" && (
          <span className="w-full flex justify-between text-xl sm:text-[16px] font-TextFontMedium text-[#5E5E5E]">
            <span>{t("zoneprice")}:</span>
            <span>{(order.delivery_price || 0).toFixed(2)} EGP</span>
          </span>
        )}

        <div className="w-full py-4 border-t-2 border-[#616161] mt-4">
          <span className="flex justify-between w-full text-[22px] sm:text-[26px] font-TextFontSemiBold text-mainColor">
            <span>{t("Total")}:</span>
            <span>{finalTotal.toFixed(2)} EGP</span>
          </span>

          <div className="flex flex-col items-center justify-end w-full gap-4 py-4 sm:gap-6">
            <span
              className="w-full px-10 py-3 text-xl text-center text-white transition-all duration-300 ease-in-out border-2 cursor-pointer sm:text-2xl bg-mainColor rounded-2xl hover:bg-transparent hover:text-mainColor border-mainColor"
              onClick={handleOrder}
            >
              {t("Checkout")}
            </span>
            <Link
              to={"/menu"}
              className="w-full px-10 py-3 text-xl text-center transition-all duration-300 ease-in-out bg-transparent border-2 sm:text-2xl text-mainColor rounded-2xl hover:bg-mainColor hover:text-white border-mainColor"
            >
              {t("BuyMore")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carts;
