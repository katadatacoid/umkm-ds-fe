import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

const FooterHome = () => {
  return (
    <footer className="bg-green-c text-white mt-5 py-30 relative">

<img 
        src="/images/titik-titik.png" 
        alt="Top Left Image" 
        className="absolute top-0 left-10 sm:left-30 w-24  hover:opacity-100 transition-opacity" 
      />

      {/* Bottom Right Image */}
      <img 
        src="/images/titik-titik.png" 
        alt="Bottom Right Image" 
        className="absolute bottom-0 right-10 sm:right-30 w-24  hover:opacity-100 transition-opacity" 
      />
      <div className="container mx-auto px-6 flex flex-col sm:flex-row sm:justify-between">
        {/* Left Section */}
        <div className="flex flex-col space-y-2 sm:w-1/3 w-full mb-6 sm:mb-0">
          <div className="flex items-center space-x-2">
          <div
        className="w-32 h-12 bg-white"
        style={{
          maskImage: 'url("/images/logo_rdku.svg")',
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center center'
        }}
      ></div>

          </div>
          <p className="mt-2 text-sm">
            Rumah Digital UMKM adalah solusi pembuatan website profesional untuk pelaku usaha kecil dan menengah
          </p>
       
          <div className="flex h-9 gap-3 mt-2">
            <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
            <FontAwesomeIcon icon={faTwitter} className="text-xs" />
            <FontAwesomeIcon icon={faLinkedinIn} className="text-xs" />
            <FontAwesomeIcon icon={faInstagram} className="text-xs" />
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col sm:flex-row sm:space-x-12 sm:w-1/2 w-full lg:ml-10 mb-6 sm:mb-0">
          <div className="flex flex-col">
            <h4 className="font-semibold">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-gray-300">Tentang Kami</a></li>
              <li><a href="/umkm" className="hover:text-gray-300">UMKM Unggulan</a></li>
              <li><a href="/product" className="hover:text-gray-300">Produk UMKM</a></li>
              <li><a href="/contact" className="hover:text-gray-300">Kontak Kami</a></li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold">Jelajahi Kami</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-300">Privasi</a></li>
              <li><a href="#" className="hover:text-gray-300">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col sm:w-1/3 w-full text-sm">
          <h4 className="font-semibold">Rumah Digital UMKM</h4>
          <p className="mt-2">umkm@katadata.id</p>
          <p>+62-217209195</p>
          <p>Jl. Bulungan No.76, Kota Jakarta Selatan 12130</p>
        </div>
      </div>

      {/* Footer Copyright Section */}
      <div className="text-center mt-8 text-xs">
        <p>Copyright 2025 by Rumah Digital UMKM - All rights reserved</p>
      </div>
    </footer>
  );
};

export default FooterHome;
