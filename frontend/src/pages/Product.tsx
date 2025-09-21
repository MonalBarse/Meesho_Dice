import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/ProductDescription';
import CustomerReviews from '../components/CustomerReviews';
import RelatedProducts from '../components/RelatedProducts';
import MeasurementForm from '../components/Measurementform';

function Product() {
  const [fullscreenImage,setFullscreenImage]=useState<boolean>(false)

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar
       setFullscreenImage={setFullscreenImage}/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery />
          </div>

          {/* Product Information */}
          <div>
            <ProductInfo />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-12">
          <ProductDescription />
        </div>

        {/* Customer Reviews */}
        <div className="mb-12">
          <CustomerReviews />
        </div>

        {/* Related Products */}
        <div>
          <RelatedProducts />
        </div>
      </main>

       {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setFullscreenImage(false)}
        >
          <div
            className="relative bg-white rounded-xl shadow-xl max-w-[95vw] max-h-[85vh] overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold hover:text-blue-900 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md"
              onClick={() => setFullscreenImage(false)}
            >
              ✖
            </button>

          <div className=" min-h-56 min-w-80">
        {/*<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">MY FIT</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form action="#" method="POST" className="space-y-6">
      <div>
        <label for="email" class="block text-sm/6 font-medium text-gray-900">Waist</label>
        <div className="mt-2">
          <input id="email" type="email" name="email"  className="block w-full rounded-md bg-slate-300 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label for="password" class="block text-sm/6 font-medium text-gray-900">Height</label>
        </div>
        <div className="mt-2">
          <input id="password" type="password" name="password"  className="bg-slate-300 block w-full rounded-md  px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
      </div>
<div>

  <div className="flex items-center justify-between">
          <label for="clerk" class="block text-sm/6 font-medium text-gray-900">weight</label>
        </div>
        <div className="mt-2">
          <input id="clerk" type="clerk" name="clerk"  className="bg-slate-300 block w-full rounded-md  px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>

</div>
      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
      </div>
    </form>

    <p className="mt-10 text-center text-sm/6 text-gray-500">
      Do not know your sizes?

    </p>
  </div>
</div>*/}
<MeasurementForm/>
          </div>



          </div>
        </div>
      )}


    </div>
  );
}

export default Product;