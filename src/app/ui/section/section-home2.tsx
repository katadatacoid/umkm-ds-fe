import Image from 'next/image';

export default function SectionHome2() {
    return (
        <div className="grid grid-rows-1 gap-4 my-10 sm:my-12 lg:my-20 px-5 sm:px-6 lg:px-20">
        {/* Row 1: Main Heading and Description */}
        <div className="flex flex-col justify-start sm:justify-center items-center text-center h-auto">
          <small className="text-green-c mb-2 text-center text-base lg:text-lg  font-bold">Our Values</small>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
            Solusi Praktis untuk UMKM yang Mau Tampil Online
          </h2>
          <small className="font-normal text-[#535a56] text-base lg:text-lg max-w-3xl">
            Rumah Digital UMKM membantu bisnis Anda hadir di internet dengan cara yang
            sederhana, efisien, dan hemat biaya.
          </small>
        </div>
      
        {/* Row 2: 4 Columns with Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 sm:mt-5 lg:mt-15 ">
          {/* Icon 1 */}
          <div className="flex flex-col justify-center items-center text-center">
            <div className='bg-green-100 p-6 rounded-3xl mb-5'>
              <img src="/images/easy-use.svg" alt="Icon 1" className="w-12 h-12" />
            </div>
            <p className="text-gray-800 mt-2 text-lg sm:text-2xl">Mudah Digunakan</p>  {/* Text below Icon 1 */}
            <p className="text-gray-500 text-sm sm:text-base">Buat website sendiri tanpa skill teknis, cukup pilih desain dan isi konten.</p>  {/* Text below Icon 1 */}
          </div>
      
          {/* Icon 2 */}
          <div className="flex flex-col justify-center items-center text-center">
            <div className='bg-green-100 p-6 rounded-3xl mb-5'>
              <img src="/images/ceap-price.svg" alt="Icon 2" className="w-12 h-12" />
            </div>
            <p className="text-gray-800 mt-2 text-lg sm:text-2xl">Harga Terjangkau</p>  {/* Text below Icon 2 */}
            <p className="text-gray-500 text-sm sm:text-base">Mulai dari Rp99.000/bulan, cocok untuk semua skala UMKM.</p>  {/* Text below Icon 2 */}
          </div>
      
          {/* Icon 3 */}
          <div className="flex flex-col justify-center items-center text-center">
            <div className='bg-green-100 p-6 rounded-3xl mb-5'>
              <img src="/images/profesional.svg" alt="Icon 3" className="w-12 h-12" />
            </div>
            <p className="text-gray-800 mt-2 text-lg sm:text-2xl">Desain Profesional</p>  {/* Text below Icon 3 */}
            <p className="text-gray-500 text-sm sm:text-base">Tampilan modern, rapi, dan otomatis menyesuaikan di semua perangkat.</p>  {/* Text below Icon 3 */}
          </div>
      
          {/* Icon 4 */}
          <div className="flex flex-col justify-center items-center text-center">
            <div className='bg-green-100 p-6 rounded-3xl mb-5'>
              <img src="/images/full-support.svg" alt="Icon 4" className="w-12 h-12" />
            </div>
            <p className="text-gray-800 mt-2 text-lg sm:text-2xl">Dukungan Penuh</p>  {/* Text below Icon 4 */}
            <p className="text-gray-500 text-sm sm:text-base">Tim support siap membantu dari awal hingga website Anda siap dipakai.</p>  {/* Text below Icon 4 */}
          </div>
        </div>
      </div>
      






    )
}