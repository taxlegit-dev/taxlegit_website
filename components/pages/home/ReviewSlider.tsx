"use client";

import { useState, useCallback, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Review {
  id: number;
  name: string;
  company: string;
  rating: number;
  text: string;
  image?: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Vikas sharma",
    company: "SAMPOORAN-VIKASH FOUNDATION",
    rating: 5,
    text: "Managing accounts used to be hassel for me but taxlegit made it very simple and everything organized for me. Strongly recommend them for startups and SMEs.",
    image: "/review4.jpg",
  },
  {
    id: 2,
    name: "Durga Rajak",
    company: "KUDRAKI FOUNDATION",
    rating: 4,
    text: "I choose Taxlegit for my company registration and the entire process is so smooth and seamless. I highly recommend Taxlegit for company registration.",
    image: "/review1.jpg",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    company: "Shakti Sadhya Trust",
    rating: 5,
    text: "As an NRI looking to invest in India, I was worried about the legal and compliance complexities. TaxLegit handled everything efficiently, including company setup, approvals, and ongoing compliance. Their team is knowledgeable, responsive, and reliable. A trusted partner for anyone investing in India.",
    image: "/review2.jpg",
  },
  {
    id: 4,
    name: "Vikram Patel",
    company: "Dhruvi-ILLUMINATING FUTURES FOUNDATION",
    rating: 5,
    text: "TaxLegit manages all our accounting and tax compliance. Their team is extremely thorough, ensuring every filing is accurate and on time. Working with them gives us peace of mind and saves us a lot of time. Professional, efficient, and highly recommended.",
    image: "/review5.jpg",
  },
  {
    id: 5,
    name: "Emily Thompson",
    company: "ESAHAYAK FOUNDATION",
    rating: 5,
    text: "We set up our Section 8 company with TaxLegit, and the support we received was outstanding. They guided us through registration, compliance, and all legal formalities. Their expertise made a complex process simple and stress-free. Truly a reliable partner for social enterprises.",
    image: "/review3.jpg",
  },
  {
    id: 6,
    name: "Rajesh Sharma",
    company: "DR R P DHAWAN WELFARE FOUNDATION",
    rating: 4,
    text: "I registered my startup through TaxLegit, and the process was seamless from start to finish. The team guided me through every step, from company registration to GST compliance. Highly professional and trustworthy service. I would definitely recommend them to any entrepreneur looking to start a business in India.",
    image: "/review6.jpg",
  },
];

export default function ReviewSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getSlidesPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 1;
  };

  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Auto-play functionality
  // 🔧 SPEED CONTROL: Change the number below (in milliseconds)
  // 3000 = 3 seconds | 5000 = 5 seconds | 2000 = 2 seconds
  const AUTOPLAY_SPEED = 1000;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTOPLAY_SPEED);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, handleNext]);

  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < slidesPerView; i++) {
      visible.push(reviews[(currentIndex + i) % reviews.length]);
    }
    return visible;
  };

  return (
    <div className="relative bg-white text-black py-16 px-4 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-xl font-bold text-yellow-500">4.9</span>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-semibold text-gray-700">
              Customer Reviews
            </span>
          </div>

          <h1 className="text-2xl lg:text-5xl font-bold mb-4 text-slate-700">
            Based on 131 reviews
          </h1>
        </div>

        {/* Slider */}
        <div
          className="relative px-4 lg:px-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleReviews().map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 flex flex-col justify-between transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-purple-100 relative overflow-hidden group"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-purple-600" />
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  {review.image ? (
                    <div className="w-14 h-14 rounded-full ">
                      <Image
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                        height={50}
                        width={50}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-lg text-gray-800">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {review.company}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4 gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-sm leading-relaxed flex-grow">
                  &quot;{review.text}&quot;
                </p>

                {/* Gradient Border Effect on Hover */}
                <div className="absolute inset-0 rounded-3xl "></div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              className="pointer-events-auto h-12 w-12 rounded-full bg-white shadow-lg text-purple-600 grid place-items-center hover:bg-purple-800 hover:text-white transform hover:scale-110 active:scale-95 transition-all duration-300 -ml-6"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto h-12 w-12 rounded-full bg-white shadow-lg text-purple-600 grid place-items-center hover:bg-purple-700 hover:text-white transform hover:scale-110 active:scale-95 transition-all duration-300 -mr-6"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-8 h-3 bg-purple-600"
                  : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
