import { BrowserRouter, Routes, Route,useParams } from 'react-router-dom';
import Shop from '../pages/Shop/Shop';


export default function ShopURL () {
    const { category } = useParams();
    const { audience } = useParams();
    const audienceComponents = {
        all:  <Shop category={category} audience={"Everyone"} />,
        men: <Shop category={category} audience={"Men"} />,
        women: <Shop category={category} audience={"Women"} />,
        kids: <Shop category={category} audience={"Kids"} />,
    }
    
    const categoryComponents = {
      eyeglasses: audienceComponents,
      sunglasses: audienceComponents,
      "contact-lenses": audienceComponents,
    "computer-glasses": audienceComponents,
        accessories: audienceComponents,
    };
  
    return categoryComponents[category][audience] ; // Handle undefined routes
  };