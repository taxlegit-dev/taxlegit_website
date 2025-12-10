import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  image?: string;
  content: string;
  createdAt: string;
  blogGroup: {
    name: string;
  };
}

export default async function RecentBlogsSection() {
  // Fetch recent 4 blogs for India region
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blogs?region=INDIA`, {
    cache: 'no-store', // Ensure fresh data
  });
  const data = await res.json();
  const blogs: Blog[] = data.blogs.slice(0, 4); // Get first 4 blogs

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-[Gilroy] text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mb-4">
            Recent Blogs
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stay updated with our latest insights and tips on business registration, compliance, and more.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.id}`} 
              className="group block h-full"
            >
              <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-2 h-full flex flex-col">
                {/* Blog Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <Image
                    src={blog.image || '/hero1.jpg'}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Blog Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                      {blog.blogGroup.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-auto line-clamp-2 leading-snug  transition-colors duration-300">
                    {blog.title}
                  </h3>

                  {/* Read More Link */}
                  <div className="mt-4 flex items-center text-sm font-semibold text-blue-700 group-hover:text-sky-500 transition-colors duration-300">
                    <span>Read Article</span>
                    <svg 
                      className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link 
            href="/blogs" 
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-700 to-sky-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="text-base md:text-lg">View All Blogs</span>
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
              <svg 
                className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>
        
      </div>
    </section>
  );
}