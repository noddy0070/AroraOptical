export const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="text-black text-xl">★</span>);
  }

  if (hasHalf) {
    stars.push(<span key="half" className="text-black text-xl">⯨</span>); // OR use a custom half-star SVG
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>);
  }

  return stars;
};

