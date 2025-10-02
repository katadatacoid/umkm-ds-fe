import Image from 'next/image';
import Link from 'next/link';

export default function SectionHome1() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-10 lg:px-20 md:mt-30 lg:mt-5"
      style={{
        backgroundImage: `url("/images/bg-hero-1.png")`, // Replace with your image URL
        backgroundSize: 'cover', // Ensures the image covers the entire grid area
        backgroundPosition: 'center', // Centers the image within the grid
      }}
    >
      {/* Column 1 */}
      <div className="px-2 sm:px-10 flex flex-col justify-center items-start order-2 sm:order-1">
        <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 mb-4 text-start">
          Kembangkan Bisnis dan <span className="text-green-500">Rumah Digital buat UMKM Anda</span>.
        </h4>
        <p className="text-gray-700 mb-6 text-start">
          Bangun kehadiran digital bisnis Anda dan raih lebih banyak pelanggan dengan mudah.
        </p>
        <Link href="/daftar">
          <button
            className="bg-green-c text-white px-6 py-4 rounded-full w-80 sm:w-72 lg:w-80 hover:bg-green-700 mx-auto sm:mx-0">
            Gabung Sekarang
          </button>
        </Link>

      </div>



      {/* Column 2 with Image */}
      <div className="px-2 flex justify-center items-center order-1 sm:order-2 col-span-1 sm:col-span-1">
        {/* Image for Column 2 */}
        <Image
          src="/images/imagehero.webp" // Replace with your image URL
          alt="Image for Column 2"
          width={1200} // Set the desired width for desktop screens
          height={800} // Set the desired height (adjust the ratio)
          className="sm:w-1/2 md:w-3/4 lg:w-full h-auto rounded-lg" // Makes the image responsive and rounded
          layout="intrinsic" // Ensures the image respects its aspect ratio
        />
      </div>
    </div>

  )
}