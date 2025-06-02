// import React, { useEffect, useMemo, useState } from "react";
// import Cart from "./Cart";
// import { useDispatch, useSelector } from "react-redux";
// import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

// import {
//   removeProductsCard,
//   setTotalPrice,
//   UpdateOrder,
// } from "../../../Store/CreateSlices";

// const Carts = () => {
//   const { t, i18n } = useTranslation(); // <-- use i18n to change language

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
// // Total calculations
// useEffect(() => {
//   if (!items.length) {
//     setTotalFoodPrice(0);
//     setTax(0);
//     setDiscount(0);
//     return;
//   }

//   const calculateTotalPriceAddons = (addons) =>
//     addons.reduce((total, addon) => total + (addon?.price || 0), 0); // Removed * addon.count

//   const total = items.reduce((acc, item) => {
//     // Base product price multiplied by count
//     const baseProductPrice = (item.passPrice || 0) * item.count;
    
//     // Addons price (not multiplied by count)
//     const addonsPrice = calculateTotalPriceAddons(item.addons || []);
    
//     // Other additions (options, extras) multiplied by count
//     const additionsPrice = (item.passProductPrice - item.passPrice - calculateTotalPriceAddons(item.addons || [])) * item.count;
    
//     return acc + baseProductPrice + addonsPrice + additionsPrice;
//   }, 0);

//   const calculatedTax = items.reduce((acc, item) => {
//     const taxableAmount = (item.passPrice || 0) * item.count; // Only tax base product price
//     if (item.tax?.type === "percentage") { // Fixed typo
//       return acc + taxableAmount * (item.tax.amount / 100);
//     } else if (item.tax?.type === "value") {
//       return acc + (Number(item.tax.amount) * item.count || 0);
//     }
//     return acc;
//   }, 0);

//   const calculatedDiscount = items.reduce((acc, item) => {
//     const discountableAmount = (item.passPrice || 0) * item.count; // Only discount base product
//     if (item.discount?.type === "percentage") { // Fixed typo
//       return acc + discountableAmount * (item.discount.amount / 100);
//     } else if (item.discount?.type === "value") {
//       return acc + (Number(item.discount.amount) * item.count || 0);
//     }
//     return acc;
//   }, 0);

//   setTotalFoodPrice(total);
//   setTax(Math.round(calculatedTax * 100) / 100);
//   setDiscount(calculatedDiscount);
// }, [items]);

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

//   // Update order totals (without products)
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
//   }, [finalTotal, tax, discount, dispatch]); // Removed order from dependencies

//   // Update products in order (separate effect)
//   useEffect(() => {
//     if (!items.length) return;

//     dispatch(UpdateOrder({
//       ...order,
//       products: items.map(product => ({
//         product_id: product.productId,
//         note: product.note,
//         count: product.count,
//         addons: (product?.addons || []).map(addon => ({
//           addon_id: addon.id,
//           count: addon.count,
//         })),
//         variation: (product.variations || []).map(variation => ({
//           variation_id: variation.variation_id,
//           option_id: (product?.options || [])
//             .filter(option => option.variation_id === variation.variation_id)
//             .map(option => option.id),
//         })),
//         extra_id: [
//           ...(product?.extraProduct || []).map(ex => ex.id),
//           ...(product?.extraOptions || []).map(ex => ex.id),
//         ],
//         exclude_id: product?.excludes,
//       }))
//     }));
//   }, [items, dispatch]); // Only runs when items change

//   return (
//     <div className="flex flex-col items-center justify-center w-full gap-y-7">
//       {items.length > 0 ? (
//         items.map((item, index) => (
//           <Cart
//             key={item.numberId}
//             id={item.id}
//             suppId={item.numberId}
//             image={item.image || "/assets/Images/RedLogo.png"}
//             name={item.name}
//             description={item.description}
//             note={item.note}
//             productPriceBase={item.passPrice}
//             productPrice={item.total}
//             passProductPrice={item.passProductPrice}
//             discount={item.discount}
//             tax={item.tax}
//             addons={item.addons}
//             options={item.options}
//             taxType={taxType}
//             onDelete={() => handleDelete(item.numberId)}
//           />
//         ))
//       ) : (
//         <span className="text-2xl text-mainColor font-TextFontMedium">
//           {t("Yourcartisempty")}        </span>
//       )}


//       <div className="flex flex-col items-start justify-start w-full gap-3">
//         <span className="w-full text-3xl font-TextFontMedium text-mainColor">
//           {t("TotalFood")}: {totalFoodPrice.toFixed(2)} EGP
//         </span>

//         {taxType === "excluded" && (
//           <span className="w-full text-3xl font-TextFontMedium text-mainColor">
//             {t("Tax")}: {tax.toFixed(2)} EGP
//           </span>
//         )}

//         <span className="w-full text-3xl font-TextFontMedium text-mainColor">
//           {t("Discount")}: {discount.toFixed(2)} EGP
//         </span>

//         {
//           order.order_type === "delivery" &&
//           <span className="w-full text-3xl font-TextFontMedium text-mainColor">
//             {t("zoneprice")}: {order.delivery_price.toFixed(2)} EGP
//           </span>
//         }

//         <div className="w-full py-3 border-t-2 border-mainColor">
//           <span className="w-full text-4xl font-TextFontSemiBold text-mainColor">
//             {t("Total")}: {finalTotal.toFixed(2)} EGP
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Carts;

import React, { useEffect, useMemo, useState } from "react";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
  removeProductsCard,
  setTotalPrice,
  UpdateOrder,
} from "../../../Store/CreateSlices";

const Carts = () => {
  const { t } = useTranslation();
  const items = useSelector((state) => state?.productsCard?.data || []);
  const taxType = useSelector((state) => state?.taxType?.data || "");
  const order = useSelector((state) => state?.order?.data || {});
  const dispatch = useDispatch();

  const [totalFoodPrice, setTotalFoodPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleDelete = (productId) => {
    dispatch(removeProductsCard(productId));
  };

  // Total calculations
  useEffect(() => {
    if (!items.length) {
      setTotalFoodPrice(0);
      setTax(0);
      setDiscount(0);
      return;
    }

    const calculateTotalPriceAddons = (addons) =>
      addons.reduce((total, addon) => total + (addon?.price || 0) * (addon?.count || 1), 0);

    const total = items.reduce((acc, item) => {
      const baseProductPrice = (item.passPrice || 0) * item.count;
      const addonsPrice = calculateTotalPriceAddons(item.addons || []);
      const additionsPrice = (item.passProductPrice - item.passPrice - calculateTotalPriceAddons(item.addons || [])) * item.count;
      return acc + baseProductPrice + addonsPrice + additionsPrice;
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
  }, [items]);

  // Calculate base total without delivery price
  const baseTotal = useMemo(() => {
    return taxType === "excluded"
      ? totalFoodPrice + tax - discount
      : totalFoodPrice - discount;
  }, [totalFoodPrice, tax, discount, taxType]);

  // Calculate final total with delivery if needed
  const finalTotal = useMemo(() => {
    let total = baseTotal;
    if (order?.order_type === "delivery" && order?.delivery_price) {
      total += Number(order.delivery_price);
    }
    return total;
  }, [baseTotal, order?.order_type, order?.delivery_price]);

  // Update order totals
  useEffect(() => {
    dispatch(
      UpdateOrder({
        ...order,
        amount: finalTotal,
        total_tax: tax,
        total_discount: discount,
      })
    );
    dispatch(setTotalPrice(finalTotal));
  }, [finalTotal, tax, discount, dispatch]);

  // Update products in order
  useEffect(() => {
    if (!items.length) return;

    dispatch(UpdateOrder({
      ...order,
      products: items.map(product => ({
        product_id: product.productId,
        note: product.note,
        count: product.count,
        addons: (product?.addons || []).map(addon => ({
          addon_id: addon.id,
          count: addon.count,
        })),
        variation: (product.variations || []).map(variation => ({
          variation_id: variation.variation_id,
          option_id: (product?.options || [])
            .filter(option => option.variation_id === variation.variation_id)
            .map(option => option.id),
        })),
        extra_id: [
          ...(product?.extraProduct || []).map(ex => ex.id),
          ...(product?.extraOptions || []).map(ex => ex.id),
        ],
        exclude_id: product?.excludes,
      }))
    }));
  }, [items, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-7">
      {items.length > 0 ? (
        items.map((item, index) => (
          <Cart
            key={item.numberId}
            id={item.id}
            suppId={item.numberId}
            image={item.image || "/assets/Images/RedLogo.png"}
            name={item.name}
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

      <div className="flex flex-col items-start justify-start w-full gap-3">
        <span className="w-full text-3xl font-TextFontMedium text-mainColor">
          {t("TotalFood")}: {totalFoodPrice.toFixed(2)} EGP
        </span>

        {taxType === "excluded" && (
          <span className="w-full text-3xl font-TextFontMedium text-mainColor">
            {t("Tax")}: {tax.toFixed(2)} EGP
          </span>
        )}

        <span className="w-full text-3xl font-TextFontMedium text-mainColor">
          {t("Discount")}: {discount.toFixed(2)} EGP
        </span>

        {order.order_type === "delivery" && (
          <span className="w-full text-3xl font-TextFontMedium text-mainColor">
            {t("zoneprice")}: {(order.delivery_price || 0).toFixed(2)} EGP
          </span>
        )}

        <div className="w-full py-3 border-t-2 border-mainColor">
          <span className="w-full text-4xl font-TextFontSemiBold text-mainColor">
            {t("Total")}: {finalTotal.toFixed(2)} EGP
          </span>
        </div>
      </div>
    </div>
  );
};

export default Carts;
