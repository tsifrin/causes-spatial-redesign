import React from 'react';

export interface Article {
  title: string;
  imageUrl: string;
  source: string;
  date: string;
}

export interface NewsCarouselProps {
  articles: Article[];
}

export default function NewsCarousel({ articles }: NewsCarouselProps) {
  return (
    <div className="flex overflow-x-auto gap-6 p-6 scrollbar-hide snap-x items-center w-[90vw] max-w-5xl pointer-events-auto">
      {articles.map((article, index) => (
        <div
          key={index}
          className="flex-none w-[85vw] sm:w-[350px] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/70 border border-white/30 text-gray-900 shadow-xl snap-center cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          <div className="h-48 w-full overflow-hidden bg-gray-200">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 line-clamp-2">
              {article.title}
            </h3>
            <div className="flex justify-between items-center text-sm font-medium opacity-80">
              <span>{article.source}</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
