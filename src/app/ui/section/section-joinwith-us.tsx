function JoinUsImage() {
  return (
    <div className="w-full lg:w-auto mt-10 mb-7 md:my-30">
      {/* Image container with rounded corners and border */}
      <div className="overflow-hidden rounded-full border-[5px] border-[#31b380] w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
        <img 
          src="/images/join-withus.png" 
          alt="Join With Us"
          className="w-2xl h-auto object-cover" // Ensures image fills container
        />
      </div>
    </div>
  );
}


export default function SectionJoinWithUs() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-6 sm:px-10 lg:px-10 md:mt-30 lg:mt-10"
      style={{
        backgroundImage: `url("/images/bg-sectionjoinus.png")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Column 1 */}
      <div className="px-2 sm:px-5 flex flex-col justify-center items-start order-2 sm:order-1">
        <p className="text-green-c mb-6 text-start font-semibold">
          Join With Us
        </p>
        <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 mb-4 text-start">
          Jangkau Lebih Banyak Pelanggan Hari Ini
        </h4>
        <p className="text-gray-700 mb-6 text-start">
          Solusi digital lengkap, praktis, dan ramah kantong
          untuk semua tahap bisnis.
        </p>
        <button className="bg-green-c text-white px-6 py-4 rounded-full w-80 sm:w-72 lg:w-80 hover:bg-green-700 mx-auto sm:mx-0">
          Gabung Sekarang
        </button>
      </div>

      {/* Column 2 with Image */}
      <div className="w-full flex justify-center items-center order-1 sm:order-2 col-span-1 sm:col-span-1">
        <JoinUsImage />
      </div>
    </div>
  );
}
