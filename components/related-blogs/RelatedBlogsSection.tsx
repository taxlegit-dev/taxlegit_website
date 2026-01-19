"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type RelatedBlog = {
  id: string;
  slug: string | null;
  title: string;
  image: string | null;
};

const FALLBACK_IMAGE_SRC = "/hero1.jpg";

export function RelatedBlogsSection({
  blogs,
}: {
  blogs: RelatedBlog[];
}) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  if (!blogs.length) return null;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-5 lg:px-0">
        {/* Heading */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-700">
            Related Articles
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug ?? blog.id}`}
              className="group block h-full"
            >
              <article
                data-aos="flip-left"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-purple-100 hover:-translate-y-2 h-full flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={blog.image || FALLBACK_IMAGE_SRC}
                    alt={'img'}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-auto line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  {/* CTA */}
                  <div className="mt-4 flex items-center text-sm font-semibold text-purple-700 group-hover:text-purple-500 transition-colors">
                    <span>Read Article</span>
                    <svg
                      className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
