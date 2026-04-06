import { useEffect, useState } from "react";
import { IconButton, TitleButton } from "../../../components/button";
import { TransitionLink } from "@/Routes/TransitionLink";
import PropTypes from "prop-types";
import categoriesData from "@/data/home/categories.json";
import Item from "@/pages/Shop/item";
import axios from "axios";
import { baseURL } from "@/url";

const CategoryCard = ({ category, index }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <TransitionLink to={category.link} className="scroll-snap-start">
      <div className="flex flex-col gap-[12px]">
        <div
          key={index}
          className="relative overflow-hidden group size-[35vw] md:size-[13.375vw]  rounded-full
            transtion-all duration-300 ease-in-out  shadow-[0px_16px_16px_-8px_rgba(12,_12,_13,_0.1),_0px_4px_4px_-4px_rgba(12,_12,_13,_0.05)] hover:shadow-[0px_3.8834950923919678px_9.71px_rgba(0,_0,_0,_0.75)]"
          style={{ aspectRatio: "auto 435/500" }}
        >
          <div
            className={`w-full h-full transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <img
              className="w-full h-full rounded-full transform group-hover:scale-110 transition-all duration-700 object-contain clickable"
              src={category.src}
              alt={category.alt}
              loading={index <= 1 ? "eager" : "lazy"}
              fetchPriority={index <= 1 ? "high" : "auto"}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {!isImageLoaded && (
            <div
              className="absolute inset-0 bg-gray-200 animate-pulse rounded-[3vw] md:rounded-[2vw]"
              style={{ aspectRatio: "auto 435/500" }}
            />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ease-in-out pointer-events-none opacity-50 md:opacity-80 group-hover:opacity-0"
            style={{
              background:
                "linear-gradient(to top,rgba(0, 0, 0, .4), rgba(0, 0, 0, 0))",
            }}
          />
        </div>
        <p className="text-center md:text-regularText text-mediumTextPhone font-medium font-roboto">
          {category.title}
        </p>
      </div>
    </TransitionLink>
  );
};

CategoryCard.propTypes = {
  category: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
};

export default function Categories() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${baseURL}/api/product/get`, {
                    params: {
                        category: 'glasses',
                        gender:  "men" ,
                        newArrivals: "false",
                        bestsellers: "true",
                        accessories: "false"
                    }
                });

                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
  return (
    <section className="py-[6vw] md:py-[7vw]">
      <div className="md:px-[4vw] bg-offwhitebg select-none mx-[-5vw]  md:mx-[-2vw] overflow-hidden flex flex-col">
        <div className="flex justify-center mb-[4vw]">
          <h2 className="text-h4TextPhone md:text-h2Text leading-[120%] text-center font-roboto font-bold">
            Shop
          </h2>
        </div>

        <div className="w-full flex flex-row gap-[4vw] md:gap-[1vw] justify-between overflow-x-auto overflow-y-hidden pt-0 pb-[6vw] md:pb-[7vw] hide-scrollbar scroll-snap-x px-[5vw] md:px-[2vw]">
          {categoriesData.CategoriesData.map((category, index) => (
            <CategoryCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
      <div className=" md:px-[4vw] bg-offwhitebg select-none mx-[-5vw]  md:mx-[-2vw] overflow-hidden flex items-center ">
        <div className=" justify-center flex flex-col gap-[4vw] md:gap-[1.5vw]">
          <h2 className="text-h4TextPhone text-left md:text-h2Text leading-[120%]  font-roboto font-bold md:max-w-[25vw]">
            Fresh Arrivals And New Selections
          </h2>
          <div className="flex flex-row w-min  gap-[4px] group">
            <TitleButton
              className2="text-[12px] md:text-regularText group-hover:text-black "
              className="group-hover:bg-btnHoverColour"
              btnHeightPhone={8}
              btnRadiusPhone={6}
              btnWidthPhone={22}
              btnHeight={4.25}
              btnWidth={13}
              btnRadius={3.125}
              btnTitle={"Shop All"}
            />

            <IconButton
              className="z-[10] shadow-[0px_1.6006783246994019px_2.4px_rgba(0,_0,_0,_0.4)] group-hover:bg-btnHoverColour group-hover:text-black"
              btnSizePhone={6}
              paddingPhone={1}
              iconWidthPhone={12}
              btnSize={4.25}
              padding={1.25}
              iconWidth={2.1875}
            />
          </div>
        </div>
        <div className="border-darkslategrey h-[11.1vw] border-solid border-[.5px] mx-[4vw]">
        </div>
        <div className="flex gap-[1.5vw] overflow-auto hide-scrollbar">
            {products.length > 0 ? (
                                        products.map((item, index) => (
                                            <div className=" shrink-0  max-w-[360px] " key={index} >
                                                <Item 
                                                    product={item}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 md:col-span-3 flex justify-center items-center h-[50vw] md:h-[20vw]">
                                            <div className="text-center">
                                                <h4 className="text-h4TextPhone md:text-h4Text font-dyeLine font-bold mb-[2vw] md:mb-[1vw]">No Products Found</h4>
                                                <p className="text-regularTextPhone md:text-regularText font-roboto text-gray-600">
                                                    We couldn&apos;t find any products matching your criteria.
                                                </p>
                                            </div>
                                        </div>
                                    )}
        </div>
      </div>
    </section>
  );
}
