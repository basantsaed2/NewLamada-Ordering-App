// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Splide, SplideSlide } from '@splidejs/react-splide';
// import '@splidejs/react-splide/css';
// import { setProductsFilter } from '../../../Store/CreateSlices';
// import { Banners } from '../../page';
// import Image from '../../../assets/Images/IconNavFilter.png';

// const CategoriesNavSection = () => {

//   const dispatch = useDispatch();
//   const categories = useSelector((state) => state.categories?.data);
//   const products = useSelector((state) => state.products?.data);

//   // Initialize state from localStorage if available
//   const [activeTab, setActiveTab] = useState(() => {
//     const saved = localStorage.getItem('activeCategory');
//     return saved || '';
//   });

//   const [activeTabImage, setActiveTabImage] = useState(() => {
//     const saved = localStorage.getItem('activeCategoryImage');
//     return saved || '';
//   });

//   const [activeSubTab, setActiveSubTab] = useState(() => {
//     const saved = localStorage.getItem('activeSubCategory');
//     return saved || null;
//   });

//   const [categoriesFilter, setCategoriesFilter] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [itemsPerSlide, setItemsPerSlide] = useState(12);

//   // Update categories when Redux state changes
//   useEffect(() => {
//     setCategoriesFilter(categories);
//   }, [categories]);

//   useEffect(() => {
//     if (categories && categories.length > 0) {
//       // Only set default if no saved category
//       if (!activeTab) {
//         setActiveTab(categories[0]?.name || '');
//         setActiveTabImage(categories[0]?.image_link || '');
//         handleCategoryClick(categories[0]);
//       } else {
//         // Find the saved category and set it
//         const savedCategory = categories.find(cat => cat.name === activeTab);
//         if (savedCategory) {
//           setActiveTabImage(savedCategory.image_link || '');
//           handleCategoryClick(savedCategory);
//         }
//       }
//     }
//   }, [categories]);

//   // Save selections to localStorage when they change
//   useEffect(() => {
//     localStorage.setItem('activeCategory', activeTab);
//     localStorage.setItem('activeCategoryImage', activeTabImage);
//   }, [activeTab, activeTabImage]);

//   useEffect(() => {
//     localStorage.setItem('activeSubCategory', activeSubTab);
//   }, [activeSubTab]);

//   // Update itemsPerSlide based on window width
//   useEffect(() => {
//     const updateItemsPerSlide = () => {
//       const width = window.innerWidth;
//       if (width >= 1280) {
//         setItemsPerSlide(16); // 2 rows x 6 columns for big screens
//       } else if (width >= 640 && width <= 1280) {
//         setItemsPerSlide(12); // For medium screens: grid designed for 6 items per slide
//       } else {
//         setItemsPerSlide(8); // For small screens: grid designed for 4 items per slide
//       }

//     };
//     updateItemsPerSlide();
//     window.addEventListener('resize', updateItemsPerSlide);
//     return () => window.removeEventListener('resize', updateItemsPerSlide);
//   }, []);

//   const handleCategoryClick = (category) => {
//     setActiveTab(category?.name);
//     setActiveTabImage(category.image_link);
//     setActiveSubTab(null);
//     if (category?.sub_categories?.length > 0) {
//       setSubCategories(category.sub_categories);

//       // If there was a saved subcategory for this category, activate it
//       const savedSubCategory = localStorage.getItem('activeSubCategory');
//       if (savedSubCategory) {
//         const subCat = category.sub_categories.find(sc => sc.name === savedSubCategory);
//         if (subCat) {
//           setTimeout(() => {
//             handleSubCategoryClick(subCat);
//           }, 0);
//         }
//       }
//     } else {
//       setSubCategories([]);
//     }
//     filterProduct(category.id, null);
//   };

//   const handleSubCategoryClick = (subCategory) => {
//     setActiveSubTab(subCategory?.name);
//     filterProduct(subCategory.category_id, subCategory.id);
//   };

//   const filterProduct = (categoryId, subCategoryId) => {
//     let filteredProducts = products;
//     if (categoryId) {
//       filteredProducts = filteredProducts.filter(
//         (product) => product.category_id === categoryId
//       );
//     }
//     if (subCategoryId) {
//       filteredProducts = filteredProducts.filter(
//         (product) => product.sub_category_id === subCategoryId
//       );
//     }
//     dispatch(setProductsFilter(filteredProducts));
//   };

//   // Combine the "All" category with the rest of your categories
//   const allCategories = [...categoriesFilter];

//   // Group categories into chunks based on itemsPerSlide
//   const groupCategoriesByChunk = (categories, chunkSize) => {
//     const groups = [];
//     for (let i = 0; i < categories.length; i += chunkSize) {
//       groups.push(categories.slice(i, i + chunkSize));
//     }
//     return groups;
//   };

//   const groupedCategories = groupCategoriesByChunk(allCategories, itemsPerSlide);

//   return (
//     <div className="flex flex-col items-center w-screen gap-2">
//       <Banners />

//       {/* Categories Slider */}
//       <div className="w-full">
//         <Splide
//           options={{
//             type: 'slide',
//             perPage: 1,
//             pagination: true,
//             arrows: true,
//             gap: '1rem',
//             autoplay: true,
//             interval: 6000,
//             pauseOnHover: true,
//             padding: '5%',
//           }}
//           className="w-full"
//         >
//           {groupedCategories.map((group, groupIndex) => (
//             <SplideSlide key={groupIndex}>
//               {/* The grid uses responsive classes:
//                   - "grid-cols-4" for small/medium screens
//                   - "lg:grid-cols-6" for large screens */}
//               <div className="grid w-full grid-cols-4 gap-2 mb-3 md:grid-cols-6 xl:grid-cols-8">
//                 {group.map((category, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleCategoryClick(category)}
//                     className={`
//                     cursor-pointer flex mt-3 flex-col items-center justify-start pt-2 px-1 py-6 rounded-full rounded-b-full min-h-18 max-w-18 md:w-24 min-h-38 max-h-38 border transition-all duration-300 transform hover:scale-105
//                     shadow-md hover:shadow-xl text-center hover:bg-mainColor hover:text-white
//                     ${activeTab === category.name ? 'bg-mainColor text-white' : 'bg-white text-black'}
//                   `}
//                   >
//                     <div className="flex justify-center w-16 h-16 mb-2 rounded-full min-h-16 max-h-16">
//                       <img
//                         src={category.image_link}
//                         alt="category"
//                         className="object-cover w-full h-full rounded-full"
//                       />
//                     </div>
//                     <div className="w-full text-[10px] md:text-xs xl:text-sm  font-medium relative line-clamp-2 max-h-[3em] overflow-hidden">
//                       {category.name || '-'}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </SplideSlide>
//           ))}
//         </Splide>
//       </div>

//       <div className="flex items-center justify-center w-full gap-2 mt-6">
//         <div>
//           <img
//             src={activeTabImage}
//             alt="category"
//             className="object-cover w-12 h-12 rounded-full"
//           />
//         </div>
//         <h1 className="text-xl font-extrabold tracking-wide text-mainColor">
//           {activeTab}
//         </h1>
//       </div>

//       {/* Subcategories Slider */}
//       {subCategories.length > 0 && (
//         <div className="w-full">
//           <Splide
//             options={{
//               type: 'slide',
//               perPage: 3,
//               perMove: 1,
//               pagination: true,
//               arrows: false,
//               gap: '1rem',
//               padding: '5%',
//               autoplay: true,
//               interval: 6000,
//               pauseOnHover: true,
//               breakpoints: {
//                 1024: { perPage: 3 },
//                 768: { perPage: 2 },
//                 480: { perPage: 2 },
//               },
//             }}
//             className="w-full"
//           >
//             {/* "All" Subcategory Tab */}
//             {/* <SplideSlide>
//               <div
//                 onClick={() =>
//                   handleCategoryClick(
//                     categoriesFilter.find((cat) => cat.name === activeTab)
//                   )
//                 }
//                 className={`
//                   px-4 py-2 text-center cursor-pointer rounded-lg border text-2xl whitespace-nowrap
//                   ${!activeSubTab ? 'bg-mainColor text-white' : 'border-mainColor text-mainColor'}
//                 `}
//               >
//                 All
//               </div>
//             </SplideSlide> */}
//             {subCategories.map((subCategory, index) => (
//               <SplideSlide key={index}>
//                 <div
//                   onClick={() => handleSubCategoryClick(subCategory)}
//                   className={`
//                     flex items-center justify-center gap-2 px-2 py-1 cursor-pointer rounded-lg border text-2xl whitespace-nowrap
//                     ${activeSubTab === subCategory.name ? 'bg-mainColor text-white' : 'border-mainColor text-mainColor'}
//                   `}
//                 >
//                   <div
//                     className={`
//                       w-10 h-10 rounded-full flex items-center justify-center
//                       ${activeSubTab === subCategory?.name ? 'bg-white' : 'bg-mainColor'}
//                     `}
//                   >
//                     <img
//                       src={subCategory.image_link}
//                       className="w-10 h-10 rounded-full"
//                       alt="subcategory"
//                     />
//                   </div>
//                   <span className="truncate">{subCategory.name}</span>
//                 </div>
//               </SplideSlide>
//             ))}
//           </Splide>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoriesNavSection;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { setProductsFilter } from '../../../Store/CreateSlices';
import { Banners } from '../../page';
import Image from '../../../assets/Images/IconNavFilter.png';

const CategoriesNavSection = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories?.data);
  const products = useSelector((state) => state.products?.data);

  // Initialize state from localStorage if available
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('activeCategory');
    return saved || 'Recommended Product'; // Default to 'Recommended'
  });

  const [activeTabImage, setActiveTabImage] = useState(() => {
    const saved = localStorage.getItem('activeCategoryImage');
    return saved || Image; // Default to IconNavFilter.png for Recommended
  });

  const [activeSubTab, setActiveSubTab] = useState(() => {
    const saved = localStorage.getItem('activeSubCategory');
    return saved || null;
  });

  const [categoriesFilter, setCategoriesFilter] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [itemsPerSlide, setItemsPerSlide] = useState(12);

  // Define the synthetic "Recommended" category
  const recommendedCategory = {
    name: 'Recommended Product',
    image_link: Image,
    id: 'recommended', // Unique ID for filtering
    sub_categories: [], // No subcategories for Recommended
  };

  // Update categories when Redux state changes
  useEffect(() => {
    setCategoriesFilter([recommendedCategory, ...categories]);
  }, [categories]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      if (!activeTab || activeTab === 'Recommended Product') {
        // Set Recommended as default if no saved category or explicitly Recommended
        setActiveTab('Recommended Product');
        setActiveTabImage(Image);
        handleCategoryClick(recommendedCategory);
      } else {
        // Find the saved category and set it
        const savedCategory = categories.find(cat => cat.name === activeTab);
        if (savedCategory) {
          setActiveTabImage(savedCategory.image_link || Image);
          handleCategoryClick(savedCategory);
        } else {
          // Fallback to Recommended if saved category not found
          setActiveTab('Recommended Product');
          setActiveTabImage(Image);
          handleCategoryClick(recommendedCategory);
        }
      }
    } else {
      // If no categories, default to Recommended
      setActiveTab('Recommended Product');
      setActiveTabImage(Image);
      handleCategoryClick(recommendedCategory);
    }
  }, [categories]);

  // Save selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('activeCategory', activeTab);
    localStorage.setItem('activeCategoryImage', activeTabImage);
  }, [activeTab, activeTabImage]);

  useEffect(() => {
    localStorage.setItem('activeSubCategory', activeSubTab);
  }, [activeSubTab]);

  // Update itemsPerSlide based on window width
  useEffect(() => {
    const updateItemsPerSlide = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setItemsPerSlide(16); // 2 rows x 8 columns for big screens
      } else if (width >= 640 && width <= 1280) {
        setItemsPerSlide(12); // For medium screens: grid designed for 6 items per slide
      } else {
        setItemsPerSlide(8); // For small screens: grid designed for 4 items per slide
      }
    };
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    return () => window.removeEventListener('resize', updateItemsPerSlide);
  }, []);

  const handleCategoryClick = (category) => {
    setActiveTab(category?.name);
    setActiveTabImage(category.image_link);
    setActiveSubTab(null);
    if (category?.sub_categories?.length > 0) {
      setSubCategories(category.sub_categories);
      const savedSubCategory = localStorage.getItem('activeSubCategory');
      if (savedSubCategory) {
        const subCat = category.sub_categories.find(sc => sc.name === savedSubCategory);
        if (subCat) {
          setTimeout(() => {
            handleSubCategoryClick(subCat);
          }, 0);
        }
      }
    } else {
      setSubCategories([]);
    }
    filterProduct(category.id, null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setActiveSubTab(subCategory?.name);
    filterProduct(subCategory.category_id, subCategory.id);
  };

  const filterProduct = (categoryId, subCategoryId) => {
    let filteredProducts = products;
    if (categoryId === 'recommended') {
      filteredProducts = filteredProducts.filter(product => product.recommended === 1);
    } else if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_id === categoryId
      );
    }
    if (subCategoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.sub_category_id === subCategoryId
      );
    }
    dispatch(setProductsFilter(filteredProducts));
  };

  // Combine the "Recommended" category with the rest of the categories
  const allCategories = [...categoriesFilter];

  // Group categories into chunks based on itemsPerSlide
  const groupCategoriesByChunk = (categories, chunkSize) => {
    const groups = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      groups.push(categories.slice(i, i + chunkSize));
    }
    return groups;
  };

  const groupedCategories = groupCategoriesByChunk(allCategories, itemsPerSlide);

  return (
    <div className="flex flex-col items-center w-screen gap-2">
      <Banners />

      {/* Categories Slider */}
      <div className="w-full">
        <Splide
          options={{
            type: 'slide',
            perPage: 1,
            pagination: true,
            arrows: true,
            gap: '1rem',
            autoplay: true,
            interval: 6000,
            pauseOnHover: true,
            padding: '5%',
          }}
          className="w-full"
        >
          {groupedCategories.map((group, groupIndex) => (
            <SplideSlide key={groupIndex}>
              <div className="grid w-full grid-cols-4 gap-2 mb-3 md:grid-cols-6 xl:grid-cols-8">
                {group.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                    className={`
                      cursor-pointer flex mt-3 flex-col items-center justify-start pt-2 px-1 py-6 rounded-full rounded-b-full min-h-18 max-w-18 md:w-24 min-h-38 max-h-38 border transition-all duration-300 transform hover:scale-105
                      shadow-md hover:shadow-xl text-center hover:bg-mainColor hover:text-white
                      ${activeTab === category.name ? 'bg-mainColor text-white' : 'bg-white text-black'}
                    `}
                  >
                    <div className="flex justify-center w-16 h-16 mb-2 rounded-full min-h-16 max-h-16">
                      <img
                        src={category.image_link}
                        alt="category"
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                    <div className="w-full text-[10px] md:text-xs xl:text-sm font-medium relative line-clamp-2 max-h-[3em] overflow-hidden">
                      {category.name || '-'}
                    </div>
                  </div>
                ))}
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>

      <div className="flex items-center justify-center w-full gap-2 mt-6">
        <div>
          <img
            src={activeTabImage}
            alt="category"
            className="object-cover w-12 h-12 rounded-full"
          />
        </div>
        <h1 className="text-xl font-extrabold tracking-wide text-mainColor">
          {activeTab}
        </h1>
      </div>

      {/* Subcategories Slider */}
      {subCategories.length > 0 && (
        <div className="w-full">
          <Splide
            options={{
              type: 'slide',
              perPage: 3,
              perMove: 1,
              pagination: true,
              arrows: false,
              gap: '1rem',
              padding: '5%',
              autoplay: true,
              interval: 6000,
              pauseOnHover: true,
              breakpoints: {
                1024: { perPage: 3 },
                768: { perPage: 2 },
                480: { perPage: 2 },
              },
            }}
            className="w-full"
          >
            {subCategories.map((subCategory, index) => (
              <SplideSlide key={index}>
                <div
                  onClick={() => handleSubCategoryClick(subCategory)}
                  className={`
                    flex items-center justify-center gap-2 px-2 py-1 cursor-pointer rounded-lg border text-2xl whitespace-nowrap
                    ${activeSubTab === subCategory.name ? 'bg-mainColor text-white' : 'border-mainColor text-mainColor'}
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${activeSubTab === subCategory?.name ? 'bg-white' : 'bg-mainColor'}
                    `}
                  >
                    <img
                      src={subCategory.image_link}
                      className="w-10 h-10 rounded-full"
                      alt="subcategory"
                    />
                  </div>
                  <span className="truncate">{subCategory.name}</span>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      )}
    </div>
  );
};

export default CategoriesNavSection;