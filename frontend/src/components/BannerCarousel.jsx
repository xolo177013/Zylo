import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    gradient: 'from-brand-600 via-brand-500 to-indigo-500',
    eyebrow: 'Tech Week',
    title: 'Big Electronics Sale',
    subtitle: 'Up to 40% off on headphones, TVs & laptops',
    category: 'Electronics'
  },
  {
    id: 2,
    gradient: 'from-accent-500 via-rose-500 to-pink-500',
    eyebrow: 'New In',
    title: 'Fashion Fiesta',
    subtitle: 'Trendy footwear & accessories starting ₹499',
    category: 'Fashion'
  },
  {
    id: 3,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    eyebrow: 'Home Refresh',
    title: 'Home & Kitchen Essentials',
    subtitle: 'Upgrade your space with top brands',
    category: 'Home'
  }
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % banners.length), []);
  const prev = () => setIndex((i) => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[index];

  return (
    <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden group">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 bg-gradient-to-br ${b.gradient} bg-[length:200%_200%] animate-gradientPan flex items-center px-8 md:px-12 text-white transition-opacity duration-700 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="max-w-md animate-fadeInUp" key={i === index ? b.id : undefined}>
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              {b.eyebrow}
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-extrabold mb-2 leading-tight">{b.title}</h2>
            <p className="text-sm md:text-lg opacity-90 mb-4">{b.subtitle}</p>
            <Link
              to={`/products?category=${encodeURIComponent(b.category)}`}
              className="inline-flex items-center gap-1.5 bg-white text-ink-900 text-sm font-semibold px-4 py-2 rounded-xl shadow-soft hover:-translate-y-0.5 hover:shadow-lift transition-all duration-200"
            >
              Shop now <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-sm rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-7 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
